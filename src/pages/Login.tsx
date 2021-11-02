import React, {Component, createRef} from 'react';
import {ThemeCtx} from '../components/core/UIThemeProvider';
import OutlinedTextField from '../components/base/OutinedTextField';
import InputBase from '../components/base/InputBase';
import Button from '../components/base/Button';
import {login, logout} from '../cryptoBase/auth';
import {WebSocketManager} from '../websocketManager';
import ReCAPTCHA from 'react-google-recaptcha';
import mainConf from '../dev/config/masterConfig';
import Container from '../components/base/Container';
import Icon from '@ailibs/feather-react-ts'
import Typography from "../components/complex/Typography";
import SyncedEncryptedStore from "../stores/SyncedEncryptedStore";

interface LoginState {
    wsState: number;
    username: string;
    password: string;
    loginErr?: string;
    handle: string;
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
export default class Login extends Component<{}, LoginState> {
    static contextType = ThemeCtx;
    private reCaptcha = createRef<ReCAPTCHA>();

    constructor(props: {}) {
        super(props);

        this.state = {
            wsState: WebSocketManager.STATE_ERROR_FATAL,
            username: '',
            password: '',
            handle: '',
        }

        this.handleLogin = this.handleLogin.bind(this);
    }

    componentWillUnmount() {
        ws?.destroyConnection();
    }

    async captcha() {
        let times = 0;
        const id = setInterval(() => {
            if (times >= 10) clearInterval(id);
            // Force nicer styling for recaptcha
            document.querySelectorAll('iframe[title="recaptcha challenge"]')?.forEach(e => {
                const elem = e
                    .parentElement
                    ?.previousSibling as HTMLElement
                if (!elem) return;
                elem.style.backgroundColor = '#000';
                const container = e.parentElement as HTMLElement;
                container.style.borderRadius = '10px';
                container.style.overflow = 'hidden';
            });
            times++;
        }, 50);
        return this.reCaptcha.current?.executeAsync();
    }

    async handleLogin(signUp = false) {
        if (ws && this.state.wsState === WebSocketManager.STATE_CONNECTED) {
            this.setState({loginErr: 'WebSocket already exists'});
            return;
        }
        else if (ws) {
            ws?.destroyConnection();
            ws = undefined;
        }

        console.log('Waiting for captcha')
        if (this.reCaptcha.current?.getValue()) this.reCaptcha.current?.reset()
        const captchaToken = await this.captcha()
        if (!captchaToken) {
            this.setState({loginErr: 'ReCAPTCHA error'});
            return;
        }

        const err = await login(this.state.username, this.state.password, captchaToken!, signUp, this.state.handle);
        if (err) {
            this.setState({loginErr: (signUp ? 'Sign up' : 'login') + ' error: ' + err.reason})
            return;
        }
        if (signUp) {
            this.setState({loginErr: 'Signed up'});
            return;
        }
        if (!ws) {
            ws = new WebSocketManager('123', true);
            ws.onstatechange = async ns => {
                this.setState({wsState: ns});
                if (ns === WebSocketManager.STATE_CONNECTED) {
                    const store = new SyncedEncryptedStore(ws!, 'abcd');
                    await store.setVal('test', {hmm: 'does this work'});
                    console.log(await store.getVal('test'));
                }
            }
            this.setState({loginErr: 'Logged in'})
        }
    }

    render() {
        return <>
            <Typography variant='h1'>Chatty</Typography>
            <h1>Login</h1>
            <h1>Current WebSocket State: {humanReadableWSStates[this.state.wsState]}</h1>

            <Container variant='outlined' style={{display: 'flex', maxWidth: 500, margin: 'auto', gap: '.75rem'}}>
                <div style={{flex: 1}}>
                    <div style={{display: 'flex', gap: '.5rem'}}>
                        <OutlinedTextField flex={1}>
                            <InputBase placeholder='Username' type='email' value={this.state.username}
                                       onChange={e => this.setState({username: e.currentTarget.value})} />
                        </OutlinedTextField>
                        <OutlinedTextField flex={1}>
                            <InputBase placeholder='Handle' type='text' value={this.state.handle}
                                       onChange={e => this.setState({handle: e.currentTarget.value})}/>
                        </OutlinedTextField>
                    </div>
                    <OutlinedTextField marginBottom='.5rem' marginTop='.5rem'>
                        <InputBase placeholder='Password' type='password' value={this.state.password}
                                   onChange={e => this.setState({password: e.currentTarget.value})}/>
                    </OutlinedTextField>

                    <Button fullWidth onclick={() => this.handleLogin()}>Login</Button>
                    <Button filled fullWidth onclick={() => this.handleLogin(true)}>Sign Up</Button>
                    <Button primary='red' fullWidth onclick={() => {
                        if (!ws) {
                            this.setState({loginErr: 'Already logged out'})
                            return;
                        }
                        ws?.destroyConnection();
                        ws = undefined;
                        logout().then();
                    }}>Logout</Button>
                </div>

                <div style={{width: 100}}>
                    <Button fullWidth><Icon name='log-in' size='1em' /> Login</Button>

                    <Button>Login</Button>
                    <Icon size={36} name='user-plus' />
                </div>
            </Container>

            <p>{this.state.loginErr ?? 'No login error'}</p>
            <small>By logging in or creating an account, you agree to our privacy policy & terms of service</small>
            <small>
                This site is protected by reCAPTCHA and the
                Google <a href='https://policies.google.com/privacy'>Privacy Policy</a> and <a
                href='https://policies.google.com/terms'>Terms of Service</a> apply.
            </small>

            <ReCAPTCHA ref={this.reCaptcha} sitekey={mainConf.reCAPTCHAKey} theme='dark'
                       onErrored={() => this.setState({loginErr: 'ReCAPTCHA network problem'})} size='invisible' />
        </>
    }
}