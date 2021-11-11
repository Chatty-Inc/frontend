import React, {Component, createRef} from 'react';
import {ThemeCtx} from '../components/core/UIThemeProvider';
import Button from '../components/base/Button';
import {logout} from '../cryptoBase/auth';
import {WebSocketManager} from '../websocketManager';
import ReCAPTCHA from 'react-google-recaptcha';
import Container from '../components/base/Container';
import Typography from "../components/complex/Typography";
import SyncedEncryptedStore from "../stores/SyncedEncryptedStore";
import {RouteComponentProps, withRouter} from 'react-router-dom';
import Dialog, { DialogTextContent } from '../components/complex/Dialog';

interface AppState {
    wsState: number;
    uDataDialog: { open: boolean, content: string }
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
class App extends Component<RouteComponentProps, AppState> {
    static contextType = ThemeCtx;
    private reCaptcha = createRef<ReCAPTCHA>();

    constructor(props: RouteComponentProps) {
        super(props);

        this.state = {
            wsState: WebSocketManager.STATE_ERROR_FATAL,
            uDataDialog: { open: false, content: '' }
        }
    }

    componentWillUnmount() {
        ws?.destroyConnection();
    }

    componentDidMount() {
        ws = new WebSocketManager(true);
        ws.onSignedOut = () => this.props.history.push('/login');
        ws.onstatechange = async ns => {
            this.setState({wsState: ns});
            if (ns === WebSocketManager.STATE_CONNECTED) {
                const store = new SyncedEncryptedStore(ws!, 'abcd');
                try {
                    console.log(await store.getVal('test'));
                } catch {
                    console.log('Password wrong')
                }
                console.log(await store.getVal('doesnotexist'));
            }
        }
    }

    render() {
        return <>
            <Typography variant='h1'>Chatty</Typography>
            <h1>Current WebSocket State: {humanReadableWSStates[this.state.wsState]}</h1>

            <Container variant='outlined' style={{display: 'flex', maxWidth: 500, margin: 'auto', gap: '.75rem'}}>
                <div style={{flex: 1}}>
                    <Button primary='red' fullWidth onclick={() => {
                        if (!ws) return;
                        ws?.destroyConnection();
                        ws = undefined;
                        logout().then(() => this.props.history.push('/login'));
                    }}>Logout</Button>
                </div>
            </Container>

            <Button onclick={async () => {
                const userData = await ws?.send('userInfo', {user: 'self'});
                if (!userData) return;
                this.setState({uDataDialog: {open: true, content: JSON.stringify(userData)}})
            }}>Get user data</Button>

            <Dialog open={this.state.uDataDialog.open}
                    onClose={() => this.setState({uDataDialog: {open: false, content: this.state.uDataDialog.content}})}>
                <DialogTextContent onClose={() => this.setState({uDataDialog: {open: false, content: this.state.uDataDialog.content}})}
                    title='User info for self' content={this.state.uDataDialog.content} />
            </Dialog>
        </>
    }
}

export default withRouter(App);