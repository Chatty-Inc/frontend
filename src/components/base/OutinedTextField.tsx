import {Component} from "react";
import styled from "styled-components";
import {ThemeCtx} from "../core/UIThemeProvider";
import {themeOptions} from "../types";
import Color from "../../vendor/color";
import {SingleChildProps} from "../ElementProps";

const StyledContainer = styled.div<themeOptions>`
  display: flex;
  padding: .5rem .7rem;
  border-radius: 7px;
  transition: all .2s ease-in-out;
  border: 1px solid ${t => Color(t.backgroundColors?.default).lighten(1.75).toString()}; 
  &:focus-within {
    border: 1px solid ${t => Color(t.backgroundColors?.default).lighten(4).toString()};
    box-shadow: 0 0 8px ${t => t.primary};
  }
  &>input {
    width: calc(100% - 1.4rem);
  }
`

/**
 * Provides a base input element that strips user agent
 * styling from the element and provides basic styling.
 * This element may be used when heavy customisation is required.
 * @returns {HTMLInputElement}
 */
export default class OutlinedTextField extends Component<SingleChildProps, {}> {
    static contextType = ThemeCtx;

    render() {
        const theme: themeOptions = this.context;

        return <StyledContainer style={this.props} {...theme}>
            {this.props.children}
        </StyledContainer>
    }
}
