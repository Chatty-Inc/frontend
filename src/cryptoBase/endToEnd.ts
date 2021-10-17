import * as lzString from 'lz-string';
import {arrayToBase64} from "../utils";

/**
 * Encrypt a string payload with AES-GCM, then use RSA-OAEP to encrypt
 * the generated AES key.
 * @param {string} payload - String data to encrypt
 * @param {CryptoKey} pubKey  - Public key used to encrypt one time generated AES key
 * @returns {string} - Encrypted data in base64
 */
export async function endToEndEncrypt(payload: string, pubKey: CryptoKey): Promise<string> {
    /*
     Data -> Uint8Array
                 +
        Generated AES-GCM Key -> JWK -> JSON Stringify -> LZ-String
                 |                                            +
                 |                                    RSA-OAEP Public Key
               base64 ----------Combine with ';'---------- base64
                                      |
                                    Return
     */

    // AES portion
    const oneTimeAESKey = await window.crypto.subtle.generateKey(
        {
            name: 'AES-GCM',
            length: 256
        },
        true,
        ['encrypt', 'decrypt']
    );
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const exportedAESKey = await window.crypto.subtle.exportKey('raw', oneTimeAESKey);

    const cipherText = await window.crypto.subtle.encrypt(
        {
            name: 'AES-GCM',
            iv: iv,
            tagLength: 128,
        },
        oneTimeAESKey,
        new TextEncoder().encode(payload)
    );

    // RSA portion
    const encrypted = await window.crypto.subtle.encrypt(
        {
            name: 'RSA-OAEP'
        },
        pubKey,
        lzString.compressToUint8Array(await arrayToBase64(new Uint8Array(exportedAESKey)))
    );

    console.log('Cipher:', cipherText);
    console.log('EncryptedKey:', encrypted);

    // Combine cipherText and encrypted
    return (await arrayToBase64(cipherText)) + ';' + (await arrayToBase64(encrypted)) + ';' + (await arrayToBase64(iv));
}