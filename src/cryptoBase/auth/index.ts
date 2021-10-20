import debug from '../../dev/logger';
import {endToEndEncrypt} from '../endToEnd';

/**
 * Make POST request with email and password to authenticate
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} captchaToken - reCAPTCHA token
 * @param {boolean} isNewAcct - Specify true to attempt account creation
 * @returns {boolean} - True if auth succeeded, false otherwise
 */
export async function login(email: string, password: string, captchaToken: string, isNewAcct: boolean = false): Promise<boolean> {
    const baseURL = (process.env.NODE_ENV === 'development' ? '' : '');

    const pubResp = await fetch(baseURL + '/pubKey')
    if (pubResp.status !== 200) {
        debug('AuthLogin', 'Failed to fetch public key');
        return false;
    }
    const importedKey = await window.crypto.subtle.importKey('jwk',
        await pubResp.json(),
        {name: 'RSA-OAEP', hash: 'SHA-256'}, true, ['encrypt']);

    const encryptedPayload = await endToEndEncrypt(
        JSON.stringify({email: email, pw: password, captcha: captchaToken}),
        importedKey)
    console.log(encryptedPayload);

    const resp = await fetch(baseURL + '/login', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({payload: encryptedPayload, pubKeyVer: 0}),
    });
    if (resp.status === 200) {
        debug('AuthLogin', 'Successfully authenticated with Gateway');
        return true;
    }

    debug('AuthLogin', 'Authentication failed: status code is ' + resp.status);
    return false;
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