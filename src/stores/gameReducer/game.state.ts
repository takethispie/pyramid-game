export enum GameStep {
    ChooseTarget = 'ChooseTarget',
    Accuse = 'Accuse',
    Deny = 'Deny',
    Drink = 'Drink'
}

export interface GameState {
    CurrentStep: GameStep,
    Players: Set<string>,
    Targets: { [id: string]: string },
    Accusations: { [id: string]: string },
    Sips: { [id: string]: number }
}