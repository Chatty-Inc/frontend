interface constructedMsgOptions {

}

/**
 * A basic function right above the WebSocketManager that ensures
 * correct syntax in messages sent to the Gateway. Constructs an
 * uncompressed string that can be sent to the Gateway after compression.
 * Using this function prevents malformed messages from being sent to the Gateway.
 * @param {string} tag - Tag that will be sent back from server when
 * the message has been processed (successfully or not)
 * @param {string} type - What type of message to send to the server
 * @param {constructedMsgOptions} options -
 * @returns {string} - Constructed message that can be sent after compression
 */
export default function constructGatewayMsg(tag: string, type: 'msg' | 'fileUpload', options: constructedMsgOptions): string {
    // Format: tag |
    return ''
}