import {WebSocketManager} from '../websocketManager';
import * as lzString from 'lz-string';
import {arrayToBase64, base64ToArray} from '../utils';

export interface IEncryptedStoreData {
    salt?: string;
    error?: string;
    content?: string;
    iv?: string;
}

/**
 * @class
 * Wrapper class that interfaces with the Gateway to
 * request for encrypted data and decrypts it with the
 * provided password automagically.
 */
export default class SyncedEncryptedStore {
    private readonly ws: WebSocketManager;
    private readonly password: Uint8Array;

    /**
     * @constructor
     * @param {WebSocketManager} ws - WebSocket instance to interface with
     * @param {string} pass - Password to decrypt data with
     */
    constructor(ws: WebSocketManager, pass: string) {
        this.ws = ws
        this.password = new TextEncoder().encode(pass);
    }

    private async deriveAESKey(salt: Uint8Array): Promise<CryptoKey> {
        const pbkdf2Key = await window.crypto.subtle.importKey('raw',
            this.password,
            'PBKDF2',
            false,
            ['deriveKey']
        );
        return window.crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt: salt,
                iterations: 250000,
                hash: 'SHA-512',
            },
            pbkdf2Key,
            { name: 'AES-GCM', length: 256 },
            false,
            ['encrypt', 'decrypt']
        );
    }

    async setVal(key: string, payload: object) {
        const salt = window.crypto.getRandomValues(new Uint8Array(16)),
            iv = window.crypto.getRandomValues(new Uint8Array(12));

        const aesKey = await this.deriveAESKey(salt);
        const encryptedContent = await window.crypto.subtle.encrypt(
            {
                name: 'AES-GCM',
                iv: iv,
            },
            aesKey,
            await lzString.compressToUint8Array(JSON.stringify(payload))
        );

        await this.ws.send('vaultAction', {
            action: 'set',
            payload: await arrayToBase64(encryptedContent),
            key,
            salt: await arrayToBase64(salt),
            iv: await arrayToBase64(iv)
        });
    };

    async getVal(key: string): Promise<object> {
        const resp = (await this.ws.send('vaultAction', {
            action: 'get',
            key,
        })) as IEncryptedStoreData;

        if (!resp.salt || !resp.content || !resp.iv || resp.error)
            throw new Error('Gateway error' + resp.error ? (' : ' + resp.error) : '');

        const salt = base64ToArray(resp.salt),
            encrypted = base64ToArray(resp.content),
            iv = base64ToArray(resp.iv);

        const aesKey = await this.deriveAESKey(salt);
        const compressedContent = await window.crypto.subtle.decrypt(
            {
                name: 'AES-GCM',
                iv: iv,
            },
            aesKey,
            encrypted
        );

        console.log(compressedContent)

        return JSON.parse(lzString.decompressFromUint8Array(new Uint8Array(compressedContent)) as string);
    }
}