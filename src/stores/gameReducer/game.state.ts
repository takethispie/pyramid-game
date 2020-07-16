export enum GameStep {
    ChooseTarget = 'ChooseTarget',
    Accuse = 'Accuse',
    Deny = 'Deny',
    Drink = 'Drink'
}

export interface GameState {
    Players: string[],
    Sips: { [id: string]: number }
}

export const KEEPALIVE_TIMEOUT_MS = 10000



export function getStep(game: GameState): GameStep {
    return GameStep.ChooseTarget;
    throw new Error("Erreur état de jeu inconnu");
}
