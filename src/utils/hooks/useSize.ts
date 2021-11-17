import useResizeObserver from '@react-hook/resize-observer';
import { MutableRefObject, useLayoutEffect, useState } from 'react';

export interface IBoundingClientRect {
    width: number;
    height: number;
    top: number;
    left: number;
    right: number;
    bottom: number;
}

/**
 * Wrapper hook for a ResizeObserver that also gets
 * the initial size of the element
 * @param {MutableRefObject} target - Ref of element to be observed
 * @returns {IBoundingClientRect} - Bounding client rect size of element
 */
export default function useSize(target: MutableRefObject<any>): IBoundingClientRect | undefined {
    const [size, setSize] = useState<IBoundingClientRect>();

    useLayoutEffect(() => {
        setSize(target.current.getBoundingClientRect());
    }, [target]);

    // Where the magic happens
    useResizeObserver(target, entry => setSize(entry.contentRect));
    return size;
}