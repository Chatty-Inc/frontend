import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import Avatar from "../../components/complex/Avatar";
import Dialog, {DialogTextContent, IDialogProps} from "../../components/complex/Dialog";
import Typography from "../../components/complex/Typography";              

export default {
  title: 'Complex/Dialog',
  component: Dialog,
  argTypes: {
    open: { control: 'boolean', defaultValue: false },
    title: { control: 'text' },
    content: { control: 'text' },
  },
} as ComponentMeta<typeof Dialog>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Dialog> = (args) => <>
  { Array.from({length: 20}).map((_, i) => <Typography variant='h1' key={Number(i)}>Content</Typography>)}
  <Dialog {...args}>
    <DialogTextContent onClose={() => {}} title={args.title!} content={args.content!} />
  </Dialog>
</>;

export const TextContent = Template.bind({});

