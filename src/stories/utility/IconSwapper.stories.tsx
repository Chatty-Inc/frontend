import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import IconSwapper from '../../components/utility/IconSwapper';
import SvgData from '@ailibs/feather-react-ts/set';

export default {
  title: 'Utility/IconSwapper',
  component: IconSwapper,
  argTypes: {
      icon: { control: 'radio', choices: Object.keys(SvgData) },
      color: { control: 'color' },
      size: { control: 'number' },
  },
} as ComponentMeta<typeof IconSwapper>;

const Template: ComponentStory<typeof IconSwapper> = args => <IconSwapper {...args} />

export const Default = Template.bind({});
Default.args = { icon: 'check-circle' };


