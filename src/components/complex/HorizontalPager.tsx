import { motion } from 'framer-motion';
import { Component, CSSProperties, ReactChild } from 'react';
import styled from 'styled-components';

const StyledContainer = styled.div`
  overflow: hidden;
  width: 100%;
  display: flex;
  padding: 1rem 0;
`

const StyledContent = styled.div`
  // CSS cricket sounds
  padding: 0 2rem;
`

export interface IHorizontalPagerProps extends CSSProperties {
    page: number;
    children: ReactChild[];
    width: number;
}

/**
 *
 */
export default class HorizontalPager extends Component<IHorizontalPagerProps, {}> {
    render() {
        const totalPages = this.props.children?.length!

        return <StyledContainer style={this.props}>
            <motion.div style={{width: `${100 * totalPages}%`, display: 'grid',
                gridTemplateColumns: `repeat(${totalPages}, ${this.props.width}px)`}}
                        animate={{x: `${-this.props.width * this.props.page ?? 0}px`}}
                        transition={{ type: "spring", mass: 1, damping: 22, stiffness: 200 }}>
                {this.props.children.map((v, i) => <StyledContent key={i}>{v}</StyledContent>)}
            </motion.div>
        </StyledContainer>;
    }
}
