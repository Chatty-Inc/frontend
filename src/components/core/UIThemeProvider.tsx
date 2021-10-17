import { ContainerArgs, themeOptions } from '../types';
import { createContext } from "react";

const defaultTheme: themeOptions = {
    theme: 'dark',
    textColors: {default: '#eee', button: '#ffffffd0', body: '#ffffffcc'},
    backgroundColors: {default: '#1d2024'},
    primary: '#8ab4f8',
    elevationLevel: 0.025,
    fontFamily: 'IBM Plex Sans',
}

const ThemeCtx = createContext({...defaultTheme})
export { ThemeCtx };

export default function UIThemeProvider(props: ContainerArgs, addOnOps: themeOptions) {
    return <ThemeCtx.Provider value={{...defaultTheme, ...addOnOps}}>
        {props.children}
    </ThemeCtx.Provider>
}