export const MATCH_CONNECT = "CONNECT";
export const MATCH_CONNECT_SUCCESS = "MATCH_CONNECT_SUCCESS";
export const MATCH_CONNECT_ERROR = "MATCH_CONNECT_ERROR";

interface MatchConnect {
    type: typeof MATCH_CONNECT,
    payload: {
        id: string,
        nickname: string
    }
}

interface MatchConnectSuccess {
    type: typeof MATCH_CONNECT_SUCCESS,
    payload: {
        id: string
    }
}

interface MatchConnectError {
    type: typeof MATCH_CONNECT_ERROR,
    payload: {
        errorMessage: string
    }
}

export type MatchActionsTypes = MatchConnect | MatchConnectSuccess | MatchConnectError;

export function ConnectMatch(id: string, nickname: string): MatchActionsTypes {
    return {
        type: MATCH_CONNECT,
        payload: {
            id,
            nickname
        }
    }
} 

export function ConnectMatchSuccess(id: string): MatchActionsTypes {
    return {
        type: MATCH_CONNECT_SUCCESS,
        payload: {
            id
        }
    }
}


export function ConnectMatchError(errorMessage: string): MatchActionsTypes {
    return {
        type: MATCH_CONNECT_ERROR,
        payload: {
            errorMessage
        }
    }
}