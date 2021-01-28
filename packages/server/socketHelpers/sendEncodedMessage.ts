import {HttpResponse, WebSocket} from 'uWebSockets.js'
import handleClose from '../socketHandlers/handleClose'
import sendSSEMessage from '../sse/sendSSEMessage'
import ConnectionContext from './ConnectionContext'
import isHttpResponse from './isHttpResponse'

const ESTIMATED_MTU = 1400
const TIME_OUT_COEFFICIENT = 2.0
const MAX_TIMEOUT = 10000 // 10 seconds
const MAX_MESSAGE_ID = 128

const sendAndPushToReliableQueue = (
  context: ConnectionContext,
  synId: number,
  message: string,
  timeout = 2000
) => {
  const {socket, reliableQueue} = context
  if (timeout > MAX_TIMEOUT) {
    isHttpResponse(socket) ? socket.close() : handleClose(socket)
    return
  }
  sendEncodedMessageBasedOnSocket(socket, message)
  const timer = setTimeout(() => {
    const newTimeout = timeout * TIME_OUT_COEFFICIENT
    sendAndPushToReliableQueue(context, synId, message, newTimeout)
  }, timeout)
  reliableQueue[synId % MAX_MESSAGE_ID] = timer
}

const sendEncodedMessageBasedOnSocket = (socket: WebSocket | HttpResponse, message: string) => {
  isHttpResponse(socket)
    ? sendSSEMessage(socket as HttpResponse, message)
    : socket.send(message, false, message.length > ESTIMATED_MTU)
}

const sendEncodedMessage = (context: ConnectionContext, object: any, syn = false) => {
  const {socket} = context
  if (socket.done) return
  let message: string

  if (syn) {
    const synMessage = {
      synId: context.synId % MAX_MESSAGE_ID,
      object
    }
    message = JSON.stringify(synMessage)
    sendAndPushToReliableQueue(context, context.synId, message)
    context.synId++
  } else {
    message = JSON.stringify(object)
    sendEncodedMessageBasedOnSocket(socket, message)
  }
}

export default sendEncodedMessage
