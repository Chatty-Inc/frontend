import React, {Component} from 'react';
import {ThemeCtx} from '../components/core/UIThemeProvider';
import Button from '../components/base/Button';
import {logout} from '../cryptoBase/auth';
import {WebSocketManager} from '../websocketManager';
import Container from '../components/base/Container';
import Typography from "../components/complex/Typography";
import {withRouter} from 'react-router-dom';
import Dialog, { DialogTextContent } from '../components/complex/Dialog';
import { IUserInfoData } from '../websocketManager/types';
import { LoginRouterProps } from './Login';

interface AppState {
    wsState: number;
    uDataDialog: { open: boolean, content: IUserInfoData }
}

let ws: WebSocketManager | undefined = undefined;

const humanReadableWSStates = {
    [WebSocketManager.STATE_CONNECTED]: 'Connected',
    [WebSocketManager.STATE_DC_CONNECTING]: 'Disconnected, attempting (re)connection',
    [WebSocketManager.STATE_ERROR_RECONNECTING]: 'Connection error, reconnecting',
    [WebSocketManager.STATE_ERROR_FATAL]: 'Disconnected, not reconnecting',
}

/**
 * Login page
 */
class App extends Component<LoginRouterProps, AppState> {
    static contextType = ThemeCtx;

    constructor(props: LoginRouterProps) {
        super(props);

        this.state = {
            wsState: WebSocketManager.STATE_ERROR_FATAL,
            uDataDialog: { open: false, content: { username: '', tag: 0, created: 0, handlePortion: '', uuid: ''} }
        }
    }

    componentWillUnmount() {
        ws?.destroyConnection();
    }

    componentDidMount() {
        ws = new WebSocketManager(true, 'abcd');
        ws.onSignedOut = () => this.props.history.push('/login', {signedOut: true});
        ws.onstatechange = async ns => {
            this.setState({ wsState: ns });
            if (ns === WebSocketManager.STATE_CONNECTED) {
                try { console.log(await ws?.encryptedStore?.getVal('test')) }
                catch { console.log('Password wrong') }
                console.log(await ws?.encryptedStore?.getVal('doesnotexist'));
            }
        }
    }

    render() {
        return <>
            <Typography variant='h1'>Chatty</Typography>
            <h1>Current WebSocket State: {humanReadableWSStates[this.state.wsState]}</h1>

            <Container variant='outlined' style={{display: 'flex', maxWidth: 500, margin: 'auto', gap: '.75rem'}}>
                <div style={{flex: 1}}>
                    <Button primary='red' fullWidth onClick={() => {
                        if (!ws) return;
                        ws?.destroyConnection();
                        ws = undefined;
                        logout().then(() => this.props.history.push('/login'));
                    }}>Logout</Button>
                </div>
            </Container>

            <Button onClick={async () => {
                const userData = await ws?.userInfo();
                if (!userData) return;
                this.setState({uDataDialog: {open: true, content: userData}})
            }}>Get user data</Button>

            <Dialog open={this.state.uDataDialog.open}
                    onClose={() => this.setState({uDataDialog: {open: false, content: this.state.uDataDialog.content}})}>
                <DialogTextContent onClose={() => this.setState({uDataDialog: {open: false, content: this.state.uDataDialog.content}})}
                    title='User info for self' content={`UUID: ${this.state.uDataDialog.content.uuid}
Username: ${this.state.uDataDialog.content.username}
Handle: ${this.state.uDataDialog.content.handlePortion}#${this.state.uDataDialog.content.tag}
Account created: ${new Date(this.state.uDataDialog.content.created)}`} />
            </Dialog>
        </>
    }
}

export default withRouter(App);