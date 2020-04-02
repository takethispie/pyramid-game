import { Middleware } from "redux";
import { MULTI_ACTION } from "./multiAction.actions";

export const multiAction: Middleware = () => next => action => {
    if (action.type === MULTI_ACTION) {
        for (const subAction of action.payload.actions) {
            next(subAction)
        }
    } else {
        next(action)
    }
}