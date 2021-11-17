import { useContext } from 'react';
import { ThemeCtx } from '../../core/UIThemeProvider';
import Color from '../../../utils/vendor/color/color';

export default function ChannelList() {
    const theme = useContext(ThemeCtx)

    return <div style={{backgroundColor: Color(theme.backgroundColors?.default).lighten(.2).toString(), height: '100%'}} />
}