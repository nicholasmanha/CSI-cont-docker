import React from 'react';

type SidebarItemProps = {
    /** content to be rendered underneath the title */
    children?: React.ReactNode;
    /** title text above children */
    title?: string;
    /** any valid JSX, but SVG works best for color attribute */
    icon?: JSX.Element;
    /** Tailwind ClassName for height, the width auto matches the height */
    iconHeight?: `h-${string}`
    /** Tailwind ClassName */
    titleColor?: `text-${string}`
    /** Tailwind ClassNames */
    containerStyles?: string
    /** Tailwind ClassNames */
    iconStyles?: string
    /** Tailwind ClassNames */
    titleStyles?: string
    /** Tailwind ClassNames */
    childrenStyles?: string

}
export default function SidebarItem({
    children,
    title,
    icon,
    iconHeight='h-8',
    titleColor='text-sky-900',
    containerStyles,
    iconStyles,
    titleStyles,
    childrenStyles,
    ...props
}: SidebarItemProps) {
    return (
        <div className={containerStyles} {...props}>
            <h2 className={`${titleColor} ${titleStyles} font-medium text-xl flex justify-start items-end`}>
                {icon && <div className={`${titleColor} ${iconHeight} ${iconStyles} aspect-square mr-2`}>{icon}</div>}
                {title}
            </h2>
            <div className={`${childrenStyles} text-slate-900 px-2`}>
                {children}  
            </div>
        </div>
    )
}