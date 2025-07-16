import alsLogo from '@/assets/alsLogo.png';
import { cn } from '@/lib/utils';


export type HubHeaderProps = {
    title?: string;
    logoUrl?: string;
    className?: string;
    titleClassName?: string;
}
export default function HubHeader({title="ALS COMPUTING HUB", logoUrl=alsLogo, className, titleClassName}: HubHeaderProps) {
    return (
    <header className={cn("bg-white h-16 flex justify-between items-center", className)}>
        <div className="flex items-center space-x-6 ml-6">
            <img src={logoUrl} className="h-10 aspect-square"/>
            <h1 className={cn("text-sky-950 text-2xl font-semibold", titleClassName)}>{title}</h1>
        </div>
    </header>
    )
}