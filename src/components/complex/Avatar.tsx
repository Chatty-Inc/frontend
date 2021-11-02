import React, {Component} from "react";
import {ThemeCtx} from "../core/UIThemeProvider";
import {themeOptions} from "../types";
import styled from "styled-components";
import {prominent} from 'color.js'
import {IRGBColor} from "../../utils/color/types";
import {mostVibrant} from "../../utils/color";

// Default img
const defaultImg = `https://picsum.photos/seed/${Math.floor(Math.random() * 1000)}/50.webp`

export interface AvatarProps {
    profileImgURL?: string;
    username?: string;
}
interface AvatarState {
    accent: string;
}

interface StyledAvatarProps {
    background: string
}

const StyledAvatarDiv = styled.div<StyledAvatarProps>`
  background: center no-repeat ${p => p.background};
  background-size: cover;
  
  height: 40px;
  width: 40px;
  border-radius: 50%;
`
const StyledAccentBorder = styled.div<{accent: string}>`
  padding: 2px;
  border: 2px solid ${p => p.accent};
  border-radius: 50%;
  width: fit-content;
  transition: border .25s ease;
`

/**
 * Displays a user avatar with a provided username or
 * profile picture. Also does some magic with prominent
 * colors in the profile picture!
 */
export default class Avatar extends Component<AvatarProps, AvatarState> {
    static contextType = ThemeCtx;

    constructor(props: AvatarProps | Readonly<AvatarProps>) {
        super(props);
        this.state = {
            accent: '#294f67'
        }

        this.updateColorRing = this.updateColorRing.bind(this);
    }

    updateColorRing() {
        prominent(this.props.profileImgURL ?? defaultImg, { amount: 5, format: 'rgb' })
            .then(c => {
                if (typeof c !== 'string') {
                    const cols: IRGBColor[] = c.map(v => {
                        const [r, g, b] = v as [r: number, g: number, b: number];
                        return {r, g, b} as IRGBColor
                    });
                    const vibrantCol = mostVibrant(cols);
                    this.setState({ accent: `rgb(${vibrantCol.r}, ${vibrantCol.g}, ${vibrantCol.b})` })
                }
            })
            .catch(() => {}) // Swallow error silently
    }

    componentDidMount() {
        this.updateColorRing();
    }

    componentDidUpdate(prevProps: Readonly<AvatarProps>, prevState: Readonly<AvatarState>, snapshot?: any) {
        if (prevProps.profileImgURL !== this.props.profileImgURL) this.updateColorRing();
    }

    render() {
        const theme: themeOptions = this.context;

        return <StyledAccentBorder accent={this.state.accent}>
            <StyledAvatarDiv background={`url("${this.props.profileImgURL ?? defaultImg}")`} />
        </StyledAccentBorder>
    }
}