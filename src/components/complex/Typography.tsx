import React, { Component, CSSProperties } from 'react';
import {ThemeCtx} from "../core/UIThemeProvider";
import {IThemeOptions} from "../types";

export interface TypographyProps extends CSSProperties {
    variant: 'h1' | 'h2' | 'h3' | 'p' | 'subtitle' | 'body';
}
interface componentLookup {
    [key: string]: string;
}

/**
 * Displays text in a nice fashion! Just specify
 * the variant and content and this component will
 * give you a nicely styled text element.
 */
export default class Typography extends Component<TypographyProps, {}> {
    static contextType = ThemeCtx;
    private components: componentLookup = {
        'h1': 'h1',
        'h2': 'h2',
        'h3': 'h3',
        'p': 'p',
        'body': 'p',
        'subtitle': 'small',
    }

    render() {
        const theme: IThemeOptions = this.context;

        // TODO: Add styling based on component type
        return React.createElement(
            this.components[this.props.variant] ?? this.components.body,
            {
                children: this.props.children,
                style: {
                    color: theme.textColors?.default,
                    fontFamily: `${theme.fontFamily}, sans-serif`,
                    ...this.props
                }
            }
        );
    }
}