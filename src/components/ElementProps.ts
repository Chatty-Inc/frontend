import { CSSProperties } from "styled-components";
import {ContainerArgs} from "./types";
import {ReactElement} from "react";

/**
 * Most, if not all elements extends this element. There are exceptions though...
 * @interface
 */
export interface BaseElementProps extends CSSProperties {

}

export interface ElevatedElementProps extends BaseElementProps {
    elevation?: number;
}

export interface SingleChildProps extends CSSProperties {
    children: ReactElement;
}