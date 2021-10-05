import { ReactChild, ReactChildren } from 'react';

export interface ContainerArgs {
    children: ReactChild | ReactChildren;
}

export interface themeOptions {
    theme?: 'light' | 'dark';
    primary?: String | '#e2b714';
    baseColor?: String | '#1d2024';
}