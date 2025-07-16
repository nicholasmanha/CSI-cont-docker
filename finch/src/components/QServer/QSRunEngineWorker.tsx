import { useState, useEffect } from 'react';
import { startRE } from './utils/apiClient';
import ToggleSlider from './ToggleSlider';

import QItem from "./QItem";
import { RunningQueueItem } from './types/apiTypes';

type QSRunEngineWorkerProps = {
    isREToggleOn?: boolean;
    setIsREToggleOn?: (arg: boolean) => void;
    runningItem?: RunningQueueItem | null;
};
export default function QSRunEngineWorker({ isREToggleOn=false, setIsREToggleOn=()=>{}, runningItem }: QSRunEngineWorkerProps) {
    //const [ isREToggleOn, setIsREToggleOn ] = useState(false);

    //TO DO : the toggle switch needs to listen to the GET requests for the queue status

    const toggleSwitch = async () => {
        if (isREToggleOn) {
            //switches from On to Off, calls the Off function
            setIsREToggleOn(false);
       
        } else {
            //switches from Off to On, calls the On function
            setIsREToggleOn(true); //user sees that it moves
            //use setTimeout to ensure that the toggle is seen moving up before moving down during a failure so user knows it was attempted
            setTimeout( async () => {
                const apiCallStatus = await startRE();
                if (apiCallStatus) {
                    
                } else {
                    setIsREToggleOn(false); 
                }
            }, 300);
        }
    };

    return (
        <div className="flex justify-center items-center w-full relative">
            <QItem item={runningItem} type={runningItem ? 'current' : 'blank'}/>
            <ToggleSlider isToggleOn={isREToggleOn} handleToggleClick={toggleSwitch}/>
        </div>
    )
}