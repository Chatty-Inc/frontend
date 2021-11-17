import React, {Component} from 'react';
import {ThemeCtx} from '../components/core/UIThemeProvider';
import {WebSocketManager} from '../websocketManager';
import {withRouter} from 'react-router-dom';
import { IUserInfoData } from '../websocketManager/types';
import { LoginRouterProps } from './Login';
import AppUISlots from '../components/utility/AppUISlots';
import ServerList, { IServerItem } from '../components/utility/MainAppComponents/ServerList';
import ChannelMessages from '../components/utility/MainAppComponents/ChannelMessages';
import MessageBubble from '../components/message/MessageBubble';
import ChannelHeader from '../components/utility/MainAppComponents/ChannelHeader';
import MessageHeader from '../components/utility/MainAppComponents/MessageHeader';
import ChannelList from '../components/utility/MainAppComponents/ChannelList';
import MessageInput from '../components/utility/MainAppComponents/MessageInput';

interface AppState {
    wsState: number;
    uDataDialog: { open: boolean, content: IUserInfoData };
    servers: IServerItem[]
}

let ws: WebSocketManager | undefined = undefined;

/**
 * Login page
 */
class App extends Component<LoginRouterProps, AppState> {
    static contextType = ThemeCtx;

    constructor(props: LoginRouterProps) {
        super(props);

        this.state = {
            wsState: WebSocketManager.STATE_ERROR_FATAL,
            uDataDialog: { open: false, content: { username: '', tag: 0, created: 0, handlePortion: '', uuid: ''} },
            servers: new Array(2).fill(null).map((_, i) => {
                return {
                    name: ['Funny stone', 'Dummy server', 'Drop your phone', 'This is a test', 'Chatty is nice']
                        [Math.floor(Math.random() * 5)],
                    avatarURL: `https://picsum.photos/48.webp?random=${i}`,
                    guid: `dummyGUID${i}`
                }
            })
        }
    }

    componentWillUnmount() {
        ws?.destroyConnection();
    }

    componentDidMount() {
        document.title = 'Chatty (Loading...)';

        ws = new WebSocketManager(true, 'abcd');
        ws.onSignedOut = () => this.props.history.push('/login', {signedOut: true});
        ws.onstatechange = async ns => {
            this.setState({ wsState: ns });
            if (ns === WebSocketManager.STATE_CONNECTED) {
                try { console.log(await ws?.encryptedStore?.getVal('test')) }
                catch { console.log('Password wrong') }
                console.log(await ws?.encryptedStore?.getVal('privateSignKey'));
            }
        }
    }

    render() {
        return <AppUISlots
            serverList={<ServerList servers={this.state.servers} onServerClicked={console.log} />}
            channelHeader={<ChannelHeader serverName='A funny server' />}
            channelList={<ChannelList />}
            messageHeader={<MessageHeader channelName='staff-only' channelPrivate={true} />}
            messageHistory={<ChannelMessages totalMessages={50} channelName='staff-only'>
                {
                    i => <MessageBubble content={`Funny content ${i}`} />
                }
            </ChannelMessages>}
            messageInput={<MessageInput />}
        />
    }
}

export default withRouter(App);