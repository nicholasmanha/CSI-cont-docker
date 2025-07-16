import { useState } from "react";

type InputStringProps = {
    label?: string;
    onSubmit?: (input: string) => void;
    isDisabled?: boolean;
};
export default function InputString ({label='', onSubmit=(input)=>{console.log('submit ' + input )}, isDisabled=false}: InputStringProps) {
    const [value, setValue] = useState('');
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            onSubmit(value);
        }
    };

    return (
        <label className="w-full max-w-64 flex justify-between">
            {label=''}
            <input
                disabled={isDisabled}
                type="text" 
                value={value} 
                className='w-1/2 border border-slate-200 pl-2' 
                onKeyDown={handleKeyPress} 
                onChange={handleChange}
            />
        </label>
    )
}