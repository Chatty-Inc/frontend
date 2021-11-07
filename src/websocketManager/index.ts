import parseGatewayMsg from "./parse";
import * as lzString from 'lz-string'
import debug from "../dev/logger";
import {IWSMsgTypes, IWSReceivedPayload} from "./types";
import constructGatewayMsg from "./construct";

/**
 * Manages the whole Gateway WebSocket connection, including
 * reconnection and message parsing. This is the lowest level
 * code that directly handles the connection and provides
 * abstractions for other code to send messages etc.
 * @class
 */
export class WebSocketManager {
    onstatechange?: (newState: number) => void;
    onSignedOut?: () => void; // Called when Gateway closes WS with auth error
    // Stuff that should never change
    readonly uuid: string = '';
    readonly gatewayURL: string = '';
    readonly debug: boolean = false;
    // WS object is not readonly since it changes when attempting reconnection
    private ws?: WebSocket = undefined;
    // Reconnection state variables
    private privateConnState?: number
    private failureRetries = 0; // Exponential backoff reconnection delay in ms
    private oldFailRetries = 0; // Stores failureRetries before resetting to 0
    private lastConnected = +new Date();
    private retryAt = +new Date(); // Time to retry
    private reconnectIntID = 0;
    private readonly reconnectOnFail: boolean;
    // Keepalive interval ID (approx every 5s)
    private keepaliveID: number | null = null;
    // Stores
    private promises: Record<string, (value: (IWSReceivedPayload | PromiseLike<IWSReceivedPayload>)) => void> = {};
    // Static constants
    static STATE_DC_CONNECTING = 0;
    static STATE_CONNECTED = 1;
    static STATE_ERROR_RECONNECTING = 2;
    static STATE_ERROR_FATAL = 3;
    static MAX_RETRIES = 20;
    static RETRY_RANDOMNESS = 10;
    static RETRY_EXP = 4;
    static MAX_BACKOFF_DUR = 60000;
    static INITIAL_BACKOFF = 500;

    constructor(reconnectOnFailure: boolean = true) {
        this.reconnectOnFail = reconnectOnFailure;
        this.debug = process.env.NODE_ENV === 'development'; // Enable debug
        this.gatewayURL = this.debug ? 'ws://localhost:3000/ws' : ''; // Fill in production gateway URL

        debug('GatewayManager', 'Attempting Gateway WebSocket connection at ' + this.gatewayURL);

        (async () => {
            try {await fetch(this.gatewayURL.replace('ws', 'http'))}
            catch{}
            this.connect();
        })();
    }

    set connState(v: number) {
        this.privateConnState = v;
        if (this.onstatechange) this.onstatechange(this.privateConnState);
    }

    /** Called on initial connection/reconnection attempt */
    private connect() {
        this.connState = WebSocketManager.STATE_DC_CONNECTING;

        if (this.ws?.readyState !== WebSocket.CLOSED && this.ws?.readyState !== WebSocket.CLOSING)
            this.ws?.close(); // Close WebSocket if its open
        this.ws = undefined;

        const ws = new WebSocket(this.gatewayURL); // Create another WebSocket
        this.ws = ws;
        this.ws.binaryType = 'arraybuffer';

        setTimeout(() => {
            if (ws.readyState !== WebSocket.OPEN) {
                ws.close();
                debug('GatewayManager', 'WebSocket connection attempt timed out');
            }
        }, 500); // Close connection if not connected in 500ms

        // Set event handlers for WebSocket
        this.ws.onopen = () => {
            debug('GatewayManager', 'Connected to Gateway at ' + this.ws?.url);
            this.ws?.send(lzString.compressToUint8Array('hi'));

            this.oldFailRetries = this.failureRetries;
            this.lastConnected = +new Date();
            this.failureRetries = 0;

            if (this.keepaliveID) clearInterval(this.keepaliveID);
            this.keepaliveID = setInterval(async () => {
                const sentTime = +new Date();
                debug('GatewayManager', 'Sent keepalive at: ' + new Date(sentTime));
                const resp = await this.send('keepAlive', {});
                if ('time' in resp) {
                    debug('GatewayManager', 'WS latency: ' + (Number(resp.time) - sentTime) + 'ms');
                }
            }, 5000) as unknown as number;
            this.connState = WebSocketManager.STATE_CONNECTED;
        }
        this.ws.onmessage = msg => this.handleWSMessage(msg);

        this.ws.onclose = ev => {
            // Stop keepalive interval
            if (this.keepaliveID) clearInterval(this.keepaliveID);

            debug('GatewayManager',
                `WebSocket closed with code ${ev.code} and reason ${ev.reason}, cleanlyClosed: ${ev.wasClean}`);
            this.connState = WebSocketManager.STATE_DC_CONNECTING;
            if (+new Date() - 100 < this.lastConnected) this.failureRetries = this.oldFailRetries;
            if (this.reconnectOnFail && ev.reason !== 'bye' && ev.reason !== 'unauthorized') this.reconnectWithBackoff();
            else {
                this.connState = WebSocketManager.STATE_ERROR_FATAL;
                if (this.onSignedOut) this.onSignedOut();
            }
        }
        this.ws.onerror = err => {
            this.connState = WebSocketManager.STATE_ERROR_RECONNECTING;
            debug('GatewayManager',
                `WebSocket encountered error: \n${JSON.stringify(err)}\nReadyState: ${this.ws?.readyState}`);
            if (this.ws?.readyState !== WebSocket.OPEN) this.reconnectOnFail
                ? this.reconnectWithBackoff()
                : this.connState = WebSocketManager.STATE_ERROR_FATAL;
        }
    }

