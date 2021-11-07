import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import ProgressRing from '../../../components/complex/ProgressRing';

export default {
  title: 'Complex/Progress/ProgressRing',
  component: ProgressRing,
  argTypes: {
      progress: { control: 'number', defaultValue: 70 },
      strokeCol: { control: 'color' },
  },
} as ComponentMeta<typeof ProgressRing>;

const Template: ComponentStory<typeof ProgressRing> = args => <ProgressRing {...args} />

export const Default = Template.bind({});
Default.args = { progress: 70, radius: 60, stroke: 8 }



