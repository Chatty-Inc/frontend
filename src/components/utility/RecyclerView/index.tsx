import AutoSizer from 'react-virtualized-auto-sizer';
import { VariableSizeList as List } from 'react-window';
import { Component, createRef, CSSProperties, memo, ReactChild, ReactElement, RefObject, useRef } from 'react';
import useSize from '../../../utils/hooks/useSize';

export interface IRecyclerViewProps {
    fallbackHeight: number;
    children: (index: number) => ReactChild | ReactElement | ReactChild[] | ReactElement[];
    childrenCount: number;
    listClassName?: string;
    listStyle?: CSSProperties;
}
interface IRecyclerViewState {
    itemSizes: Map<number, number>;
}

/**
 * Wrapper function for a react-window list that
 * allows easier use in many other places with less
 * boilerplate code
 */
export default class RecyclerView extends Component<IRecyclerViewProps, IRecyclerViewState> {
    private readonly RowComponent;
    private readonly fallbackHeight: number = 72
    private readonly listRef: RefObject<List>;

    constructor(props: IRecyclerViewProps) {
        super(props);
        this.listRef = createRef<List>();
        if (this.props.fallbackHeight) this.fallbackHeight = this.props.fallbackHeight;

        this.state = {
            itemSizes: new Map<number, number>(),
        }

        const RowComponent = ({ index, style }: { index: number; style: CSSProperties; }) => {
            const containerRef = useRef<HTMLDivElement>(null)
            const size = useSize(containerRef);
            this.state.itemSizes.set(index, size?.height ?? this.fallbackHeight);
            if (size?.height) this.listRef.current?.resetAfterIndex(Math.max(0, index - 1), false);

            return <div style={style}>
                <div style={{display: 'flex', flexDirection: 'column'}} ref={containerRef}>{this.props.children(index)}</div>
            </div>
        }

        this.RowComponent = memo(RowComponent) // Oh react, why do you insist on being so idiotic?
    }

    render() {
        return <AutoSizer>
            {({ height, width }) => (
                <List
                    className={this.props.listClassName}
                    style={this.props.listStyle}
                    overscanCount={0}
                    ref={this.listRef}
                    height={height}
                    width={width}
                    itemCount={this.props.childrenCount}
                    itemSize={index => this.state.itemSizes.get(index) ?? this.fallbackHeight}
                >
                    {this.RowComponent}
                </List>
            )}
        </AutoSizer>
    }
}