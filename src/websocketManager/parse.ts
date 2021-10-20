import * as lzString from 'lz-string'
import debug from '../dev/logger';

/**
 * Interface for outputting parsed gateway objects
 * @interface
 */
export interface parsedGatewayMsg {
    type: 'participantModify' | 'msg' | 'file' | 'keepAlive' | 'connCmd' | 'resp' | 'invalid' | string; // Pretty self explanatory
    payload?: object;
    tag?: string;
}

/**
 * Parse a message received from the Gateway WebSocket
 * @param {Uint8Array} rawMsg - The raw compressed message received
 * @returns {parsedGatewayMsg}
 */
export default function parseGatewayMsg(rawMsg: Uint8Array): parsedGatewayMsg {
    const msg = lzString.decompressFromUint8Array(rawMsg);
    debug('ParseGatewayMsg', 'Received Gateway message:\n' + msg);

    if (!msg) return {type: 'invalid'};
    const split = msg.split(',');
    if (split.length < 2) return {type: 'invalid'};

    if (split.length === 2) return {type: split[0], payload: {}}
    return {tag: split[0], type: split[1], payload: {}}
}