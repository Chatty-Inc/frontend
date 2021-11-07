import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import HorizontalPager from '../../components/complex/HorizontalPager';
import Typography from '../../components/complex/Typography';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Complex/HorizontalPager',
  component: HorizontalPager,
  argTypes: {
      page: { control: 'number', defaultValue: 0 }
  },
} as ComponentMeta<typeof HorizontalPager>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof HorizontalPager> = args =>
    <HorizontalPager margin='-1rem' {...args}>
        {
            [1, 2, 3, 4, 5].map(v => <Typography variant='h1' key={v}>Page {v}</Typography>)
        }
    </HorizontalPager>

export const Default = Template.bind({ page: 0, width: 500 });

