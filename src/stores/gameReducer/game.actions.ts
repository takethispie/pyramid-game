export const GAME_CHOOSE_TARGET = "GAME_CHOOSE_TARGET"
export const GAME_ACCUSE = "GAME_ACCUSE"
export const GAME_ACCEPT_TO_DRINK = "GAME_ACCEPT_TO_DRINK"
export const GAME_DRINK = "GAME_DRINK"

interface GameChooseTargetAction {
    type: typeof GAME_CHOOSE_TARGET,
    payload: {
        playerWhoChooses: string,
        targetedPlayer: string
    }
}

interface GameAccuseAction {
    type: typeof GAME_ACCUSE,
    payload: {
        playerWhoAccuses: string,
        accusedPlayer: string
    }
}

interface GameAcceptToDrinkAction {
    type: typeof GAME_ACCEPT_TO_DRINK,
    payload: {
        playerWhoAccepts: string,
        playerWhoTargets: string
    }
}

interface GameDrinkAction {
    type: typeof GAME_DRINK,
    payload: {
        player: string
    }
}

export type GameActionsTypes
    = GameChooseTargetAction
    | GameAccuseAction
    | GameAcceptToDrinkAction
    | GameDrinkAction

export function GameChooseTarget(playerWhoChooses: string, targetedPlayer: string): GameChooseTargetAction {
    return {
        type: GAME_CHOOSE_TARGET,
        payload: {
            playerWhoChooses,
            targetedPlayer
        }
    }
}

export function GameAccuse(playerWhoAccuses: string, accusedPlayer: string): GameAccuseAction {
    return {
        type: GAME_ACCUSE,
        payload: {
            playerWhoAccuses,
            accusedPlayer
        }
    }
}

export function GameAcceptToDrink(playerWhoAccepts: string, playerWhoTargets: string): GameAcceptToDrinkAction {
    return {
        type: GAME_ACCEPT_TO_DRINK,
        payload: {
            playerWhoAccepts,
            playerWhoTargets
        }
    }
}

export function GameDrink(player: string): GameDrinkAction {
    return {
        type: GAME_DRINK,
        payload: {
            player: player
        }
    }
}