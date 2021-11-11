import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import IconSwapper from '../../components/utility/IconSwapper';
import SvgData from '@ailibs/feather-react-ts/set';
import { IconSwapperWithProgress } from '../../pages/Login';

export default {
  title: 'Utility/IconSwapperWithProgress',
  component: IconSwapperWithProgress,
  argTypes: {
      icon: { control: 'radio', choices: Object.keys(SvgData) },
      color: { control: 'color' },
      progress: { control: 'number' },
  },
} as ComponentMeta<typeof IconSwapperWithProgress>;

const Template: ComponentStory<typeof IconSwapperWithProgress> = args => <IconSwapperWithProgress {...args} />

export const Default = Template.bind({});
Default.args = { icon: 'check-circle', progress: 70 };


