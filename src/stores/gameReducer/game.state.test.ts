import { defaultGameState } from "./game.reducer";
import { GameStep, getStep } from "./game.state";

describe('the getStep function', () => {
    const gameState = {
        ...defaultGameState
        , Players: new Set(['player1', 'player2', 'player3'])
    }

    const emptyTargets = {}
    const partialTargets = {
        'player1': 'player2'
        , 'player2': 'player3'
    }
    const fullTargets = {
        'player1': 'player2'
        , 'player2': 'player3'
        , 'player3': 'player1'
    }

    const emptyAccusations = {}
    const notEmptyAccusations = {
        'player1': 'player2'
    }

    const allZeroSips = {
        'player1': 0
        , 'player2': 0
        , 'player3': 0
    }
    const notAllZeroSips = {
        'player1': 0
        , 'player2': 3
        , 'player3': 0
    }

    const combinations = [
        {
            state: { ...gameState, Targets: emptyTargets, Accusations: emptyAccusations, Sips: allZeroSips },
            expectedStep: GameStep.ChooseTarget
        }
        , {
            state: { ...gameState, Targets: emptyTargets, Accusations: emptyAccusations, Sips: notAllZeroSips },
            expectedStep: GameStep.Drink
        }
        , {
            state: { ...gameState, Targets: emptyTargets, Accusations: notEmptyAccusations, Sips: allZeroSips },
            expectedStep: GameStep.Deny
        }
        , {
            state: { ...gameState, Targets: emptyTargets, Accusations: notEmptyAccusations, Sips: notAllZeroSips },
            expectedStep: GameStep.Deny
        }
        , {
            state: { ...gameState, Targets: partialTargets, Accusations: emptyAccusations, Sips: allZeroSips },
            expectedStep: GameStep.ChooseTarget
        }
        , {
            state: { ...gameState, Targets: partialTargets, Accusations: emptyAccusations, Sips: notAllZeroSips },
            expectedStep: GameStep.Accuse
        }
        , {
            state: { ...gameState, Targets: partialTargets, Accusations: notEmptyAccusations, Sips: allZeroSips },
            expectedStep: GameStep.Accuse
        }
        , {
            state: { ...gameState, Targets: partialTargets, Accusations: notEmptyAccusations, Sips: notAllZeroSips },
            expectedStep: GameStep.Accuse
        }
        , {
            state: { ...gameState, Targets: fullTargets, Accusations: emptyAccusations, Sips: allZeroSips },
            expectedStep: GameStep.Accuse
        }
        , {
            state: { ...gameState, Targets: fullTargets, Accusations: emptyAccusations, Sips: notAllZeroSips },
            expectedStep: undefined
        }
        , {
            state: { ...gameState, Targets: fullTargets, Accusations: notEmptyAccusations, Sips: allZeroSips },
            expectedStep: undefined
        }
        , {
            state: { ...gameState, Targets: fullTargets, Accusations: notEmptyAccusations, Sips: notAllZeroSips },
            expectedStep: undefined
        }
    ]

    for (const combination of combinations) {
        const state = combination.state
        const expectedStep = combination.expectedStep
        let description = 'given a game state, but with '
        if (state.Targets === emptyTargets) {
            description += 'empty targets'
        } else if (state.Targets === partialTargets) {
            description += 'partial targets'
        } else if (state.Targets === fullTargets) {
            description += 'full targets'
        } else {
            description += '???'
        }
        description += ', '
        if (state.Accusations === emptyAccusations) {
            description += 'empty accusations'
        } else if (state.Accusations === notEmptyAccusations) {
            description += 'partial accusations'
        } else {
            description += '???'
        }
        description += ' and '
        if (state.Sips === allZeroSips) {
            description += 'all sips being zero'
        } else if (state.Sips === notAllZeroSips) {
            description += 'some sips being greater than zero'
        } else {
            description += '???'
        }
        let expectation = 'then the getStep function sould return '
        switch (expectedStep) {
            case GameStep.Accuse:
                expectation += 'GameStep.Accuse'
                break
            case GameStep.ChooseTarget:
                expectation += 'GameStep.ChooseTarget'
                break
            case GameStep.Deny:
                expectation += 'GameStep.Deny'
                break
            case GameStep.Drink:
                expectation += 'GameStep.Drink'
                break
            case undefined:
                expectation += 'undefined'
                break
        }
        describe(description, () => {
            it(expectation, () => {
                expect(getStep(state)).toBe(expectedStep)
            })
        })
    }
})