import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import Avatar from "../../components/complex/Avatar";

export default {
  title: 'Complex/Avatar',
  component: Avatar,
  argTypes: {
  },
} as ComponentMeta<typeof Avatar>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Avatar> = (args) => <Avatar {...args} />;

export const Default = Template.bind({});

