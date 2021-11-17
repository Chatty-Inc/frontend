import styled from 'styled-components';
import { IThemeOptions } from '../types';
import Color from '../../utils/vendor/color/color';
import { motion } from 'framer-motion';
import { useContext } from 'react';
import { ThemeCtx } from '../core/UIThemeProvider';

const ProgressContainer = styled.div<IThemeOptions>`
  height: .5rem;
  width: 100%;
  border-radius: .25rem;
  overflow: hidden;
  background-color: ${p => Color(p.backgroundColors?.default).lighten(1.5).toString()};
`

/**
 * A simple progress bar with the length of a colored
 * div animated with spring animations for the most
 * realistic progress bars you have ever seen!
 * @param {number} progress - Progress (from 0 - 100)
 * @constructor
 */
export default function ProgressBar({progress}: {progress: number}) {
    const themeContext = useContext(ThemeCtx);

    return <ProgressContainer {...themeContext}>
        <motion.div animate={{width: `${progress}%`}} transition={{ type: 'spring', stiffness: 170, mass: 1, damping: 26 }}
                    style={{backgroundColor: themeContext.primary, height: 'inherit', width: '100%'}} />
    </ProgressContainer>;
}