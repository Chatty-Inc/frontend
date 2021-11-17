import styled from 'styled-components';
import { HTMLProps, useContext } from 'react';
import { ThemeCtx } from '../core/UIThemeProvider';

const StyledDividerDiv = styled.div<{bgColor: string}>`
  height: 1px;
  width: calc(100% - 2rem);
  margin: 0 1rem;
  background-color: ${p => p.bgColor};
  opacity: .25;
`

/**
 * Simple divider component that literally just
 * returns a div with a line in it. Inherits all
 * HTMLDivElement props.
 * @constructor
 */
export default function Divider(props: Omit<HTMLProps<HTMLDivElement>, 'ref' | 'as'>) {
    const theme = useContext(ThemeCtx);

    return <StyledDividerDiv bgColor={theme.textColors?.default ?? '#fff'} {...props} />
}