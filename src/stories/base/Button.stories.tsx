import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import Button from '../../components/base/Button';
import UIThemeProvider from "../../components/core/UIThemeProvider";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Base/Button',
  component: Button,
  argTypes: {
    fullWidth: { control: 'boolean', defaultValue: false, description: 'Occupy full width of parent container' },
    primary: { control: 'color', description: 'Primary color used to color various places of the button' },
    children: { control: 'text', name: 'label', defaultValue: 'Button', description: 'Text label to place in the button' },
    filled: { control: 'boolean', defaultValue: false, description: 'Fill or outline button' }
  },
} as ComponentMeta<typeof Button>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Button> = (args) => <UIThemeProvider><Button {...args} /></UIThemeProvider>;

export const Filled = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Filled.args = {
  filled: true,
};

export const Outlined = Template.bind({});
Outlined.args = {
  filled: false,
};