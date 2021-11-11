import { motion } from 'framer-motion';
import { Component, CSSProperties } from 'react';
import { ThemeCtx } from '../core/UIThemeProvider';
import { IThemeOptions } from '../types';
import Color from '../../utils/vendor/color';

export interface IProgressRingProps {
    radius: number;
    stroke: number;
    strokeCol?: string;
    baseStroke?: number;
    progress: number;
    style?: CSSProperties;
}

export default class ProgressRing extends Component<IProgressRingProps> {
    private readonly normalizedRadius;
    private readonly circumference;
    static contextType = ThemeCtx;

    constructor(props: IProgressRingProps) {
        super(props);

        const { radius, stroke } = this.props;

        this.normalizedRadius = (radius ?? 50) - (stroke ?? 8) * 2;
        this.circumference = this.normalizedRadius * 2 * Math.PI;
    }

    render() {
        const theme: IThemeOptions = this.context;
        const { radius, stroke, progress } = this.props;
        const rad = radius ?? 50,
            strokeWidth = stroke ?? 8

        const strokeDashoffset = this.circumference - progress / 100 * this.circumference;

        return (
            <motion.svg
                style={this.props.style}
                height={rad * 2}
                width={rad * 2}>
                <circle
                    cx={rad}
                    cy={rad}
                    r={this.normalizedRadius}
                    strokeWidth={this.props.baseStroke ?? 2}
                    fill='transparent'
                    stroke={Color(theme.backgroundColors?.default).lighten(1.5).toString()}
                />
                <motion.circle
                    animate={{ strokeDashoffset, strokeDasharray: this.circumference + ' ' + this.circumference }}
                    transition={{ type: 'spring', stiffness: 170, mass: 1, damping: 26 }}
                    stroke={this.props.strokeCol ?? theme.primary}
                    fill='transparent'
                    strokeWidth={strokeWidth}
                    style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', strokeLinecap: 'round' }}
                    r={this.normalizedRadius}
                    cx={rad}
                    cy={rad}
                />
            </motion.svg>
        );
    }
}