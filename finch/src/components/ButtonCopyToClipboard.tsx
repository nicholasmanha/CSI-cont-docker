import { useState, useEffect, useCallback } from 'react';

const clipBoardDocument = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5A3.375 3.375 0 0 0 6.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0 0 15 2.25h-1.5a2.251 2.251 0 0 0-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 0 0-9-9Z" />
    </svg>;

const clipBoardDocumentCheck = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="">
<path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75" />
</svg>

export type ButtonCopyToClipboardProps = {
    copyText: string;
    cb?: Function;
    size?: 'small' | 'medium' | 'large'
}

export default function ButtonCopyToClipboard({
    copyText,
    cb,
    size='medium',
    ...props
}: ButtonCopyToClipboardProps) {
    const [ isCopied, setIsCopied ] = useState<boolean>(false);
    const handleCopyClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        navigator.clipboard.writeText(copyText)
            .then(() => {
                setIsCopied(true);
                if (cb) cb();
            })
            .catch((err) => {
                console.error('Failed to copy: ', err);
            });
    }, [copyText]);

    const sizes = {
        small: 'h-6',
        medium: 'h-10',
        large: 'h-16'
    }
    return (
                <button
                    {...props} 
                    className={`${isCopied ? 'text-sky-500' : 'text-slate-400'} ${sizes[size]} aspect-square hover:text-sky-300 hover:cursor-pointer`}
                    onClick={e => handleCopyClick(e)}
                >
                    {isCopied ? clipBoardDocumentCheck : clipBoardDocument}
                </button>
    )
}