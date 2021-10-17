export async function arrayToBase64(arr: Uint8Array): Promise<string> {
    return new Promise<string>(resolve => {
        const blob = new Blob([arr],{type:'application/octet-binary'});
        const reader = new FileReader();
        reader.onload = function(evt){
            const dt = evt.target?.result as string;
            resolve(dt.substr(dt.indexOf(',') + 1));
        };
        reader.readAsDataURL(blob);
    })
}