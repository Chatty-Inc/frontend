import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import MainLoadIcon from "../../components/complex/MainLoadIcon";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Complex/MainLoadIcon',
  component: MainLoadIcon,
  argTypes: {
  },
} as ComponentMeta<typeof MainLoadIcon>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof MainLoadIcon> = () => <MainLoadIcon />;

export const Default = Template.bind({});

