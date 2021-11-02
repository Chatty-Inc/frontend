import * as base64 from 'byte-base64';

export async function arrayToBase64(arr: Uint8Array): Promise<string> {
    //return btoa(new TextDecoder('utf8').decode(arr));
    return new Promise<string>(resolve => {
        const blob = new Blob([arr],{type:'application/octet-binary'});
        const reader = new FileReader();
        reader.onload = function(evt){
            const dt = evt.target?.result as string;
            resolve(dt.substr(dt.indexOf(',') + 1));
        };
        reader.readAsDataURL(blob);
    })
    // return base64.bytesToBase64(arr);
}

export function base64ToArray(txt: string): Uint8Array {
    return base64.base64ToBytes(txt);
}

export { default as emojis } from './emojiLookup';