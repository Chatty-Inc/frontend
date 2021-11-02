import {Component} from "react";
import styled from "styled-components";
import {ThemeCtx} from "../core/UIThemeProvider";
import {ContainerArgs, themeOptions} from "../types";
import {BaseElementProps} from "../ElementProps";
import Color from '../../utils/vendor/color';
import {getTextColFromBg} from "../core/utils";

export interface ButtonProps extends BaseElementProps, ContainerArgs {
    primary?: string;
    fullWidth?: boolean;
    filled?: boolean;
    onclick?: () => void;
}

interface StyledButtonProps extends themeOptions {
    filled: boolean;
    btnPri: string;
    elevationLevel: number;
    elevation: number;
}

const StyledButton = styled.button<StyledButtonProps>`
  // Misc
  appearance: none;
  user-select: none;
  display: inline-block;
  cursor: pointer;
  
  // Dimensions
  padding: .3125rem 1rem;
  margin: 0;
  min-height: ${p => p.filled ? 34 : 32}px;
  min-width: 5rem;
  
  // Text stuff
  font-size: .875em;
  font-weight: 700;
  line-height: 1.25rem;
  text-align: center;
  
  // Colors
  background-color: ${p => p.filled ? p.btnPri : 'transparent'};
  color: ${p => p.filled 
          ? getTextColFromBg(p.btnPri ?? 'transparent', 
                  p.textColors?.button ?? '#fff', 
                  p.theme === 'dark') 
          : p.btnPri};
  border: ${p => p.filled ? 2 : 1}px solid ${p => p.filled 
          ? Color(p.btnPri).lighten(p.elevationLevel * p.elevation).toString()
          : Color(p.btnPri).alpha(p.elevationLevel * (p.elevation + 8)).toString()};
  border-radius: 7px;

  transition: border-color .2s ease-in-out, background-color .2s ease;
  &:hover {
    border-color: ${p => Color(p.btnPri).alpha(p.elevationLevel * (p.elevation + 12)).toString()};
    background-color: ${p => p.filled 
            ? Color(p.btnPri).lighten(p.elevationLevel * p.elevation).toString() 
            : Color(p.btnPri).alpha(p.elevationLevel * (p.elevation + 2)).toString()};
  }
  
  &:active {
    border-color: ${p => p.filled 
            ? p.btnPri 
            : Color(p.btnPri).alpha(p.elevationLevel * (p.elevation + 12)).toString()};
    background-color: ${p => p.filled 
            ? Color(p.btnPri).darken(p.elevationLevel * (p.elevation)).toString() 
            : Color(p.btnPri).alpha(p.elevationLevel * (p.elevation - 2)).toString()};
  }
`

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
        const theme: themeOptions = this.context;
        const elevation = 4; // This should not be modified: it causes huge issues in styling
        const primary = this.props.primary ?? theme.primary ?? '#fff';
        const filled = !!this.props.filled;

        return <StyledButton filled={filled} elevation={elevation} btnPri={primary} {...theme}
                             elevationLevel={theme.elevationLevel = theme.elevationLevel ?? 0.1}
                             style={{...(this.props.fullWidth ? {display: 'block', width: '100%'} : {}), ...this.props}}
                             onClick={this.props.onclick}>
            {this.props.children}
        </StyledButton>;
    }

    shouldComponentUpdate(nextProps: Readonly<ButtonProps>, nextState: Readonly<{}>, nextContext: any): boolean {
        return false;
    }
}