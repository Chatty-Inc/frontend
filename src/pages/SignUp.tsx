import React, { Component, createRef, CSSProperties } from 'react';
import {ThemeCtx} from '../components/core/UIThemeProvider';
import OutlinedTextField from '../components/base/OutinedTextField';
import InputBase from '../components/base/InputBase';
import Button from '../components/base/Button';
import {login} from '../cryptoBase/auth';
import ReCAPTCHA from 'react-google-recaptcha';
import mainConf from '../dev/config/masterConfig';
import Container from '../components/base/Container';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import Centered from '../components/utility/Centered';
import Typography from '../components/complex/Typography';
import chattyIcon from '../assets/img/chattyIcon.png';
import HorizontalPager from '../components/complex/HorizontalPager';
import styled from 'styled-components';
import delay from '../utils/delay';
import { IAuthErrorReasons } from '../cryptoBase/auth/types';
import { StaticContext } from 'react-router';

interface LoginState {
    username: string;
    password: string;
    loginErr?: string;
    handle: string;
    pagerPage: number;
}

const simpleLoginErrors: Record<IAuthErrorReasons, string> = {
    'invalid-cred': 'Verify if your credentials are correct',
    'fetch-pub-fail': 'Server is unreachable',
    'already-exists': 'An account with this username already exists',
    'server-err': 'Server error, try again later',
    'internal-err': 'An internal error has occurred, please report this error if it persists'
}

export interface ILoginRouterState {
    signedOut: boolean;
}
export type LoginRouterProps = RouteComponentProps<{}, StaticContext, ILoginRouterState>

/**
 * Sign up page - Simple form for user sign up
 */
class SignUp extends Component<LoginRouterProps, LoginState> {
    static contextType = ThemeCtx;
    private reCaptcha = createRef<ReCAPTCHA>();
    private readonly initialState: LoginState;
    private readonly pwField: React.RefObject<InputBase>;

    constructor(props: LoginRouterProps) {
        super(props);

        this.state = this.initialState = {
            username: '',
            password: '',
            handle: '',
            pagerPage: 0,
        };

        this.handleLogin = this.handleLogin.bind(this);
        this.setPg = this.setPg.bind(this);

        this.pwField = createRef<InputBase>()
    }

    componentDidMount() {
        document.title = 'Chatty - Login';
        if (!this.props.location.state?.signedOut) this.props.history.push('/app')
    }

    private setPg(page?: number) {
        const targetPg = page ?? this.state.pagerPage + 1;
        if (targetPg > this.state.pagerPage) this.setState({loginErr: ''});
        this.setState({pagerPage: targetPg});
    }

    async captcha() {
        // Over-engineered piece of code to style ReCAPTCHA dialog
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

    async handleCaptchaErr() {
        this.setState({
            ...this.initialState,
            loginErr: 'ReCAPTCHA error, please try again later',
        });
        await delay(1500);
        this.setPg(0);
        return
    }

    async handleLogin() {
        // Attempt reCAPTCHA execution
        let captchaToken: string | null | undefined;
        try {
            if (this.reCaptcha.current?.getValue()) this.reCaptcha.current?.reset();
            captchaToken = await this.captcha();
        } catch (e) { await this.handleCaptchaErr(); return; }
        if (!captchaToken) { await this.handleCaptchaErr(); return; }

        // Update iconSwapper with a check and login 1.5s later
        await delay(500);
        await delay(1500);
        this.setPg(3);

        const err = await login(this.state.username, this.state.password, captchaToken!, true, this.state.handle);
        if (err) {
            this.setState({
                ...this.initialState,
                loginErr: simpleLoginErrors[err.reason] ?? 'An unexpected error has occurred',
            });
            this.setPg(0);
            return;
        }
        else this.props.history.push('/app');
    }

    render() {
        return <Centered>
            <Container variant='outlined'
                       style={{width: 400, maxWidth: 'calc(100vw - 5rem)', height: 450, margin: '2rem', paddingTop: '1.5rem'}}>

            </Container>

            <ReCAPTCHA ref={this.reCaptcha} sitekey={mainConf.reCAPTCHAKey} theme='dark'
                       onErrored={() => this.setState({loginErr: 'ReCAPTCHA network problem'})} size='invisible' />
        </Centered>
    }
}

export default withRouter(SignUp);