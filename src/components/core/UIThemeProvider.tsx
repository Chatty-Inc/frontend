import { ContainerArgs, themeOptions } from '../types';
import { createContext } from "react";

const defaultTheme: themeOptions = {
    theme: 'dark',
}

export default function UIThemeProvider(props: ContainerArgs, addOnOps: themeOptions) {
    const ThemeCtx = createContext({...defaultTheme, ...addOnOps})

    return <ThemeCtx.Provider value={{...defaultTheme, ...addOnOps}}>
        {props.children}
    </ThemeCtx.Provider>
}