import { Middleware, Action } from "redux";
import { SYNC, Sync } from "./sync.action";
import { Dispatch } from "react";

function createSyncMiddleware(
    address: string
    , getDispatch: () => Dispatch<Action>
    , storeId: string
    , filter: undefined | ((action: Action) => boolean) = undefined
): Middleware {

    const ws = new WebSocket(address);

    let toSend: string[] = []

    ws.onopen = function () {
        const message = JSON.stringify({
            type: 'CONNECT',
            payload: {
                storeId: storeId
            }
        })
        console.log('Sending: ' + message)
        ws.send(message)
        while (toSend.length != 0) {
            const message = toSend.shift()!
            console.log('Sending: ' + message)
            ws.send(message)
        }
    }

    ws.onmessage = function (event) {
        console.log(event.data)
        const action = JSON.parse(event.data)
        if (filter != undefined && filter(action)) {
            getDispatch()(Sync(action))
        }
    }

    return () => next => action => {
        const send = async (action: Action) => {
            while (ws.readyState === 0) {
                await new Promise(r => setTimeout(r, 200))
            }
            const message = JSON.stringify({
                type: 'BROADCAST',
                payload: {
                    storeId: storeId,
                    action: action
                }
            })
            if (ws.readyState === WebSocket.OPEN && toSend.length == 0) {
                console.log('Sending: ' + message)
                ws.send(message)
            } else {
                toSend.push(message)
            }
        }
        if (action.type === SYNC) {
            next(action.payload.action)
        } else {
            if (filter != undefined && filter(action)) {
                send(action)
            }
            next(action)
        }
    }
}

export default createSyncMiddleware