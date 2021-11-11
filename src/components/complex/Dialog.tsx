import React, { Component, ReactChild, ReactElement } from 'react';
import ScrollLock  from 'react-scrolllock';
import { motion } from "framer-motion";
import styled from "styled-components";
import Container from "../base/Container";
import Typography from "./Typography";
import Button from "../base/Button";
import {ContainerArgs} from "../types";

export interface IDialogProps extends ContainerArgs {
    title?: string;
    content?: string;
    open: boolean;
    onClose: () => void;
}

const StyledDialogBase = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1001;
  
  display: flex;
  justify-content: center;
  align-items: center;
`

const StyledButtonRow = styled.div`
  display: flex;
  gap: .75rem;
  justify-content: flex-end;
  align-items: center;
  
  margin: 0 -1rem -1em !important;
  padding: .75rem;
  background-color: rgba(0, 0, 0, .45)
`

/**
 * Basic dialog component. Displays a dialog created
 * completely from scratch with nice framer motion
 * spring animations. This component does not display
 * anything on its own - supply one of the dialog content
 * template components as children or create your own. Also
 * locks scroll with react-scrolllock when dialog is open
 * to prevent body scrolling.
 */
export default class Dialog extends Component<IDialogProps, {isMounted: boolean}> {
    constructor(props: IDialogProps) {
        super(props);

        this.state = {
            isMounted: false
        }
    }

    render() {
        return (this.state.isMounted || this.props.open) ? <StyledDialogBase>
            <ScrollLock isActive={this.props.open} />

            <motion.div onAnimationStart={() => this.setState({isMounted: true})}
                        onAnimationComplete={() => this.setState({isMounted: this.props.open})}
                        onClick={() => this.props.onClose()} style={{
                backgroundColor: 'rgba(0, 0, 0, .7)', width: '100%', height: '100%', opacity: 0,
                WebkitBackdropFilter: 'blur(8px)', backdropFilter: 'blur(8px)',
                position: 'absolute', zIndex: 0
            }} animate={{opacity: this.props.open ? 1 : 0}} />

            <motion.div style={{transform: 'scale(0)', zIndex: 1, margin: '2rem', maxWidth: 540, maxHeight: 'calc(100vh - 4rem)'}}
                         onClick={e => e.stopPropagation()} initial={{opacity: 0, scale: 0}}
                        animate={{scale: this.props.open ? 1 : 0, opacity: this.props.open ? 1 : 0}}>
                {this.props.children}
            </motion.div>
        </StyledDialogBase> : null;
    }
}

export interface IDialogTextContentProps {
    title: string;
    content: string;
    closeLabel?: string;
    buttons?: ReactChild[] | ReactElement[];
    onClose: () => void;
}

/**
 * A template component to be used as a child with the
 * base dialog component, to create a text dialog.
 * @param {string} title - Title of text dialog
 * @param {string} content - Content
 * @param {string} closeLabel - Label of close/primary button
 * @param {ReactChild[] | ReactElement[]} buttons - Any additional buttons to add into the button row
 * @param {() => void} onClose - Function that is called when close button is clicked
 * @constructor
 */
export function DialogTextContent({title, content, closeLabel, buttons, onClose}: IDialogTextContentProps) {
    return <Container variant='elevated' elevation={8} style={{overflow: 'hidden'}}>
        <Typography variant='h3'>{title}</Typography>
        <Typography variant='body'>{content}</Typography>
        <StyledButtonRow>
            {buttons}
            <Button filled onclick={onClose}>{closeLabel ?? 'Close'}</Button>
        </StyledButtonRow>
    </Container>
}