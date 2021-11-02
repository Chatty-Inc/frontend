import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import InputBase from "../../components/base/InputBase";
import OutlinedTextField from "../../components/base/OutinedTextField";

export default {
  title: 'Base/TextField',
  component: InputBase,
  argTypes: {
    type: {
      control: 'radio',
      options: ['text', 'password', 'email', 'tel'],
      description: 'Type of content the input accepts, sets HTML `type` attribute'
    },
    placeholder: { control: 'text', defaultValue: 'Type some text here!', description: 'Hint to display when field is empty' },
  },
} as ComponentMeta<typeof InputBase>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof InputBase> = (args) => <InputBase {...args} />;
export const Base = Template.bind({});

const OutlinedTemplate: ComponentStory<typeof InputBase> = (args) => <OutlinedTextField><InputBase {...args} /></OutlinedTextField>;
export const Outlined = OutlinedTemplate.bind({});
