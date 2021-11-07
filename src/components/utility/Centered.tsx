import {ContainerArgs} from '../types';
import { CSSProperties } from 'react';

export interface ICenteredProps extends ContainerArgs, CSSProperties {
    horizontal?: boolean;
    vertical?: boolean;
}

export default function Centered(props: ICenteredProps) {
    return <div style={{display: 'flex', minHeight: 'inherit', flexDirection: 'column',
        ...(props.horizontal ?? true ? {alignItems: 'center'} : {}),
        ...(props.vertical ?? true ? {justifyContent: 'center'} : {}),
        ...props
    }}>
        {props.children}
    </div>
}