import {Component, InputHTMLAttributes} from "react";
import styled from "styled-components";
import {ThemeCtx} from "../core/UIThemeProvider";
import {themeOptions} from "../types";

const StyledInput = styled.input`
  appearance: none;
  background: transparent;
  border: none;
  outline: none;
  font-size: inherit;
  
  padding: 0;
  margin: 0;
  width: inherit;
`

/**
 * Provides a base input element that strips user agent
 * styling from the element and provides basic styling.
 * This element may be used when heavy customisation is required.
 * @returns {HTMLInputElement}
 */
export default class InputBase extends Component<InputHTMLAttributes<any>, {}> {
    static contextType = ThemeCtx;

    render() {
        const theme: themeOptions = this.context;

        return <StyledInput style={{color: theme.textColors?.body}} {...this.props} />
    }
}