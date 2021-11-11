import { motion } from 'framer-motion';
import { Component, CSSProperties } from 'react';
import {ThemeCtx} from '../core/UIThemeProvider';
import Icon, { IconComponentProps } from '@ailibs/feather-react-ts'
import SvgData from '@ailibs/feather-react-ts/set';
import { IThemeOptions } from '../types';

export type FeatherIconNames = keyof typeof SvgData;

export interface IIconSwapperProps extends Omit<IconComponentProps, 'name' | 'style'> {
    icon: FeatherIconNames;
    style?: CSSProperties;
}
interface IIconSwapperState {
    displayedIcon: keyof typeof SvgData;
    iconShrunk: boolean;
}

/**
 * 
 */
export default class IconSwapper extends Component<IIconSwapperProps, IIconSwapperState> {
    static contextType = ThemeCtx;

    constructor(props: IIconSwapperProps) {
        super(props);

        this.state = {
            displayedIcon: this.props.icon,
            iconShrunk: false,
        }
    }

    async componentDidUpdate(prevProps: Readonly<IIconSwapperProps>, prevState: Readonly<IIconSwapperState>, snapshot?: any) {
        if (prevProps.icon !== this.props.icon) this.setState({iconShrunk: true});
    }

    render() {
        const theme: IThemeOptions = this.context;

        return <motion.div style={{width: this.props.size ?? 24, height: this.props.size ?? 24, ...this.props.style}}
            animate={{scale: this.state.iconShrunk ? 0 : 1, opacity: this.state.iconShrunk ? .2 : 1}} initial={false}
            onAnimationComplete={() => {
                if (this.state.displayedIcon !== this.props.icon)
                    this.setState({iconShrunk: false, displayedIcon: this.props.icon});
            }}
        >
            <Icon {...{style: {margin: 0}, ...this.props}} name={this.state.displayedIcon} color={this.props.color ?? theme.primary} />
        </motion.div>
    }
}