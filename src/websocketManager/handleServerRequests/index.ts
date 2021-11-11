import { IWSMsgTypes, IWSReceivedPayload } from '../types';
import keyUpdate from './keyUpdate';

export async function handleServerRequests(type: IWSMsgTypes, payload: IWSReceivedPayload): Promise<object | null | undefined> {
    switch (type) {
        case 'keyUpdate': return keyUpdate(payload);
        default: return undefined
    }
}