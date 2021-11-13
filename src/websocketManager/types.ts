export interface IMsgSendPayload {

}
export interface IKeyUpdatePayload {
    request: 'sign';
    user: 'self' | string;
}
export interface IFileUploadPayload {

}

export interface IKeepAliveReceive {
    time: number;
}

export interface IUserInfoData {
    uuid: string;
    created: number;
    username: string;
    tag: number;
    handlePortion: string;
}

export const wsMsgTypes = ['msgSend', 'fileUpload', 'keyUpdate', 'keepAlive', 'vaultAction', 'userInfo'];

export type IWSReceivedPayload = IKeepAliveReceive | object;
export type IWSMsgTypes = 'msgSend' | 'fileUpload' | 'keyUpdate' | 'keepAlive' | 'vaultAction' | 'userInfo';