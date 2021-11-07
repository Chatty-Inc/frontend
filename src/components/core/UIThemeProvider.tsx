import { ContainerArgs, IThemeOptions } from '../types';
import { createContext } from "react";

const defaultTheme: IThemeOptions = {
    theme: 'dark',
    textColors: {default: '#eee', button: '#fff', body: '#ffffffb2', input: '#efefef'},
    backgroundColors: {default: '#1d2024', filledBtn: '#004a77'},
    primary: '#8ab4f8',
    elevationLevel: 0.025,
    fontFamily: 'IBM Plex Sans',
}

const ThemeCtx = createContext({...defaultTheme})
export { ThemeCtx };

export default function UIThemeProvider(props: ContainerArgs, addOnOps: IThemeOptions) {
    return <ThemeCtx.Provider value={{...defaultTheme, ...addOnOps}}>
        {props.children}
    </ThemeCtx.Provider>
}