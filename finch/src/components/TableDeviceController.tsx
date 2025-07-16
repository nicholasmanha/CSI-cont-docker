import { useEffect, useState } from "react";

import { Table, TableHeader, TableHead, TableCaption, TableBody, TableRow, TableCell } from "./ui/table";
import ControllerAbsoluteMove from "./ControllerAbsoluteMove";
import ControllerRelativeMove from "./ControllerRelativeMove";
import { Devices } from "@/types/deviceControllerTypes";

export type TableDeviceControllerProps = {
    devices: Devices;
    handleSetValueRequest: (deviceName: string, value: number) => void;
    toggleDeviceLock: (deviceName: string, locked: boolean) => void;
    toggleExpand: (deviceName: string) => void;
}

export default function TableDeviceController({devices, handleSetValueRequest, toggleDeviceLock, toggleExpand}: TableDeviceControllerProps) {


    // State to track flashing rows
    const [flashingRows, setFlashingRows] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const updatedFlashingRows: Record<string, boolean> = {};
        const currentTime = Date.now() / 1000; // Current time in seconds

        Object.keys(devices).forEach((deviceName) => {
            const device = devices[deviceName];
            if (device.timestamp && currentTime - device.timestamp <= 0.03) {
                updatedFlashingRows[deviceName] = true;

                // Remove the flash effect after 1 second timeout, this timeout needs to match the animation duration of the tailwind class to avoid flutter effect
                setTimeout(() => {
                    setFlashingRows((prev) => ({
                        ...prev,
                        [deviceName]: false,
                    }));
                }, 500);
            }
        });

        setFlashingRows(updatedFlashingRows);
    }, [devices]);
    return (
        <Table className="max-w-[900px] m-auto bg-neutral-50 border border-neutral-200" >
        <TableCaption>Ophyd Devices.</TableCaption>
        <TableHeader>
            <TableRow>
            <TableHead className="w-48">Device Name</TableHead>
            <TableHead className="text-center pr-8">Current Value</TableHead>
            <TableHead className="text-left">Absolute Move</TableHead>
            <TableHead className="text-center">Relative Move</TableHead>
            </TableRow>
        </TableHeader>
            <TableBody>
                {
                    Object.keys(devices).map((deviceName) => {
                        const device = devices[deviceName];
                        return (
                            <TableRow key={deviceName} className={`${flashingRows[deviceName] ? 'animate-flash1' : ''} text-black`}>
                                <TableCell 
                                    className="hover:cursor-pointer py-5" 
                                    onClick={()=>toggleExpand(deviceName)}
                                >
                                    <>
                                        <p>{deviceName}</p>
                                        {device.expanded && <pre className="text-xs">{JSON.stringify(device, null, 2)}</pre>}
                                    </>
                                </TableCell>
                                <TableCell className="text-center text-md">
                                    {`${typeof device.value === 'number' ? device.value.toPrecision(4) : device.value} ${device.units ? device.units.slice(0, 3) : 'n/a'}`}
                                </TableCell>
                                <TableCell className="">
                                    <ControllerAbsoluteMove 
                                        handleEnter={(input)=>input!==null && handleSetValueRequest(deviceName, input)} 
                                        inputLabel={device.units && device.units.slice(0,3)}
                                    />
                                </TableCell>
                                <TableCell className="">
                                    <ControllerRelativeMove
                                        className="justify-center" 
                                        handleEnter={(input)=>input!==null && handleSetValueRequest(deviceName, input)} 
                                        inputLabel={device.units && device.units.slice(0,3)} 
                                        currentValue={typeof device.value === 'number' ? device.value : null}
                                    />
                                </TableCell>
                            </TableRow>
                        )
                    })
                }
            </TableBody>
        </Table>
    )
}