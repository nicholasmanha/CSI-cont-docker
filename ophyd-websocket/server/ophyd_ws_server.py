import asyncio
import json
import numpy as np
import uvicorn
from ophyd import EpicsSignalRO, EpicsSignal
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, FastAPI

router = APIRouter()

@router.websocket("/ophydSocket")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
       
    try:
        loop = asyncio.get_running_loop()
    except RuntimeError:
        loop = asyncio.get_event_loop()

    def addCallbacks(pv_name, signal):

        def callbackMd(**kwargs):
            # Triggered on changes to metadata, including 'connected'
            # Will trigger when signal first connects, when the signal is disconnected/reconnected
            # Does not trigger when the value changes
            message = {key: value for key, value in kwargs.items()}
            message['obj'] = pv_name #obj is an EpicsSignal which is not JSON serializable, overwrite it so the msg will send
            message['pv'] = pv_name #to be consistent with the message from callbackValue()
            try:
                asyncio.run_coroutine_threadsafe(websocket.send_json(message), loop)
            except WebSocketDisconnect:
                print(f"Connection closed while sending update for PV: {pv_name}")

        def callbackValue(value, timestamp, **kwargs):
            if isinstance(value, np.ndarray) and value.dtype.kind in ['i', 'u']:
                try:
                    # Remove null bytes and convert to string
                    cleaned_array = value[value != 0]  # Remove null terminators
                    if len(cleaned_array) > 0:
                        string_value = ''.join(chr(x) for x in cleaned_array)
                        value = string_value
                except (ValueError, OverflowError):
                    # If conversion fails, keep original value
                    pass
            # Runs only when the value changes, not when the signal disconnects OR reconnects
            message = {
                        "pv": pv_name,
                        "value": value,
                        "timestamp": timestamp,
                        "connected": signal.connected,
                        "read_access": signal.read_access,
                        "write_access": signal.write_access,
                    }
            try:
                asyncio.run_coroutine_threadsafe(websocket.send_json(message), loop)
            except WebSocketDisconnect:
                print(f"Connection closed while sending update for PV: {pv_name}")

        signal.subscribe(callbackMd, event_type='meta')
        signal.subscribe(callbackValue, event_type='value')
        subscriptions[pv_name] = signal

    async def handleSubscribe(data, requireConnection=False, readOnly=False):
        #allows user to subscribe to any pv, even if it is not connected at time of subscription
        pv_name = data.get("pv")

        if not pv_name:
            await websocket.send_json({"error": "No PV specified"})
            return

        if pv_name in subscriptions:
            await websocket.send_json({"message": f"Already subscribed to {pv_name}"})
            return

        try:
            signal = EpicsSignalRO(pv_name, name=pv_name) if readOnly else EpicsSignal(pv_name, name=pv_name)
            if requireConnection:
                signal.get()  # creates exception if can't connect to the PV
        except Exception as e:
            await websocket.send_json({"error": f"Failed to connect to PV {pv_name}: {str(e)}"})
            if requireConnection:
                return
            await websocket.send_json({"connected": False, "pv": pv_name})

        addCallbacks(pv_name, signal)
        subscriptions[pv_name] = signal

        await websocket.send_json({"message": f"Subscribed to {pv_name}"})
        return

    async def handleUnsubscribe(data):
        pv_name = data.get("pv")
        if not pv_name:
            await websocket.send_json({"error": "No PV specified"})
            return

        if pv_name in subscriptions:
            subscriptions[pv_name]._reset_sub(event_type='meta')
            subscriptions[pv_name]._reset_sub(event_type='value')
            del subscriptions[pv_name]
            await websocket.send_json({"message": f"Unsubscribed from {pv_name}"})
        else:
            await websocket.send_json({"message": f"Not subscribed to {pv_name}"})
        return

    async def handleRefresh():
        for pv_name, signal in subscriptions.items():
            #signal.get()
            subscriptions[pv_name].get()
        await websocket.send_json({"message": "Refreshed all PVs"})
        return
    
    async def handleSet(data):
        pv_name = data.get("pv")
        if not pv_name:
            await websocket.send_json({"error": "No PV specified"})
            return
        if pv_name not in subscriptions:
            await websocket.send_json({"error": f"PV {pv_name} is not subscribed. Subscribe to PV before setting value."})
            return
        
        signal = subscriptions.get(pv_name)
        if signal.write_access == False:
            await websocket.send_json({"error": f"Write access is not enabled for PV {pv_name}. Cannot set value."})
            return
        
        value = data.get("value")
        try:
            # Try to convert to number if it looks like one
            if isinstance(value, str) and value.replace('.', '').replace('-', '').isdigit():
                value = float(value) if '.' in value else int(value)
            elif not isinstance(value, (int, float, str)):
                raise ValueError("Value must be a string or number")
            # If it's already a string, int, or float, keep it as-is
        except ValueError:
            await websocket.send_json({"error": f"Value must be a number. Could not set value of {pv_name} to {value}"})
            return
        
        timeout = data.get("timeout", 1) #default 1 second timeout
        if not isinstance(timeout, (int, float)):
            await websocket.send_json({"error": f"Timeout must be a number. Could not set value of {pv_name} to {value}"})
            return
        if isinstance(value, (int, float)):
            low_limit = signal.low_limit
            high_limit = signal.high_limit
        
            if (low_limit is not None and value < low_limit) or (high_limit is not None and value > high_limit):
                #area detector limits have a low limit === high limit by default.
                if (low_limit != high_limit):
                    await websocket.send_json({"error": f"Value {value} is outside of limits for PV {pv_name}. Low limit: {low_limit}, High limit: {high_limit}"})
                    return
        
        try:
            if isinstance(value, str):
                signal.put(value, wait=True, timeout=timeout, use_complete=True)
            else:
                signal.set(value).wait(timeout=timeout)
        except Exception as error:
            await websocket.send_json({"error": f"Could not set value of {pv_name} to {value}: {str(error)}"})


    subscriptions = {}

    try:
        while True:
            message = await websocket.receive_text()
            try:
                data = json.loads(message)
                action = data.get("action")
                if (action != "subscribe" and action != "unsubscribe" and action != "refresh" and action != "subscribeSafely" and action != "subscribeReadOnly" and action != "set"):
                    await websocket.send_json({
                            "error": (
                                f"Received action: {action}, actions must be 'subscribe', 'unsubscribe', 'refresh', 'subscribeSafely', 'subscribeReadOnly', or 'set'. "
                                "Example msg: {action: 'subscribe', pv: 'IOC:m1'}"
                            )
                    })
                    continue

                if action == "subscribe":
                    await handleSubscribe(data)
                    continue
                
                if action == "subscribeSafely":
                    await handleSubscribe(data, requireConnection=True)
                    continue

                if action == 'subscribeReadOnly':
                    await handleSubscribe(data, requireConnection=False, readOnly=True)
                    continue

                if action == "unsubscribe":
                    await handleUnsubscribe(data)
                    continue

                if action == "refresh":
                    await handleRefresh()
                    continue

                if action == "set":
                    await handleSet(data)
                    continue

            except json.JSONDecodeError:
                await websocket.send_json({"error": "Invalid JSON format"})
            except Exception as e:
                await websocket.send_json({"error": f"Unexpected error: {str(e)}"})
    except Exception as e:
        print(f"Error in websocket loop: {str(e)}")
    finally:
        print("WebSocket connection closed.")




# For running the server directly

app = FastAPI()
app.include_router(router)

if __name__ == "__main__":
    uvicorn.run("ophyd_ws_server:app", host="0.0.0.0", port=8000, reload=True)