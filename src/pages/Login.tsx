import React, {Component, createRef} from 'react';
import {ThemeCtx} from '../components/core/UIThemeProvider';
import OutlinedTextField from '../components/base/OutinedTextField';
import InputBase from '../components/base/InputBase';
import Button from '../components/base/Button';
import {login, logout} from '../auth';
import {WebSocketManager} from '../websocketManager';
import ReCAPTCHA from 'react-google-recaptcha';
import mainConf from '../config/masterConfig';

interface LoginState {
    wsState: number;
    email: string;
    password: string;
    loginErr?: string;
}

let ws: WebSocketManager | undefined = undefined;

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
            email: '',
            password: ''
        }

        this.handleLogin = this.handleLogin.bind(this);
    }

    async handleLogin() {
        if (ws && this.state.wsState === WebSocketManager.STATE_CONNECTED) {
            this.setState({loginErr: 'WebSocket already exists'});
            return;
        }
        else if (ws) {
            ws?.destroyConnection();
            ws = undefined;
        }

        console.log('hereno')
        if (this.reCaptcha.current?.getValue()) this.reCaptcha.current?.reset()
        const captchaToken = await this.reCaptcha.current?.executeAsync();
        if (!captchaToken) {
            this.setState({loginErr: 'ReCAPTCHA error'});
            return;
        }
        console.log('hereyes')

        const v = await login(this.state.email, this.state.password, captchaToken!);
        if (v && !ws) {
            ws = new WebSocketManager('123', true);
            ws.onstatechange = ns => this.setState({wsState: ns});
        }
        else console.log('Failed to auth');
        console.log('here')
    }

    render() {
        return <>
            <h1>Login</h1>
            <h1>Current WebSocket State: {this.state.wsState}</h1>

            <OutlinedTextField>
                <InputBase placeholder='Email' type='email' value={this.state.email}
                           onChange={e => this.setState({email: e.currentTarget.value})} />
            </OutlinedTextField>
            <OutlinedTextField marginBottom='.5rem' marginTop='.5rem'>
                <InputBase placeholder='Password' type='password' value={this.state.password}
                           onChange={e => this.setState({password: e.currentTarget.value})}/>
            </OutlinedTextField>

            <Button filled fullWidth onclick={this.handleLogin}>Login</Button>
            <Button fullWidth onclick={() => {
                if (!ws) {
                    this.setState({loginErr: 'Already logged out'})
                    return;
                }
                ws?.destroyConnection();
                ws = undefined;
                logout().then();
            }}>Logout</Button>

            <p>{this.state.loginErr ?? 'No login error'}</p>
            <small>By logging in or creating an account, you agree to our privacy policy & terms of service</small>
            <small>
                This site is protected by reCAPTCHA and the
                Google <a href="https://policies.google.com/privacy">Privacy Policy</a> and <a
                href="https://policies.google.com/terms">Terms of Service</a> apply.
            </small>

            <ReCAPTCHA ref={this.reCaptcha} sitekey={mainConf.reCAPTCHAKey} theme='dark' size='invisible' />
        </>
    }
}