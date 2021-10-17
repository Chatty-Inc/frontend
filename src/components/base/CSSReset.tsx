import {Component} from "react";
import { themeOptions } from '../types';
import { ThemeCtx } from "../core/UIThemeProvider";

interface defaultBodyStyles {
    backgroundColor?: String;
    color?: String;
    fontFamily?: string;
    margin: number;
}

export default class CSSReset extends Component {
    static contextType = ThemeCtx;
    private styles: defaultBodyStyles | undefined;

    componentDidMount() {
        const theme: themeOptions = this.context
        this.styles = {
            backgroundColor: theme.backgroundColors?.default,
            color: theme.textColors?.default,
            fontFamily: theme.fontFamily,
            margin: 0
        };
        Object.keys(this.styles).forEach(v => {
            // @ts-ignore
            document.body.style[v] = this.styles[v]
        })
    }

    componentWillUnmount() {

    }

    render() {
        return null;
    }
}