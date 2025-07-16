import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';


import InputSlider from '../components/InputSlider';

const meta = {
    title: 'General Components/InputSlider',
    component: InputSlider,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    }
} satisfies Meta<typeof InputSlider>;

export default meta;
type Story = StoryObj<typeof meta>;


export const Default: Story = {
    args: {
        min: 0,
        max: 100,
        value: 4,
        onChange: fn,
        width: 'w-96',
        label: 'Age',
        units: 'years'
    }
}

export const WithFillBar: Story = {
    args: {
        min: 0,
        max: 100,
        value: 4,
        onChange: fn,
        width: 'w-96',
        label: 'Age',
        showFill: true,
    }
}

export const WithCustomTicks: Story = {
    args: {
        min: 0,
        max: 100,
        value: 4,
        onChange: fn,
        width: 'w-96',
        marks: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
    }
}

export const WithTickLabels: Story = {
    args: {
        min: 0,
        max: 100,
        value: 4,
        onChange: fn,
        width: 'w-96',
        marks: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
        shorthandUnits: 'yr'
    }
}

export const WithoutLabel: Story = {
    args: {
        min: 0,
        max: 100,
        value: 4,
        onChange: fn,
        width: 'w-[350px]',
    }
}

export const WithoutLabelOrInput: Story = {
    args: {
        min: 0,
        max: 100,
        value: 4,
        onChange: fn,
        width: 'w-[400px]',
        showSideInput: false
    }
}

