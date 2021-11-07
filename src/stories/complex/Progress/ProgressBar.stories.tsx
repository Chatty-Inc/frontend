import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import ProgressBar from '../../../components/complex/ProgressBar';

export default {
  title: 'Complex/Progress/ProgressBar',
  component: ProgressBar,
  argTypes: {
      progress: { control: 'number', defaultValue: 70 }
  },
} as ComponentMeta<typeof ProgressBar>;

const Template: ComponentStory<typeof ProgressBar> = args => <ProgressBar {...args} />

export const Default = Template.bind({});
Default.args = { progress: 70 };



