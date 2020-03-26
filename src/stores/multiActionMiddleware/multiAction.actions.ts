import { Action } from "redux"

export const MULTI_ACTION = "MULTI_ACTION"
interface MultiActionAction {
    type: typeof MULTI_ACTION,
    payload: {
        actions: Action[]
    }
}

export function MultiAction(actions: Action[]): MultiActionAction {
    return {
        type: MULTI_ACTION,
        payload: {
            actions
        }
    }
}
