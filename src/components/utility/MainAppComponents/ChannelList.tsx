import { useContext } from 'react';
import { ThemeCtx } from '../../core/UIThemeProvider';
import Color from '../../../utils/vendor/color/color';
import styled from 'styled-components';
import List from '../../base/List';
import Icon from '@ailibs/feather-react-ts'

export interface IChannelData {
    name: string;
    id: string;
}
export interface IChannelListProps {
    channels: IChannelData[];
}

const StyledChannelListContainer = styled.div`
  padding: 3.7rem 0 .7rem;
`
const StyledOuterChList = styled.div<{baseBg?: string}>`
  grid-area: chList;
  user-select: none;

  background-color: ${p => Color(p.baseBg).lighten(.2).toString()};
  
  height: 100%;
  overflow-y: auto;

  padding: 0 .7rem;
  &:hover { padding: 0 0 0 .7rem; } // Prevent content shift when scrollbar is shown
  &::-webkit-scrollbar { width: 0; } // Hide scrollbar hh
  
  // Only show custom scrollbar when hovering over container
  &:hover::-webkit-scrollbar {
    width: .7rem;
  }
  &:hover::-webkit-scrollbar-corner {
    background-color: transparent;
  }
  &:hover::-webkit-scrollbar-track {
    background-color: transparent;
    margin: 3rem 0 0;
  }
  &:hover::-webkit-scrollbar-thumb {
    background-color: ${p => Color(p.baseBg).lighten(1).toString()};
    min-height: 3rem;
  }
  &:hover::-webkit-scrollbar-thumb, &:hover::-webkit-scrollbar-track {
    border: .224rem solid transparent;
    background-clip: padding-box;
    border-radius: .35rem;
  }
`

export default function ChannelList(props: IChannelListProps) {
    const theme = useContext(ThemeCtx);

    return <StyledOuterChList baseBg={theme.backgroundColors?.default}>
        <StyledChannelListContainer>
            <List>
                {props.channels.map(c => <li>
                    <Icon className='icon' name='hash' size='1.2em' />
                    <span className='text'>{c.name}</span>
                </li>)}
            </List>
        </StyledChannelListContainer>
    </StyledOuterChList>
}