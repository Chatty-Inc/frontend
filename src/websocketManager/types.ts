export interface IMsgSendPayload {

}
export interface IKeyUpdatePayload {

}
export interface IFileUploadPayload {

}

export interface IKeepAliveReceive {
    time: number;
}

export type IWSReceivedPayload = IKeepAliveReceive | object;
export type IWSMsgTypes = 'msgSend' | 'fileUpload' | 'keyUpdate' | 'keepAlive' | 'vaultAction' | 'userInfo';