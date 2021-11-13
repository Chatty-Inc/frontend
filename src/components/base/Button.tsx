import { Component, HTMLProps } from 'react';
import styled from 'styled-components';
import {ThemeCtx} from '../core/UIThemeProvider';
import {IThemeOptions} from '../types';
import Color from '../../utils/vendor/color';
import {getTextColFromBg} from '../core/utils';

interface StyledButtonProps extends IThemeOptions {
    filled: boolean;
    btnPri: string;
    elevationLevel: number;
    elevation: number;
    fullWidth?: boolean;
}

const StyledButton = styled.button<StyledButtonProps>`
  // Display
  display: flex;
  justify-content: center;
  align-items: center;
  
  // Misc
  appearance: none;
  user-select: none;
  cursor: pointer;
  
  // Dimensions
  padding: .5rem 1.25rem;
  margin: 0;
  height: 44px;
  min-width: 5rem;
  width: ${p => p.fullWidth ? '100%' : 'auto'};
  
  // Text stuff
  font-size: 1em;
  font-weight: 600;
  font-family: '${p => p.fontFamily}', 'sans-serif';
  line-height: 1.5rem;
  text-align: center;
  
  // Colors
  background-color: ${p => p.filled ? p.btnPri : 'transparent'};
  color: ${p => p.filled 
          ? getTextColFromBg(p.btnPri ?? 'transparent', 
                  p.textColors?.button ?? '#fff', 
                  p.theme === 'dark') 
          : p.btnPri};
  border: ${p => p.filled ? 'none' : `1px solid ${Color(p.btnPri).alpha(p.elevationLevel * (p.elevation + 8)).toString()}`};
  border-radius: 10px;

  transition: border-color .2s ease-in-out, background-color .2s ease, filter .2s ease;
  &:hover:not(:disabled) {
    border-color: ${p => Color(p.btnPri).alpha(p.elevationLevel * (p.elevation + 12)).toString()};
    background-color: ${p => p.filled 
            ? Color(p.btnPri).lighten(p.elevationLevel * (p.elevation + 4)).toString() 
            : Color(p.btnPri).alpha(p.elevationLevel * (p.elevation + 2)).toString()};
  }
  
  &:active:not(:disabled) {
    border-color: ${p => Color(p.btnPri).alpha(p.elevationLevel * (p.elevation + 12)).toString()};
    background-color: ${p => p.filled 
            ? Color(p.btnPri).darken(p.elevationLevel * (p.elevation)).toString() 
            : Color(p.btnPri).alpha(p.elevationLevel * (p.elevation - 2)).toString()};
  }
  
  &:disabled {
    cursor: not-allowed;
    filter: grayscale(75%) brightness(70%) contrast(90%);
  }
`

export interface ButtonProps extends Omit<HTMLProps<HTMLButtonElement>, 'children' | 'ref' | 'type' | 'sizes' | 'as'> {
    primary?: string;
    fullWidth?: boolean;
    filled?: boolean;
}

/**
 * A basic button that supports some simple customisation.
 * @param {number} elevation
 * @param {string} primary
 * @param {boolean} filled
 * @param {boolean} fullWidth
 * @returns {HTMLButtonElement}
 */
export default class Button extends Component<ButtonProps, {}> {
    static contextType = ThemeCtx;

    render() {
        const theme: IThemeOptions = this.context;
        const elevation = 4; // This should not be modified: it causes huge issues in styling
        const filled = !!this.props.filled;
        const primary = this.props.primary ?? (filled ? theme.backgroundColors?.filledBtn : theme.primary) ?? '#fff';

        return <StyledButton filled={filled} elevation={elevation} btnPri={primary} {...theme} fullWidth={this.props.fullWidth}
                             elevationLevel={theme.elevationLevel = theme.elevationLevel ?? 0.1} {...this.props}>
            {this.props.children}
        </StyledButton>;
    }
}