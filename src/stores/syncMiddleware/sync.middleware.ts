import { Middleware, Action } from "redux";
import { SYNC, Sync, SyncReset } from "./sync.action";
import { Dispatch } from "react";
import { ThunkJoinGame, ThunkKeepAlive, ThunkKickInactivePlayers } from "stores/gameReducer/game.thunk";
import store from "stores";
import { KEEPALIVE_TIMEOUT_MS } from "stores/gameReducer/game.state";

let storeId_: string | undefined = undefined
let ws_: WebSocket | undefined = undefined
let keepaliveInterval_: NodeJS.Timeout | undefined = undefined
let connectToRoomSuccess_: ((value?: void | PromiseLike<void> | undefined) => void) | undefined = undefined

type DataToSend = {
    data: string | ArrayBuffer | SharedArrayBuffer | Blob | ArrayBufferView
    callback: (value?: void | PromiseLike<void> | undefined) => void
}
let datasToSend: DataToSend[] = []

function sendData(data: string | ArrayBuffer | SharedArrayBuffer | Blob | ArrayBufferView): Promise<void> {
    return new Promise((success, failure) => {
        if (ws_!.readyState === WebSocket.OPEN) {
            while (datasToSend.length > 0) {
                const dataToSend = datasToSend.pop()!
                ws_!.send(dataToSend.data)
                dataToSend.callback()
            }

            ws_!.send(data)
            success()
        } else {
            datasToSend.push({
                data,
                callback: success
            })
        }
    })
}

export function connectToRoom(
    storeId: string
    , getDispatch: () => Dispatch<Action>
): Promise<void> {
    return new Promise((success, failure) => {
        storeId_ = storeId
        connectToRoomSuccess_ = success
        const message = JSON.stringify({
            type: 'CONNECT',
            payload: {
                storeId: storeId
            }
        })
        sendData(message).then(() => {
            // getDispatch()(SyncReset())
            ThunkJoinGame()(store.dispatch, store.getState, undefined)
            if (keepaliveInterval_) {
                clearInterval(keepaliveInterval_)
                keepaliveInterval_ = undefined
            }
            keepaliveInterval_ = setInterval(() => {
                ThunkKeepAlive()(store.dispatch, store.getState, undefined)
                ThunkKickInactivePlayers()(store.dispatch, store.getState, undefined)
            }, KEEPALIVE_TIMEOUT_MS / 2)
        })
    })
}

function createSyncMiddleware(
    address: string
    , getDispatch: () => Dispatch<Action>
    , filter: undefined | ((action: Action) => boolean) = undefined
): Middleware {

    ws_ = new WebSocket(address);

    ws_.onopen = function () {
        while (datasToSend.length > 0) {
            const dataToSend = datasToSend.pop()!
            ws_!.send(dataToSend.data)
            dataToSend.callback()
        }
    }

    ws_.onmessage = function (event) {
        const action = JSON.parse(event.data)
        if (action.type == 'CONNECTED') {
            if (action.payload.storeId == storeId_ && connectToRoomSuccess_) {
                connectToRoomSuccess_()
            }
        } else if (filter != undefined && filter(action)) {
            getDispatch()(Sync(action))
        }
    }

    return () => next => action => {
        const sendAction = async (action: Action) => {
            while (ws_!.readyState === 0) {
                await new Promise(r => setTimeout(r, 200))
            }
            const message = JSON.stringify({
                type: 'BROADCAST',
                payload: {
                    storeId: storeId_!,
                    action: action
                }
            })
            sendData(message)
        }
        if (action.type === SYNC) {
            next(action.payload.action)
        } else {
            if (filter != undefined && filter(action)) {
                sendAction(action)
            }
            next(action)
        }
    }
}

export default createSyncMiddleware