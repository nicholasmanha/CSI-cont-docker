//const als_logo = "/images/als_logo_wheel.png";
export type HeaderProps = {
    /** The title */
    title?: string;
    /** Tailwind ClassName */
    textColor?: string;
    /** A valid URL path of the image (png, jpeg, etc). The image should be in public/images folder. Do not include "public" in url path */
    logoUrl?: string;
}
export default function Header({
    title='My App',
    textColor='text-sky-700',
    logoUrl='/images/als_logo_wheel.png',
    ...props
}: HeaderProps) {
    return (
        <header className="w-full border-b-slate-300 border-b flex items-center h-8 py-8 justify-center space-x-4" {...props}>
            <img src={logoUrl} className="h-8 w-auto"/>
            <h1 className={`text-4xl ${textColor}`}>{title}</h1>
        </header>
    )
}