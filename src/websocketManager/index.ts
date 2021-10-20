import parseGatewayMsg from "./parse";
import * as lzString from 'lz-string'
import debug from "../dev/logger";

/**
 * Manages the whole Gateway WebSocket connection, including
 * reconnection and message parsing. This is the lowest level
 * code that directly handles the connection and provides
 * abstractions for other code to send messages etc.
 * @class
 */
export class WebSocketManager {
    onstatechange?: (newState: number) => void;
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
    // Stores
    private promises: Record<string, object> = {};

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

    constructor(uuid: string, reconnectOnFailure: boolean = true) {
        this.reconnectOnFail = reconnectOnFailure;
        this.debug = process.env.NODE_ENV === 'development'; // Enable debug
        this.uuid = uuid;
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

        // Set event handlers
        this.ws.onopen = () => {
            debug('GatewayManager', 'Connected to Gateway at ' + this.ws?.url);
            this.connState = WebSocketManager.STATE_CONNECTED;
            this.ws?.send(lzString.compressToUint8Array('hi'));

            this.oldFailRetries = this.failureRetries;
            this.lastConnected = +new Date();
            this.failureRetries = 0;
        }
        this.ws.onmessage = msg => this.handleWSMessage(msg);

        this.ws.onclose = ev => {
            debug('GatewayManager',
                `WebSocket closed with code ${ev.code} and reason ${ev.reason}, cleanlyClosed: ${ev.wasClean}`);
            this.connState = WebSocketManager.STATE_DC_CONNECTING;
            if (+new Date() - 100 < this.lastConnected) this.failureRetries = this.oldFailRetries;
            if (this.reconnectOnFail && ev.reason !== 'bye' && ev.reason !== 'unauthorized') this.reconnectWithBackoff();
            else this.connState = WebSocketManager.STATE_ERROR_FATAL
        }
        this.ws.onerror = err => {
            this.connState = WebSocketManager.STATE_ERROR_RECONNECTING;
            debug('GatewayManager', `WebSocket encountered error: \n${JSON.stringify(err)}\nReadyState: ${this.ws?.readyState}`);
            if (this.ws?.readyState !== WebSocket.OPEN) this.reconnectOnFail
                ? this.reconnectWithBackoff()
                : this.connState = WebSocketManager.STATE_ERROR_FATAL;
        }
    }

    private handleWSMessage(incomingMsg: MessageEvent) {
        if (!(incomingMsg.data instanceof ArrayBuffer)) return
        const parsed = parseGatewayMsg(new Uint8Array(incomingMsg.data));
        switch (parsed.type) {

        }
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
    }
}