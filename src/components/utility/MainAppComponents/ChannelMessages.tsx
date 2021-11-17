import { Component, ReactChild, ReactElement } from 'react';
import styled from 'styled-components';
import { IThemeOptions } from '../../types';
import Icon from '@ailibs/feather-react-ts'
import Typography from '../../complex/Typography';
import { ThemeCtx } from '../../core/UIThemeProvider';
import Color from '../../../utils/vendor/color/color';

export interface IChannelMessagesProps {
    children: (index: number) => ReactChild | ReactElement | ReactChild[] | ReactElement[];
    totalMessages: number;
    channelName: string;
}

const StyledMessageContainer = styled.div<IThemeOptions>`
  background-color: transparent;
  padding: 5rem 1rem 1rem;
  
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  
  & div:first-child {
    margin-top: 0
  }
`;

const CustomMsgHolder = styled.div<{baseBg?: string}>`
  grid-area: msgHistory;
  overflow-y: scroll;
  
  &::-webkit-scrollbar {
    width: 16px;
    height: 16px;
  }
  &::-webkit-scrollbar-corner {
    background-color: transparent;
  }
  &::-webkit-scrollbar-track {
    background-color: ${p => Color(p.baseBg).darken(.5).toString()};
    margin: 3rem 0 1rem;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${p => Color(p.baseBg).lighten(1).toString()};
    min-height: 2.5rem;
  }
  &::-webkit-scrollbar-thumb, &::-webkit-scrollbar-track {
    border: 4px solid transparent;
    background-clip: padding-box;
    border-radius: 8px;
  }
`

/**
 * Displays channel messages with default
 * styling. The message list is currently not
 * virtualized due to underlying issues with
 * list virtualization actually decreasing performance
 */
export default class ChannelMessages extends Component<IChannelMessagesProps, {}> {
    static contextType = ThemeCtx

    render() {
        return <CustomMsgHolder baseBg={this.context.backgroundColors?.default}><StyledMessageContainer>
            <Icon name='hash' size={64} />
            <Typography variant='h1' margin={0}>{this.props.channelName}</Typography>
            <Typography variant='body'>This channel was created by </Typography>
            {
                new Array(this.props.totalMessages).fill(null).map((_, i) => this.props.children(i))
            }
        </StyledMessageContainer></CustomMsgHolder>
    }
}