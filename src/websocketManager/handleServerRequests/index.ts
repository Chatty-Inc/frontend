import { IKeyUpdatePayload, IWSMsgTypes, IWSReceivedPayload } from '../types';
import keyUpdate from './keyUpdate';
import { WebSocketManager } from '../index';

export async function handleServerRequests(this: WebSocketManager,
                                           type: IWSMsgTypes,
                                           payload: IWSReceivedPayload): Promise<object | null | undefined> {
    switch (type) {
        case 'keyUpdate': return keyUpdate.call(this, payload as IKeyUpdatePayload);
        default: return undefined
    }
}