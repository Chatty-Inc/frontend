import {Component} from "react";
import { IThemeOptions } from '../types';
import { ThemeCtx } from "../core/UIThemeProvider";

export default class CSSReset extends Component {
    static contextType = ThemeCtx;

    componentDidMount() {
        const theme: IThemeOptions = this.context;

        const styles = {
            backgroundColor: theme.backgroundColors?.default,
            color: theme.textColors?.default,
            fontFamily: theme.fontFamily,
            margin: 0,
            minHeight: '100vh'
        };
        Object.keys(styles).forEach(v => {
            // @ts-ignore
            document.body.style[v] = styles[v]
        })
    }

    componentWillUnmount() {

    }

    render() {
        return null;
    }
}