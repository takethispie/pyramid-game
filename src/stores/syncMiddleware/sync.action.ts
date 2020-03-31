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

export const SYNC_RESET = 'SYNC_RESET'
export interface SyncResetAction {
    type: typeof SYNC_RESET,
    payload: {}
}

export function SyncReset(): SyncResetAction {
    return {
        type: SYNC_RESET,
        payload: {}
    }
}
