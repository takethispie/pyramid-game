export enum GameStep {
    ChooseTarget = 'ChooseTarget',
    Accuse = 'Accuse',
    Deny = 'Deny',
    Drink = 'Drink'
}

export interface GameState {
    Players: Set<string>
    , Targets: { [id: string]: string }
    , Accusations: { [id: string]: string }
    , Sips: { [id: string]: number }
    , KeepAlive: { [id: string]: Date }
}

export const KEEPALIVE_TIMEOUT_MS = 10000

function allSipsAreZero(game: GameState): boolean {
    return Object.keys(game.Sips).every(player => game.Sips[player] === 0)
}

function targetsIsEmpty(game: GameState): boolean {
    return Object.keys(game.Targets).length === 0
}

function targetsIsFull(game: GameState): boolean {
    return [...game.Players].every(player => game.Targets[player] !== undefined)
}

function targetsIsPartial(game: GameState): boolean {
    return !targetsIsEmpty(game) && !targetsIsFull(game)
}

function accusationsIsEmpty(game: GameState): boolean {
    return Object.keys(game.Accusations).length === 0
}

export function getStep(game: GameState): GameStep | undefined {
    const targetsEmpty = targetsIsEmpty(game)
    const targetsPartial = targetsIsPartial(game)
    const targetsFull = targetsIsFull(game)
    const accusationsEmpty = accusationsIsEmpty(game)
    const allSipsZero = allSipsAreZero(game)
    if (!targetsFull && accusationsEmpty && allSipsZero) {
        return GameStep.ChooseTarget
    } else if ((targetsPartial && (!accusationsEmpty || !allSipsZero)) || (targetsFull && accusationsEmpty && allSipsZero)) {
        return GameStep.Accuse
    } else if (targetsEmpty && !accusationsEmpty) {
        return GameStep.Deny
    } else if (targetsEmpty && accusationsEmpty && !allSipsZero) {
        return GameStep.Drink
    } else {
        return undefined
    }
}
