type MainProps = {
    flexWrap?: boolean;
    children?: JSX.Element;
};

export default function Main({
    flexWrap,
    children,
    ...props
}: MainProps) {
    return (
        <main className={`flex flex-grow ${flexWrap && 'flex-wrap'} bg-slate-500 overflow-auto z-0`} {...props}>
            {children}
        </main>
    )
}