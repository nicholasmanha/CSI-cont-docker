import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import ButtonCopy from '../components/Button';
import ButtonCopyToClipboard from '../components/ButtonCopyToClipboard';

const meta = {
    title: 'General Components/ButtonCopyToClipboard',
    component: ButtonCopyToClipboard,
    parameters: {
      // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
      layout: 'centered',
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ['autodocs'],
    // More on argTypes: https://storybook.js.org/docs/api/argtypes
    argTypes: {
    },
    // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
    args: { cb: fn() },
} satisfies Meta<typeof ButtonCopyToClipboard>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    copyText: 'you copied me',
  },
};

