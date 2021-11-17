import {ReactChild, ReactChildren} from 'react';

export interface ContainerArgs {
    children: ReactChild | ReactChildren | ReactChildren[] | ReactChild[];
}

export interface IThemeColors {
    default: string;
    button?: string;
    filledBtn?: string;
    themeAccent?: string;
    h1?: string;
    h2?: string;
    h3?: string;
    body?: string;
    small?: string;
    input?: string
}

export interface IPaletteColors {
    error: string;
    success: string;
    warning: string;
}

/** Various breakpoints in px */
export interface IThemeSizes {
    xs: number; // Extra-small
    sm: number; // Small
    md: number; // Medium
    lg: number; // Large
    xl: number; // Extra-large
}

export interface IThemeOptions {
    theme?: 'light' | 'dark';
    primary?: string | '#e2b714';
    textColors?: IThemeColors;
    backgroundColors?: IThemeColors;
    elevationLevel?: number;
    fontFamily?: string;
    palette?: Partial<IPaletteColors>;
    sizes?: Partial<IThemeSizes>
}