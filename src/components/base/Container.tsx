import {Component, HTMLAttributes} from "react";
import {ThemeCtx} from "../core/UIThemeProvider";
import {IThemeOptions} from "../types";
import styled from "styled-components";
import {ElevatedElementProps} from "../ElementProps";
import Color from "../../utils/vendor/color";

export interface ContainerProps extends HTMLAttributes<HTMLDivElement>, ElevatedElementProps {
    variant: 'elevated' | 'outlined' | undefined;
}

const StyledBox = styled.div`
  border-radius: 18px;
  display: block;
  background-color: ${p => p.theme.variant === 'elevated' 
      ? (p.theme.theme === 'dark' 
            ? Color(p.theme.backgroundColors?.default).lighten(p.theme.elevationLevel * p.theme.elevation * 2) 
            : p.theme.backgroundColors?.default
      ) 
      : Color(p.theme.backgroundColors?.default).lighten(p.theme.elevationLevel * 2)
  };
  padding: 1rem;
  border: 2px solid ${p => p.theme.variant === 'elevated'
          ? 'transparent'
          : Color(p.theme.backgroundColors?.default).lighten(p.theme.elevationLevel * 36).toString()
  };
  
  &>*:first-child { margin-top: 0 }
  &>*:last-child { margin-bottom: 0 }
`

/**
 * A simple component for providing an elevated or outlined
 * box around its contents. Elevation is ignored if variant
 * is outlined (because you wouldn't want an elevated outlined box!)
 */
export default class Container extends Component<ContainerProps, {}> {
    static contextType = ThemeCtx;

    render() {
        const theme: IThemeOptions = this.context;

        return <StyledBox
            theme={{...theme, elevation: this.props.elevation ?? 4, variant: this.props.variant ?? 'elevated'}}
            {...this.props} />;
    }
}