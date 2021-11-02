export interface IAuthError {
    reason: 'already-exists' | 'invalid-cred' | 'fetch-pub-fail' | 'server-err' | 'internal-err';
    serverStatus: number;
}