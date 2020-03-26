import { Middleware, Action } from "redux";
import { SYNC, Sync } from "./sync.action";
import { Dispatch } from "react";

function createSyncMiddleware(address: string, getDispatch: () => Dispatch<Action>): Middleware {

    const ws = new WebSocket(address);

    ws.onmessage = function (event) {
        getDispatch()(Sync(JSON.parse(event.data)))
    }

    return () => next => action => {
        const send = async (action: Action) => {
            while (ws.readyState === 0) {
                await new Promise(r => setTimeout(r, 200))
            }
            ws.send(JSON.stringify(action))
        }
        if (action.type === SYNC) {
            next(action.payload.action)
        } else {
            send(action)
            next(action)
        }
    }
}

export default createSyncMiddleware