import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import Container from "../../components/base/Container";
import Typography from "../../components/complex/Typography";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Base/Container',
  component: Container,
  argTypes: {
    children: { control: 'text', defaultValue: 'Some text here :D', description: 'Text contents', name: 'Content' },
    elevation: { control: 'number', defaultValue: 4, description: 'Elevation of container. Ignored if variant is `outlined`' },
    variant: { control: 'radio', defaultValue: 'elevated', options: ['elevated', 'outlined'] }
  },
} as ComponentMeta<typeof Container>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Container> = (args) =>
    <Container {...args}><Typography variant='body'>{args.children}</Typography></Container>;

export const Elevated = Template.bind({});
Elevated.args = { variant: 'elevated' };

export const Outlined = Template.bind({});
Outlined.args = { variant: 'outlined' };