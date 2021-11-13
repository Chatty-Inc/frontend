import {Component} from "react";
import styled from "styled-components";
import {ThemeCtx} from "../core/UIThemeProvider";
import {IThemeOptions} from "../types";
import Color from "../../utils/vendor/color";
import {SingleChildProps} from "../ElementProps";

const StyledContainer = styled.div<IThemeOptions>`
  display: flex;
  border-radius: 10px;
  
  &>input {
    width: 100%;
    padding: .75rem .7rem;
    border-radius: 10px;
    transition: all .2s ease-in-out;
    border: 1px solid ${t => Color(t.backgroundColors?.default).lighten(1.75).toString()};
    overflow: hidden;
    
    &:focus {
      border: 1px solid ${t => t.primary};
      box-shadow: 0 0 0 .25rem ${t => Color(t.primary).alpha(.5).toString()};
      &:invalid {
        box-shadow: 0 0 0 .25rem ${t => Color(t.palette?.error).alpha(.5).toString()};
        border-color: ${t => t.palette?.error}
      }
    }
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
        const theme: IThemeOptions = this.context;

        return <StyledContainer style={this.props} {...theme}>
            {this.props.children}
        </StyledContainer>
    }
}
