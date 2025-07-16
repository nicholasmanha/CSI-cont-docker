import InputGroup from './InputGroup';

type CameraSettingsProps = {
    enableSettings?: boolean;
    settings: {
        title: string;
        prefix: string | null;
        inputs: {
            suffix: string;
            label: string;
            type: 'enum' | 'float' | 'integer' | 'string' | 'boolean';
            min?: number;
            max?: number;
            enums?: string[];
        }[]
    }[];
    prefix?: string;
    cameraSettingsPVs: {[key:string]: any};
    onSubmit?: (pv:string, value:string | boolean | number) => void
}
export default function CameraSettings({enableSettings=true, settings=[], prefix='13SIM1:cam1', cameraSettingsPVs={}, onSubmit=()=>{}}: CameraSettingsProps) {
    // const JSONDisplay = () => {
    //     return (
    //         <div className="h-1/4 max-h-96 overflow-scroll border border-sky-500">
    //             <p className="text-xl underline">Mapped values</p>
    //                 {Object.keys(cameraSettingsPVs).map((pv) => {
    //                     return (
    //                         <div key={pv}>
    //                             <p className="text-lg">{pv}</p>
    //                             <ul>
    //                                 {Object.keys(cameraSettingsPVs[pv]).map((key) => <li key={key}>{key}: {cameraSettingsPVs[pv][key]}</li> )}
    //                             </ul>
    //                         </div>
    //                     )
    //                 })}
    //             <p className="text-xl underline"> Converted JSON</p>
    //             <pre className="text-sm">{JSON.stringify(cameraSettingsPVs, null, 2)}</pre>
    //         </div>
    //     )
    // }
    
    return (
        <section className="w-full h-full min-w-96">
            <div>
                {settings.map((group) => <InputGroup key={group.title} settingsGroup={group} prefix={prefix} cameraSettingsPVs={cameraSettingsPVs} onSubmit={onSubmit}/>)}
            </div>
        </section>
    )
}