import styled from 'styled-components';
import { useContext } from 'react';
import { ThemeCtx } from '../core/UIThemeProvider';
import { IThemeOptions } from '../types';
import Typography from '../complex/Typography';
import Avatar from '../complex/Avatar';

const StyledMessageBubble = styled.div<IThemeOptions>`
  background-color: ${t => t.backgroundColors?.filledBtn};
  padding: .5rem .75rem;
  border-radius: 50px;
  
  width: fit-content;
  height: fit-content;
  
  & > *:first-child { margin-top: 0 }
  & > *:last-child { margin-bottom: 0 }
`
const StyledMessageContainer = styled.div`
  display: flex;
  margin: .2rem 0;
`

export interface IMessageBubbleProps {
    content: string;
}

/**
 *
 * @param props
 * @constructor
 */
export default function MessageBubble(props: IMessageBubbleProps) {
    const theme = useContext(ThemeCtx);

    return <StyledMessageContainer>
        <Avatar />
        <StyledMessageBubble {...theme}>
            <Typography variant='body'>{props.content}</Typography>
        </StyledMessageBubble>
    </StyledMessageContainer>
}