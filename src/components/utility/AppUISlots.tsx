import { Component, ReactChild, ReactElement } from 'react';
import styled from 'styled-components';

const StyledSlotContainer = styled.div`
  // Grid layout
  display: grid;
  grid-template-columns: 72px 240px 1fr;
  grid-template-rows: 0 1fr 60px;
  grid-template-areas:
          'serverList chHeader msgHeader'
          'serverList chList   msgHistory'
          'serverList chList   msgInput';
  
  height: 100vh;
`

const StyledSlotChild = styled.div`
  position: relative;
  user-select: none;
`

type SlotChildren = ReactChild | ReactElement | ReactChild[] | ReactElement[];
export interface IAppUISlotsProps {
    serverList: SlotChildren;
    channelHeader: SlotChildren;
    channelList: SlotChildren;
    messageHeader: SlotChildren;
    messageHistory: SlotChildren;
    messageInput: SlotChildren;
}

/**
 * Renders a skeleton slot-based layout for all
 * app contents including message list, message input,
 * server list and chat list.
 */
export default class AppUISlots extends Component<IAppUISlotsProps, {}> {
    render() {
        return <StyledSlotContainer>
            <StyledSlotChild style={{gridArea: 'serverList'}}>{this.props.serverList}</StyledSlotChild>
            <StyledSlotChild style={{gridArea: 'chHeader'}}>{this.props.channelHeader}</StyledSlotChild>
            <StyledSlotChild style={{gridArea: 'chList'}}>{this.props.channelList}</StyledSlotChild>
            <StyledSlotChild style={{gridArea: 'msgHeader'}}>{this.props.messageHeader}</StyledSlotChild>
            {this.props.messageHistory}
            <StyledSlotChild style={{gridArea: 'msgInput'}}>{this.props.messageInput}</StyledSlotChild>
        </StyledSlotContainer>;
    }
}