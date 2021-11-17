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
import IconSwapper, { FeatherIconNames } from '../components/utility/IconSwapper';
import ProgressRing from '../components/complex/ProgressRing';
import { IAuthErrorReasons } from '../cryptoBase/auth/types';
import { StaticContext } from 'react-router';

interface LoginState {
    username: string;
    password: string;
    loginErr?: string;
    handle: string;
    pagerPage: number;
    captchaIconSwapper: IIconSwapperProps;
    loginIconSwapper: IIconSwapperProps;
}

const ActionBtnRow = styled.div`
  display: flex;
  gap: .75rem;
  justify-content: flex-end;
  margin: 1rem 0;
`
const FlexFiller = styled.div`
  flex-grow: 1;
`

const loginHeaderContentLookup = [
    ['Sign in', 'Use your Chatty username & password'],
    ['Hello!', 'As always, keep passwords to yourself'],
    ['Are you a robot?', 'This helps ensure you\'re a human'],
    ['Just a moment', 'We\'re signing you in…']
];
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
 * Login page - Handles the whole user sign-in/up flow,
 * with Google-inspired UI and a spring animated viewpager
 */
class Login extends Component<LoginRouterProps, LoginState> {
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
            captchaIconSwapper: {icon: 'help-circle', progress: 0},
            loginIconSwapper: {icon: 'download-cloud', progress: 0},
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
            captchaIconSwapper: {icon: 'x-circle', progress: 100}
        });
        await delay(1500);
        this.setPg(0);
        this.setState({ captchaIconSwapper: {icon: 'help-circle', progress: 0} });
        return
    }

    async handleLogin(signUp = false) {
        // Attempt reCAPTCHA execution
        let captchaToken: string | null | undefined;
        try {
            if (this.reCaptcha.current?.getValue()) this.reCaptcha.current?.reset();
            captchaToken = await this.captcha();
        } catch (e) { await this.handleCaptchaErr(); return; }
        if (!captchaToken) { await this.handleCaptchaErr(); return; }

        // Update iconSwapper with a check and login 1.5s later
        await delay(500);
        this.setState({ captchaIconSwapper: {icon: 'user-check', progress: 100} });
        await delay(1500);
        this.setPg(3);

        const err = await login(this.state.username, this.state.password, captchaToken!, signUp, this.state.handle);
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
                       style={{width: 400, maxWidth: 'calc(100vw - 5rem)', height: 450, boxSizing: 'content-box',
                           margin: '2rem', paddingTop: '1.5rem'}}>
                <Centered vertical={false}>
                    <img src={chattyIcon} alt='Chatty' style={{width: 64, height: 64, borderRadius: 14}} />
                    <Typography variant='h2' textAlign='center' marginTop='1.5rem' marginBottom='.5rem'>
                        {loginHeaderContentLookup[this.state.pagerPage][0]}
                    </Typography>
                    <Typography variant='body' textAlign='center' marginTop={0}>
                        {loginHeaderContentLookup[this.state.pagerPage][1]}
                    </Typography>
                </Centered>

                <HorizontalPager page={this.state.pagerPage} marginLeft='-1rem' width={432}>
                    <>
                        <OutlinedTextField>
                            <InputBase placeholder='Username' type='text' value={this.state.username}
                                       onKeyDown={({key, currentTarget}) => {
                                           if (key === 'Enter') if (currentTarget.checkValidity()) this.setPg(1);
                                           else currentTarget.reportValidity();
                                       }} required minLength={4}
                                       onChange={e => this.setState({username: e.currentTarget.value})} />
                        </OutlinedTextField>

                        <Typography variant='p' margin='2rem 0'>
                            Always ensure you're logging into Chatty at chattyapp.cf
                            to prevent attackers from gaining access to your account.
                        </Typography>

                        <ActionBtnRow>
                            <Button onClick={() => this.setPg(0)}>Create Account</Button>
                            <FlexFiller />
                            <Button filled onClick={() => this.setPg(1)}
                                    disabled={this.state.username.trim().length < 4}>Next</Button>
                        </ActionBtnRow>

                        <Typography variant='body' color='red' fontWeight={700}>{this.state.loginErr}</Typography>
                    </>
                    <>
                        <OutlinedTextField>
                            <InputBase placeholder='Account Password' type='password' value={this.state.password}
                                       onChange={e => this.setState({password: e.currentTarget.value})}
                                       minLength={5} required ref={this.pwField} />
                        </OutlinedTextField>
                        <Typography variant='subtitle' paddingTop='.5rem' display='flex'>
                            You'll be asked for your vault password later
                        </Typography>

                        <ActionBtnRow>
                            <Button onClick={() => this.setPg(0)}>Back</Button>
                            <FlexFiller />
                            <Button filled onClick={() => {
                                this.setPg(2);
                                this.handleLogin().then();
                            }} disabled={this.state.password.length < 5}>Sign In</Button>
                        </ActionBtnRow>

                        <Button onClick={() => this.setPg(0)}>Forgot Password</Button>
                    </>
                    <>
                        <IconSwapperWithProgress
                            margin='auto'
                            icon={this.state.captchaIconSwapper.icon}
                            progress={this.state.captchaIconSwapper.progress} />
                        <Typography variant='body' marginTop='2rem' textAlign='center'>
                            Please complete the reCAPTCHA challenge if requested
                        </Typography>
                    </>
                    <>
                        <IconSwapperWithProgress
                            margin='auto'
                            icon={this.state.captchaIconSwapper.icon}
                            progress={this.state.captchaIconSwapper.progress} />
                        <Typography variant='body' marginTop='2rem'>
                            Just a moment, we're signing you in&hellip;
                        </Typography>
                    </>
                </HorizontalPager>
            </Container>

            <ReCAPTCHA ref={this.reCaptcha} sitekey={mainConf.reCAPTCHAKey} theme='dark'
                       onErrored={() => this.setState({loginErr: 'ReCAPTCHA network problem'})} size='invisible' />
        </Centered>
    }
}

export default withRouter(Login);

interface IIconSwapperProps extends CSSProperties {
    icon: FeatherIconNames;
    progress: number;
}

/**
 * Small utility functional component that combines the
 * circular progress bar and animated icon swapper for
 * certain login pages
 * @param {FeatherIconNames} icon - Currently displayed icon
 * @param {number} progress - Progress of circular progress (0 - 100)
 * @param delegated
 * @constructor
 */
export function IconSwapperWithProgress({icon, progress, ...delegated}: IIconSwapperProps) {
    return <Centered position='relative' width='fit-content' padding='1.5rem' {...delegated}>
        <IconSwapper icon={icon} size={48} />
        <ProgressRing radius={60} stroke={6} progress={progress} style={{position: 'absolute'}} />
    </Centered>
}