import { Routes, Route } from "react-router";
import { cn } from "@/lib/utils";

import { RouteItem } from "@/types/navigationRouterTypes";

export type HubMainContentProps = {
    routes: RouteItem[];
    className?: string;
}
export default function HubMainContent({routes, className}: HubMainContentProps) {
    return (
        <main className={cn("bg-sky-900 h-full w-full p-8 overflow-y-auto", className)}>
            <Routes>
                {routes.map((route) => (
                    <Route
                        key={route.path}
                        path={route.path}
                        element={route.element}
                    />
                ))}
            </Routes>
        </main>
    )
}