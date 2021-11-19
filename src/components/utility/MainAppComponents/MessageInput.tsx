import { Component } from 'react';
import InputBase from '../../base/InputBase';
import { ThemeCtx } from '../../core/UIThemeProvider';
import styled from 'styled-components';
import { IThemeOptions } from '../../types';
import Color from '../../../utils/vendor/color/color';
import { motion } from 'framer-motion';
import SendIcon from './SendIcon';

interface IMessageInputState {
    message: string;
}

const StyledMessageInput = styled.div<{baseBg?: string; sendVisible: boolean}>`
  position: absolute;
  height: 68px;
  width: 100%;
  top: -8px;
  
  padding: 0 1rem;
  display: flex;
  gap: .75rem;

  background: linear-gradient(
          180deg,
          transparent 0%,
          ${p => Color(p.baseBg).lighten(.2).toString()} 20% 100%
  );
  
  & input {
    background-color: ${p => Color(p.baseBg).lighten(.75).toString()};
    padding: .75rem 1rem;
    
    width: 100%;
    border-radius: 22px;

    box-shadow: none;
    transition: box-shadow .2s ease, background-color .2s ease;
    
    &:focus {
      background-color: ${p => Color(p.baseBg).lighten(1).toString()};
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

const StyledSendButton = styled(motion.button)<{buttonBg?: string}>`
  position: absolute;
  top: 0;
  right: 1rem;
  
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  
  display: flex;
  justify-content: center;
  align-items: center;
  
  outline: none;
  border: none;

  color: #000;
  box-shadow:
          0 0 0.5px rgba(0, 0, 0, 0.017),
          0 0 1.1px rgba(0, 0, 0, 0.025),
          0 0 1.8px rgba(0, 0, 0, 0.031),
          0 0 2.8px rgba(0, 0, 0, 0.035),
          0 0 4px rgba(0, 0, 0, 0.04),
          0 0 5.7px rgba(0, 0, 0, 0.045),
          0 0 8px rgba(0, 0, 0, 0.049),
          0 0 11.7px rgba(0, 0, 0, 0.055),
          0 0 18px rgba(0, 0, 0, 0.063),
          0 0 32px rgba(0, 0, 0, 0.08);
  background-color: ${p => p.buttonBg};
  transition: background-color .25s ease, box-shadow .25s ease;
  
  &:hover {
    background-color: ${p => Color(p.buttonBg).lighten(.06).toString()};
    box-shadow:
            0 0 0.9px rgba(0, 0, 0, 0.042),
            0 0 2.1px rgba(0, 0, 0, 0.062),
            0 0 3.5px rgba(0, 0, 0, 0.077),
            0 0 5.2px rgba(0, 0, 0, 0.089),
            0 0 7.5px rgba(0, 0, 0, 0.1),
            0 0 10.6px rgba(0, 0, 0, 0.111),
            0 0 15.1px rgba(0, 0, 0, 0.123),
            0 0 21.9px rgba(0, 0, 0, 0.138),
            0 0 33.8px rgba(0, 0, 0, 0.158),
            0 0 60px rgba(0, 0, 0, 0.2);
  }
  &:active {
    background-color: ${p => Color(p.buttonBg).darken(.08).toString()};
  }
`

export default class MessageInput extends Component<{}, IMessageInputState> {
    static contextType = ThemeCtx;

    constructor(props: {}) {
        super(props);

        this.state = {
            message: ''
        };
    }

    render() {
        const theme = this.context as IThemeOptions;
        const hasContent = this.state.message.trim().length > 0;

        return <StyledMessageInput baseBg={theme.backgroundColors?.default} sendVisible={hasContent}>
            <motion.div animate={{width: hasContent ? `calc(100% - 3.5rem)` : '100%'}} initial={{width: '100%'}}>
                <InputBase placeholder='Enter a beautifully composed message!' value={this.state.message}
                           onChange={e => this.setState({message: e.currentTarget.value})} />
            </motion.div>
            <StyledSendButton animate={{scale: hasContent ? 1 : 0}} initial={{scale: 0}}
                              transition={{delay: hasContent ? .25 : 0}} buttonBg={theme.primary}>
                <SendIcon />
            </StyledSendButton>
        </StyledMessageInput>
    }
}