import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import Centered from '../../components/utility/Centered';
import Typography from '../../components/complex/Typography';

export default {
  title: 'Utility/Centered',
  component: Centered,
  argTypes: {
      horizontal: { control: 'boolean' },
      vertical: { control: 'boolean' },
  },
} as ComponentMeta<typeof Centered>;

const Template: ComponentStory<typeof Centered> = args => <Centered minHeight='calc(100vh - 2rem)' {...args}>
    <img src='https://user-images.githubusercontent.com/64193267/140638616-9a9265fb-d20e-4c8a-a3c7-ada76dec1046.png'
         alt='Google search of "how to center div css"' width='512' height='auto' />
</Centered>

export const Both = Template.bind({});
Both.args = { horizontal: true, vertical: true };

export const Horizontal = Template.bind({});
Horizontal.args = { horizontal: true, vertical: false };

export const Vertical = Template.bind({});
Vertical.args = { horizontal: false, vertical: true };



