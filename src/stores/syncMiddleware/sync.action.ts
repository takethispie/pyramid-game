import { Action } from "redux"

export const SYNC = 'SYNC'
export interface SyncAction {
    type: typeof SYNC,
    payload: {
        action: Action
    }
}

export function Sync(action: Action): SyncAction {
    return {
        type: SYNC,
        payload: {
            action
        }
    }
}
