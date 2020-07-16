
// ----- GAME_ADD_PLAYER -----

export const GAME_ADD_PLAYER = "GAME_ADD_PLAYER"
export const GAME_REMOVE_PLAYER = "GAME_REMOVE_PLAYER"

export const GAME_TARGET = "GAME_TARGET"
export const GAME_REFUTE = "GAME_REFUTE"
export const GAME_RESET_SIPS = "GAME_RESET_SIPS"
export const GAME_ADD_SIPS = "GAME_ADD_SIPS"



interface GameAddPlayerAction {
    type: typeof GAME_ADD_PLAYER,
    payload: {
        player: string
    }
}

export function GameAddPlayer(
    player: string
): GameAddPlayerAction {
    return {
        type: GAME_ADD_PLAYER,
        payload: {
            player
        }
    }
}

// ----- GAME_REMOVE_PLAYER -----

interface GameRemovePlayerAction {
    type: typeof GAME_REMOVE_PLAYER,
    payload: {
        player: string
    }
}

export function GameRemovePlayer(
    player: string
): GameRemovePlayerAction {
    return {
        type: GAME_REMOVE_PLAYER,
        payload: {
            player
        }
    }
}


interface GameAddSipsAction {
    type: typeof GAME_ADD_SIPS,
    payload: {
        player: string,
        numberOfSips: number
    }
}

export function GameAddSips(player: string, numberOfSips: number): GameAddSipsAction {
    return {
        type: GAME_ADD_SIPS,
        payload: {
            player,
            numberOfSips
        }
    }
}

interface GameResetSipsAction {
    type: typeof GAME_RESET_SIPS,
    payload: {
        player: string
    }
}

export function GameResetSips(player: string): GameResetSipsAction {
    return {
        type: GAME_RESET_SIPS,
        payload: {
            player
        }
    }
}

export type GameActionsTypes
    = GameAddPlayerAction
    | GameRemovePlayerAction
    | GameAddSipsAction
    | GameResetSipsAction
