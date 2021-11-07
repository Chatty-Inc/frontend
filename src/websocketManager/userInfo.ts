import {WebSocketManager} from './index';

/**
 * Request user metadata of another user thru UUID
 * (if permissions are sufficient), or of themselves.
 * This is a very small wrapper function for now.
 * @param {WebSocketManager} ws - WebSocketManager instance
 * @returns
 */
export default async function userInfo(ws: WebSocketManager) {
    await ws.send('userInfo', {})
}