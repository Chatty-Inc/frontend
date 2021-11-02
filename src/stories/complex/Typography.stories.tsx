import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import Typography from "../../components/complex/Typography";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Complex/Typography',
  component: Typography,
  argTypes: {
    variant: { control: 'text', defaultValue: 'body', description: 'Variant of text (h1, h2, body etc) to display' },
    children: { control: 'text', defaultValue: 'Some text here :D', description: 'Text contents', name: 'Content' },
  },
} as ComponentMeta<typeof Typography>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Typography> = (args) => <Typography {...args} />;

export const Header1 = Template.bind({});
Header1.args = { variant: 'h1' };
export const Header2 = Template.bind({});
Header2.args = { variant: 'h2' };
export const Header3 = Template.bind({});
Header3.args = { variant: 'h3' };
export const Body = Template.bind({});
Body.args = { variant: 'body' };
export const Subtitle = Template.bind({});
Subtitle.args = { variant: 'subtitle' };