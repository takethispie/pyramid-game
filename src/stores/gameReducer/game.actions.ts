import { GameStep } from "./game.state"

// ----- GAME_ADD_TARGET -----

export const GAME_ADD_TARGET = "GAME_ADD_TARGET"
interface GameAddTargetAction {
    type: typeof GAME_ADD_TARGET,
    payload: {
        playerWhoTargets: string,
        targetedPlayer: string
    }
}

export function GameAddTarget(
    playerWhoTargets: string,
    targetedPlayer: string
): GameAddTargetAction {
    return {
        type: GAME_ADD_TARGET,
        payload: {
            playerWhoTargets,
            targetedPlayer
        }
    }
}

// ----- GAME_REMOVE_TARGET -----

export const GAME_REMOVE_TARGET = "GAME_REMOVE_TARGET"
interface GameRemoveTargetAction {
    type: typeof GAME_REMOVE_TARGET,
    payload: {
        playerWhoTargets: string
    }
}

export function GameRemoveTarget(
    playerWhoTargets: string
): GameRemoveTargetAction {
    return {
        type: GAME_REMOVE_TARGET,
        payload: {
            playerWhoTargets
        }
    }
}

// ----- GAME_SET_STEP -----

export const GAME_SET_STEP = "GAME_SET_STEP"
interface GameSetStepAction {
    type: typeof GAME_SET_STEP,
    payload: {
        step: GameStep
    }
}

export function GameSetStep(
    step: GameStep
): GameSetStepAction {
    return {
        type: GAME_SET_STEP,
        payload: {
            step
        }
    }
}

// ----- GAME_ADD_ACCUSATION -----

export const GAME_ADD_ACCUSATION = "GAME_ADD_ACCUSATION"
interface GameAddAccusationAction {
    type: typeof GAME_ADD_ACCUSATION,
    payload: {
        playerWhoAccuses: string,
        accusedPlayer: string
    }
}

export function GameAddAccusation(accusedPlayer: string, playerWhoAccuses: string): GameAddAccusationAction {
    return {
        type: GAME_ADD_ACCUSATION,
        payload: {
            playerWhoAccuses,
            accusedPlayer
        }
    }
}

// ----- GAME_REMOVE_ACCUSATION -----

export const GAME_REMOVE_ACCUSATION = "GAME_REMOVE_ACCUSATION"
interface GameRemoveAccusationAction {
    type: typeof GAME_REMOVE_ACCUSATION,
    payload: {
        accusedPlayer: string
    }
}

export function GameRemoveAccusation(accusedPlayer: string): GameRemoveAccusationAction {
    return {
        type: GAME_REMOVE_ACCUSATION,
        payload: {
            accusedPlayer
        }
    }
}

// ----- GAME_ADD_SIPS -----

export const GAME_ADD_SIPS = "GAME_ADD_SIPS"
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

// ----- GAME_RESET_SIPS -----

export const GAME_RESET_SIPS = "GAME_RESET_SIPS"
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

// -----

export type GameActionsTypes
    = GameAddTargetAction
    | GameRemoveTargetAction
    | GameSetStepAction
    | GameAddAccusationAction
    | GameRemoveAccusationAction
    | GameAddSipsAction
    | GameResetSipsAction
