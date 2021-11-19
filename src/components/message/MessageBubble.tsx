import styled from 'styled-components';
import { memo, useContext } from 'react';
import { ThemeCtx } from '../core/UIThemeProvider';
import { IThemeOptions } from '../types';
import Typography from '../complex/Typography';
import Avatar from '../complex/Avatar';
import { IMessageData } from '../utility/MainAppComponents/ChannelMessages';
import Color from '../../utils/vendor/color/color';
import { formatRelative, format } from 'date-fns';

export interface IMessageBubbleProps extends IMessageData {
    jointMessage: boolean;
}
interface IStyledBubbleProps extends IThemeOptions {
    joint: boolean;
    fromSelf: boolean;
    sentTime?: string;
}

const StyledMessageBubble = styled.div<IStyledBubbleProps>`
  background-color: ${p => p.fromSelf 
          ? p.backgroundColors?.filledBtn 
          : Color(p.backgroundColors?.default).lighten(.6).toString()};
  padding: .5rem .75rem;
  margin-top: ${p => p.joint ? 0 : '.35rem'};
  border-radius: ${p => p.joint ? '18px' : '0 18px 18px'};
  
  width: fit-content;
  max-width: min(580px, 80%);
  height: fit-content;
  
  @media (max-width: 928px) {
    max-width: none;
  }
  
  & > *:first-child { margin-top: 0 }
  & > *:last-child { margin-bottom: 0 }
  
  position: relative;
  &::after {
    display: ${p => p.joint ? 'inline-block' : 'none'};
    content: '${p => p.joint ? p.sentTime : ''}';
    
    position: absolute;
    bottom: .4rem;
    right: .7rem;
    
    font-size: .68em;
    opacity: .7;
  }
  
  user-select: none; // Don't allow selection of stuff that shouldn't be copied
  & > p, & > span { user-select: text; }
`
const StyledMessageContainer = styled.div<{joint: boolean}>`
  display: flex;
  column-gap: 1rem;
  
  padding-left: ${p => p.joint ? '4rem' : 0};
  margin-top: ${p => !p.joint ? '1rem' : 0};
  
  user-select: none;
  
  & span.hidden-copyable {
    font-size: 0;
    user-select: text;
  }
`
const StyledAuthorHeadingSpan = styled.span<{textCol?: string; caption: boolean}>`
  font-size: ${props => props.caption ? .8 : 1}em;
  font-weight: 500;
  
  user-select: none;
  color: ${p => Color(p.textCol).alpha(p.caption ? .75 : .9).toString()};
  
  padding-right: .5rem;
`

/**
 *
 * @param props
 * @constructor
 */
function MessageBubble(props: IMessageBubbleProps) {
    const theme = useContext(ThemeCtx);

    return <StyledMessageContainer joint={props.jointMessage}>
        {!props.jointMessage && <Avatar profileImgURL={props.avatarURL}/>}
        <div>
            {!props.jointMessage && <>
                <StyledAuthorHeadingSpan caption={false} aria-hidden='true'
                                         textCol={theme.textColors?.h3 ?? theme.textColors?.default}>
                    {props.name}
                </StyledAuthorHeadingSpan>
                <StyledAuthorHeadingSpan caption aria-hidden='true'
                                         textCol={theme.textColors?.h3 ?? theme.textColors?.default}>
                    <span className='hidden-copyable'>: </span>
                    {formatRelative(props.sentTime, new Date())}
                </StyledAuthorHeadingSpan>
            </>}
            <StyledMessageBubble {...theme} joint={props.jointMessage} sentTime={format(props.sentTime, 'hh:mm aaa')}
                                 fromSelf={false}>
                <Typography variant='body'>
                    <span className='hidden-copyable'>[{format(props.sentTime, 'Pp')}] {props.name}: </span>
                    {props.msgContent}{props.jointMessage && <span style={{width: 54, height: 0, display: 'inline-block'}} />}
                </Typography>
            </StyledMessageBubble>
        </div>
    </StyledMessageContainer>
}

export default memo(MessageBubble);