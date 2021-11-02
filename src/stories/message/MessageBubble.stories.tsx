import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import RichTextRenderer from "../../components/message/RichTextRenderer";
import UIThemeProvider from "../../components/core/UIThemeProvider";
import CSSReset from "../../components/base/CSSReset";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Message/MessageBubble',
  component: RichTextRenderer,
  argTypes: {
    content: { control: 'text', defaultValue: '**this is a test**', description: 'Rich text content to render' },
  },
} as ComponentMeta<typeof RichTextRenderer>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof RichTextRenderer> = (args) => <UIThemeProvider>
  <CSSReset />
  <RichTextRenderer {...args} />
</UIThemeProvider>

export const FromMe = Template.bind({});