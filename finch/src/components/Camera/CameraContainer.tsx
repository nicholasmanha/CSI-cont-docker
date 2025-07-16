import { useMemo, useCallback } from "react";

import CameraCanvas from "./CameraCanvas";
import CameraControlPanel from "./CameraControlPanel";
import CameraSettings from "./CameraSettings";
import CameraCustomSetup from "./CameraCustomSetup";
//import { useCamera } from "./hooks/useCamera";
import { cameraDeviceData } from "./utils/cameraDeviceData.js";
import useOphydSocket from "@/hooks/useOphydSocket";
import { DetectorSetting } from "./types/cameraTypes";

//"13SIM1:image1:ArrayData"
export type CameraContainerProps = {
    prefix: string;
    customSetup?: boolean;
    imageArrayPV?: string;
    settings?: DetectorSetting[];
    enableControlPanel?: boolean;
    enableSettings?: boolean;
    canvasSize?: 'small' | 'medium' | 'large' | 'automatic';
    sizePVs?: {
        startX_pv: string;
        startY_pv: string;
        sizeX_pv: string;
        sizeY_pv: string;
        colorMode_pv: string;
        dataType_pv: string;
    }
}
export default function CameraContainer(
    {
        prefix='13SIM1', 
        customSetup=false, 
        imageArrayPV='', 
        settings=cameraDeviceData.ADSimDetector, 
        enableControlPanel=true, 
        enableSettings=true, 
        canvasSize='medium',
        sizePVs={
            startX_pv: "13SIM1:cam1:MinX",
            startY_pv: "13SIM1:cam1:MinY",
            sizeX_pv: "13SIM1:cam1:SizeX",
            sizeY_pv: "13SIM1:cam1:SizeY",
            colorMode_pv: "13SIM1:cam1:ColorMode",
            dataType_pv: "13SIM1:cam1:DataType"
        },  
    }: CameraContainerProps) 
    {

    // const {
    //     cameraControlPV,
    //     cameraSettingsPVs,
    //     onSubmitControl,
    //     onSubmitSettings,
    //     startAcquire,
    //     stopAcquire 
    // } = useCamera({prefix, settings, enableControlPanel, enableSettings});


    // refactor here, use ophyd socket instead of the previous custom hook that used PV Web Socket
        console.log({settings})


    const sanitizeInputPrefix = (prefix:string) => {
        var santizedPrefix = '';
        if (prefix.trim().slice(-1) === ':') {
            santizedPrefix = prefix.trim().substring(0, prefix.length -1)
        } else {
            santizedPrefix = prefix.trim();
        }
        return santizedPrefix;
    };

    const createDeviceNameArray = (settings:DetectorSetting[], prefix:string) => {
        //settings is an array of objects, grouped by setting type
        //ex) a single pv suffix is at settings[0].inputs[0].suffix
        //console.log({settings})

        var sanitizedPrefix = sanitizeInputPrefix(prefix);

        var pvArray:string[] = [];
        settings.forEach((group) => {
            group.inputs.forEach((input) => {
                //console.log(group.prefix)
                let pv = `${sanitizedPrefix}:${group.prefix !== null ? group.prefix + ':' : ''}${input.suffix}`
                pvArray.push(pv);
            })
        })
        if (enableControlPanel) {
            let controlPV: string | false = createControlPVString(prefix);
            controlPV && pvArray.push(controlPV);
        }
        return pvArray;
    };

    const createControlPVString = (prefix='') => {
        if (prefix === '' && enableControlPanel) {
            console.log('Error in concatenating a camera control PV, received empty prefix string');
            return false;
        }
        let acquireSuffix = 'cam1:Acquire'; //the suffix responsible for acquiring images, has a value of 1 or 0
        var controlPV = `${sanitizeInputPrefix(prefix)}:${acquireSuffix}`;
        return controlPV;
    };





    if (customSetup) {
        return (
            <div className="w-full">
                <CameraCustomSetup />
            </div>
        )
    } else {
        var deviceNames = useMemo(()=>createDeviceNameArray(settings, prefix), []);
    
    
        //we need a ws just for the control PV, since a user may only want that one
        //we need another ws just for the settings PVs, in case the user wants those options.
        //or can we just combine them into one?
    
        const {
            handleSetValueRequest,
            devices,
            toggleExpand,
            toggleDeviceLock
        } = useOphydSocket(deviceNames);
    
        const startAcquire = useCallback( () => {
            handleSetValueRequest(`${prefix}:cam1:Acquire`, 1);
        }, [])
    
        const stopAcquire = useCallback( () => {
            handleSetValueRequest(`${prefix}:cam1:Acquire`, 0);
        }, [])
    
        const onSubmitSettings = useCallback(handleSetValueRequest, []);
        console.log({devices})
    
        const cameraControlPV = devices[`${prefix}:cam1:Acquire`];

        return (
            <div className="w-full h-full flex flex-wrap space-x-4 items-start justify-center">
                <div className="flex flex-col flex-shrink-0 items-center">
                    <CameraCanvas imageArrayPV={imageArrayPV} canvasSize={canvasSize} sizePVs={sizePVs} prefix={prefix}/>
                    { enableControlPanel ? <CameraControlPanel cameraControlPV={cameraControlPV} startAcquire={startAcquire} stopAcquire={stopAcquire}/> : ''}
                </div>
                <div className='overflow-x-auto overflow-y-auto'>
                    {enableSettings ? <CameraSettings enableSettings={enableSettings} settings={settings} prefix={prefix} cameraSettingsPVs={devices} onSubmit={onSubmitSettings}/> : ''}
                </div>

            </div>
        )
    }
}