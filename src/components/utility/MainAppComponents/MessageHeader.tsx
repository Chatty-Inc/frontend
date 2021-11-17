import { useContext } from 'react';
import { ThemeCtx } from '../../core/UIThemeProvider';
import Typography from '../../complex/Typography';
import { StyledHeader } from './ChannelHeader';
import Icon from '@ailibs/feather-react-ts'

export default function MessageHeader({channelName, channelPrivate}: {channelName: string; channelPrivate: boolean}) {
    const theme = useContext(ThemeCtx)

    return <StyledHeader lightenRatio={0} bgCol={theme.backgroundColors?.default}>
        <Icon name='hash' />
        <Typography variant='h3' margin={0}>{channelName}</Typography>
    </StyledHeader>
}