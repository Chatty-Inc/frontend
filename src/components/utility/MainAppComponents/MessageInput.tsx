import { Component } from 'react';
import InputBase from '../../base/InputBase';
import { ThemeCtx } from '../../core/UIThemeProvider';
import styled from 'styled-components';
import { IThemeOptions } from '../../types';
import Color from '../../../utils/vendor/color/color';

const StyledMessageInput = styled.div<IThemeOptions>`
  position: absolute;
  height: 68px;
  width: 100%;
  top: -8px;

  background: linear-gradient(
          180deg,
          transparent 0%,
          ${p => Color(p.backgroundColors?.default).lighten(.2).toString()} 20% 100%
  );
  
  & > input {
    background-color: ${p => Color(p.backgroundColors?.default).lighten(.75).toString()};
    padding: .75rem 1rem;
    margin: 0 1rem;
    
    width: calc(100% - 2rem);
    border-radius: 22px;

    box-shadow: none;
    transition: box-shadow .2s ease, background-color .2s ease;
    
    &:focus {
      background-color: ${p => Color(p.backgroundColors?.default).lighten(1).toString()};
      box-shadow:
              0 0 0.7px rgba(0, 0, 0, 0.053),
              0 0 1.4px rgba(0, 0, 0, 0.078),
              0 0 2.4px rgba(0, 0, 0, 0.096),
              0 0 3.6px rgba(0, 0, 0, 0.111),
              0 0 5.3px rgba(0, 0, 0, 0.125),
              0 0 7.4px rgba(0, 0, 0, 0.139),
              0 0 10.6px rgba(0, 0, 0, 0.154),
              0 0 15.3px rgba(0, 0, 0, 0.172),
              0 0 23.6px rgba(0, 0, 0, 0.197),
              0 0 42px rgba(0, 0, 0, 0.25);
    }
  }
`

export default class MessageInput extends Component {
    static contextType = ThemeCtx;

    render() {
        return <StyledMessageInput {...this.context}>
            <InputBase placeholder='Enter a beautifully composed message!' />
        </StyledMessageInput>
    }
}