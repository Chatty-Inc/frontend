import { IKeyUpdatePayload } from '../types';
import { WebSocketManager } from '../index';

export default async function keyUpdate(this: WebSocketManager, payload: IKeyUpdatePayload): Promise<object | null> {
    if ('request' in payload && 'user' in payload) {
        if (payload.request === 'sign' && payload.user === 'self') {
            const newSignKey = await window.crypto.subtle.generateKey(
                {
                    name: 'ECDSA',
                    namedCurve: 'P-521', //can be 'P-256', 'P-384', or 'P-521'
                },
                true, //whether the key is extractable (i.e. can be used in exportKey)
                ['sign', 'verify'] //can be any combination of 'sign' and 'verify'
            );
            // Save private key to encryptedStore
            await this.encryptedStore?.setVal('privateSignKey', await window.crypto.subtle.exportKey(
                'jwk',
                newSignKey.privateKey!
            ));
            return window.crypto.subtle.exportKey(
                'jwk',
                newSignKey.publicKey!
            );
        }
    }
    return null;
}