    /** Lowest level received ws message handler */
    private handleWSMessage(incomingMsg: MessageEvent) {
        if (!(incomingMsg.data instanceof ArrayBuffer)) return
        const parsed = parseGatewayMsg(new Uint8Array(incomingMsg.data));
        if (parsed?.tag && this.promises[parsed?.tag]) {
            this.promises[parsed.tag](parsed.payload);
            delete this.promises[parsed.tag];
        }
    }

    /**
     * Lowest level sending ws method
     * @param {IWSMsgTypes} type - Type of message to send
     * @param {object} payload - Data payload to send
     * @returns {string} - Tag sent with data
     * */
    private sendWSMessage(type: IWSMsgTypes, payload: object): string | null {
        if (this.ws?.readyState !== WebSocket.OPEN) return null;

        let tag = '';

        do tag = Math.floor(Math.random() * 10000).toString();
        while (Object.keys(this.promises).includes(tag));

        const msg = constructGatewayMsg(tag, type, payload);
        this.ws?.send(lzString.compressToUint8Array(msg));

        return tag;
    }

    /**
     * Public-facing method for sending WS messages to
     * the Gateway. Mostly a wrapper method for the private
     * method 'this.sendWSMessage', with some promise logic
     */
    send(type: IWSMsgTypes, payload: object): Promise<IWSReceivedPayload> {
        return new Promise<IWSReceivedPayload>((resolve, reject) => {
            const tag = this.sendWSMessage(type, payload);
            if (!tag) {
                reject();
                return;
            }
            this.promises[tag] = resolve;
        });
    }

    /** Attempt reconnection with exponential backoff policy */
    private reconnectWithBackoff() {
        if (this.failureRetries > WebSocketManager.MAX_RETRIES) { // Stop retrying
            this.connState = WebSocketManager.STATE_ERROR_FATAL;
            return;
        }
        if (this.ws?.readyState !== WebSocket.CLOSED) return;
        if (+new Date() < this.retryAt) return; // Still waiting

        this.failureRetries += 1;
        const waitDur = WebSocketManager.getExpRetryDur(this.failureRetries);
        debug('GatewayManager', `Reconnection attempt #${this.failureRetries}, connecting in ${waitDur}ms`);
        this.retryAt = +new Date() + waitDur;
        this.reconnectIntID = +setInterval(() => {
            if (+new Date() >= this.retryAt) {
                this.connect();
                clearInterval(this.reconnectIntID);
            }
        }, 100); // Check if its time to retry
    }
    /** Calculate the duration to wait before retrying, up to a maximum duration */
    private static getExpRetryDur(retryCount: number) {
        return Math.round(Math.min(Math.pow(retryCount, WebSocketManager.RETRY_EXP) + WebSocketManager.INITIAL_BACKOFF
            + (Math.random() * WebSocketManager.RETRY_RANDOMNESS * (retryCount + 1)), WebSocketManager.MAX_BACKOFF_DUR));
    }

    destroyConnection(reason?: string) {
        debug('GatewayManager', 'Closing connection as requested');
        this.ws?.close(1000, reason ?? 'bye');
        clearInterval(this.reconnectIntID);
        if (this.keepaliveID) clearInterval(this.keepaliveID);
    }
}