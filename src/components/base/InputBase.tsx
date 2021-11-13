import { Component, createRef, InputHTMLAttributes, RefObject } from 'react';
import styled from 'styled-components';
import {ThemeCtx} from '../core/UIThemeProvider';
import {IThemeOptions} from '../types';

const StyledInput = styled.input`
  appearance: none;
  background: transparent;
  border: none;
  outline: none;
  font-size: inherit;
  font-family: inherit;
  
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
    private readonly inputRef: RefObject<HTMLInputElement>;

    constructor(props: InputHTMLAttributes<any>) {
        super(props);
        
        this.inputRef = createRef<HTMLInputElement>()
    }

    focus() {
        this.inputRef.current?.focus();
    }
    
    render() {
        const theme: IThemeOptions = this.context;

        return <StyledInput ref={this.inputRef} style={{color: theme.textColors?.input}} {...this.props} />
    }
}