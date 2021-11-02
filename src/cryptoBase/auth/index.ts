import debug from '../../dev/logger';
import {endToEndEncrypt} from '../endToEnd';
import {IAuthError} from "./types";

/**
 * Make POST request with username and password to authenticate
 * @param {string} username - User username
 * @param {string} password - User password
 * @param {string} captchaToken - reCAPTCHA token
 * @param {boolean} isNewAcct - Specify true to attempt account creation
 * @param userHandle
 * @returns {boolean} - True if auth succeeded, false otherwise
 */
export async function login(username: string,
                            password: string,
                            captchaToken: string,
                            isNewAcct: boolean = false,
                            userHandle: string): Promise<IAuthError | null> {
    const baseURL = (process.env.NODE_ENV === 'development' ? '' : '');

    const pubResp = await fetch(baseURL + '/pubKey')
    if (pubResp.status !== 200) {
        debug('AuthLogin', 'Failed to fetch public key');
        return {
            reason: 'fetch-pub-fail',
            serverStatus: pubResp.status
        };
    }
    const importedKey = await window.crypto.subtle.importKey('jwk',
        await pubResp.json(),
        {name: 'RSA-OAEP', hash: 'SHA-256'}, true, ['encrypt']);

    const encryptedPayload = await endToEndEncrypt(
        JSON.stringify(isNewAcct
            ? { username: username, pw: password, captcha: captchaToken, handle: userHandle }
            : { username: username, pw: password, captcha: captchaToken }
        ),
        importedKey)

    const resp = await fetch(baseURL + (isNewAcct ? '/signup' : '/login'), {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({payload: encryptedPayload, pubKeyVer: 0}),
    });
    if (resp.status === 200) {
        debug('AuthLogin', 'Successfully authenticated with Gateway');
        return null
    }

    debug('AuthLogin', 'Authentication failed: status code is ' + resp.status);
    const errBody = await resp.json();
    return {
        reason: resp.status !== 500
            ? (errBody.err === 21 ? 'internal-err' : (isNewAcct ? 'already-exists' : 'invalid-cred'))
            : 'server-err',
        serverStatus: resp.status
    };
}

export async function logout(): Promise<boolean> {
    const url = (process.env.NODE_ENV === 'development' ? '' : '') + '/logout'

    const resp = await fetch(url, { method: 'DELETE', credentials: 'same-origin' });
    if (resp.status === 200) {
        debug('AuthLogout', 'Logged out successfully');
        return true;
    }

    debug('AuthLogout', 'Logout failed: status code is ' + resp.status);
    return false;
}