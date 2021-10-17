import {ReactChild, ReactChildren, ReactElement} from 'react';

export interface ContainerArgs {
    children: ReactChild | ReactChildren | ReactChildren[] | ReactChild[];
}

export interface colors {
    default: string;
    button?: string;
    h1?: string;
    h2?: string;
    h3?: string;
    h4?: string;
    h5?: string;
    h6?: string;
    body?: string;
    small?: string;
}

export interface themeOptions {
    theme?: 'light' | 'dark';
    primary?: string | '#e2b714';
    textColors?: colors;
    backgroundColors?: colors;
    elevationLevel?: number;
    fontFamily?: string;
}