import { useContext } from 'react';
import { ThemeCtx } from '../../core/UIThemeProvider';
import Typography from '../../complex/Typography';
import Color from '../../../utils/vendor/color/color';
import styled from 'styled-components';

export const StyledHeader = styled.div<{bgCol?: string, lightenRatio: number}>`
  position: absolute;
  z-index: 1;
  
  padding: 0 .8rem;
  height: 47px;
  width: 100%;
  
  border-bottom: 1px solid #000;
  background-color: ${p => p.lightenRatio > 0 ? Color(p.bgCol).lighten(p.lightenRatio).toString() : '#1E1E1EB7'};
  backdrop-filter: ${p => p.lightenRatio > 0 ? 'none' : 'saturate(1.8) blur(20px)'};
  
  display: flex;
  align-items: center;
  gap: .5rem;

  box-shadow:
          0 0.4px 0.4px rgba(0, 0, 0, 0.021),
          0 0.9px 0.9px rgba(0, 0, 0, 0.031),
          0 1.4px 1.4px rgba(0, 0, 0, 0.038),
          0 2.2px 2.2px rgba(0, 0, 0, 0.044),
          0 3.1px 3.1px rgba(0, 0, 0, 0.05),
          0 4.4px 4.4px rgba(0, 0, 0, 0.056),
          0 6.3px 6.3px rgba(0, 0, 0, 0.062),
          0 9.1px 9.1px rgba(0, 0, 0, 0.069),
          0 14.1px 14.1px rgba(0, 0, 0, 0.079),
          0 25px 25px rgba(0, 0, 0, 0.1);
  
  user-select: none; // Safari insists on making the whole div selectable
  & > h3 {
    user-select: auto; // Allow selection for text but prevent selecting the whole div as well
  }
`

export default function ChannelHeader({serverName}: {serverName: string}) {
    const theme = useContext(ThemeCtx);

    return <StyledHeader bgCol={theme.backgroundColors?.default} lightenRatio={.2}>
        <Typography variant='h3' margin={0}>{serverName}</Typography>
    </StyledHeader>
}