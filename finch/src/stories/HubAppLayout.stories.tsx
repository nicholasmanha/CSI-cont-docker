import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import HubAppLayout from '@/components/HubAppLayout';
import { House, Joystick, StackPlus, ImageSquare  } from "@phosphor-icons/react";
import { RouteItem } from '@/types/navigationRouterTypes';
import { MemoryRouter, Routes, Route } from 'react-router';
import Paper from '@/components/Paper';

const Page1 = () => {
    return (
        <Paper>
            <div className="flex justify-center items-center w-full h-full"> Blank Sample - This will change based on the components included in your routes prop </div>
        </Paper>
    )
}

const Page2 = () => {
    return (
        <div>page2</div>
    )
}

const Page3 = () => {
    return (
        <div>page3</div>
    )
}

const Page4 = () => {
    return (
        <div>page4</div>
    )
}

const routes:RouteItem[] = [
    {element:<Page1 />, path: "/", label: "Home", icon: <House size={32} />},
    {element:<Page2/>, path: "/control", label: "Control", icon: <Joystick size={32} />},
    {element:<Page3 />, path: "/qserver", label: "Q Server", icon: <StackPlus size={32} />},
    {element:<Page4/>,path: "/data", label: "Data", icon: <ImageSquare size={32} />},
];

const meta = {
    title: 'Layout Components/HubAppLayout',
    component: HubAppLayout,
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen',
    },
    decorators: [
        (Story) => (
          <MemoryRouter initialEntries={['']}>
            <Routes>
              {/* These simulate what HubMainContent expects */}
              {routes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={<Story />}
                />
              ))}
            </Routes>
          </MemoryRouter>
        ),
      ],
} satisfies Meta<typeof HubAppLayout>;

export default meta;
type Story = StoryObj<typeof meta>;



export const Default: Story = {
    args: {
        routes: routes,
    }
}


export const CustomTitle: Story = {
    args: {
        routes: routes,
        headerTitle: 'Custom Header Title with Custom Icon',
        headerLogoUrl: 'https://img.icons8.com/?size=100&id=9243&format=png&color=000000'
    }
}

export const CustomClasses: Story = {
    args: {
        routes: routes,
        headerTitle: 'Styled Sidebar and Main Content',
        headerLogoUrl: 'https://img.icons8.com/?size=100&id=59484&format=png&color=000000',
        sidebarClassName: 'bg-red-100',
        sidebarActiveLinkClassName: 'bg-red-500',
        sidebarInactiveLinkClassName: 'text-red-500 hover:bg-purple-300 hover:text-slate-900',
        mainContentClassName: 'bg-red-300',
        headerClassName: 'bg-red-200',
        headerTitleClassName: 'text-red-900'

    }
}



