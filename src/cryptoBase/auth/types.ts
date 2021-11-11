export type IAuthErrorReasons = 'already-exists' | 'invalid-cred' | 'fetch-pub-fail' | 'server-err' | 'internal-err';

export interface IAuthError {
    reason: IAuthErrorReasons;
    serverStatus: number;
}