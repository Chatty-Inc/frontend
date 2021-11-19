import styled  from 'styled-components';
import { CSSProperties, memo, ReactChild, useContext } from 'react';
import { ThemeCtx } from '../core/UIThemeProvider';
import { IThemeOptions } from '../types';
import Color from '../../utils/vendor/color/color';

export interface IListProps {
    style?: CSSProperties;
    children: ReactChild | ReactChild[]
}

const StyledList = styled.ul<IThemeOptions>`
  border-radius: 10px;
  
  overflow: hidden;
  appearance: none;
  
  margin: 0;
  padding: 0;

  box-shadow:
          0 0.4px 0.5px rgba(0, 0, 0, 0.011),
          0 0.9px 1px rgba(0, 0, 0, 0.016),
          0 1.4px 1.7px rgba(0, 0, 0, 0.019),
          0 2.2px 2.6px rgba(0, 0, 0, 0.022),
          0 3.1px 3.8px rgba(0, 0, 0, 0.025),
          0 4.4px 5.3px rgba(0, 0, 0, 0.028),
          0 6.3px 7.5px rgba(0, 0, 0, 0.031),
          0 9.1px 11px rgba(0, 0, 0, 0.034),
          0 14.1px 16.9px rgba(0, 0, 0, 0.039),
          0 25px 30px rgba(0, 0, 0, 0.05);
  
  & > li {
    appearance: none;
    cursor: pointer;
    padding: .5rem .6rem;
    height: 2.75rem;
    
    display: flex;
    gap: .5rem;
    align-items: center;

    border-bottom: 1px solid ${t => Color(t.backgroundColors?.default).lighten(1).toString()};
    background-color: ${t => Color(t.backgroundColors?.default).lighten(.55).toString()};
    transition: background-color .2s ease;
    
    & > svg.icon { 
      flex-shrink: 0; // Prevent icon shrinking if text overflows
      opacity: .6;
      transition: opacity .2s ease;
    }
    & > span.text { // Text content styling
      font-size: .95em;
      font-weight: 500;

      // Wrap text with ellipsis...
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      color: ${t => t.textColors?.button ?? t.textColors?.default};
      opacity: .75;
      transition: opacity .2s ease;
    }
    
    &:hover {
      background-color: ${t => Color(t.backgroundColors?.default).lighten(1).toString()};
      & > span.text { opacity: .95; }
      & > svg.icon { opacity: .9; }
    }
    &:active {
      background-color: ${t => Color(t.backgroundColors?.default).lighten(.42).toString()};
    }
  }
  & > li:last-child {
    border-bottom: none;
  }
`

function List(props: IListProps) {
    const theme = useContext(ThemeCtx);

    return <StyledList style={props.style} {...theme}>{props.children}</StyledList>
}

export default memo(List)