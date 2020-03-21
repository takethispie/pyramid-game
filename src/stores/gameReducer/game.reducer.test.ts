import { GameStep, GameState } from './game.state'
import {
    GameAddTarget,
    GameRemoveTarget,
    GameSetStep,
    GameAddAccusation,
    GameAddSips,
    GameAddDoneDrinking,
    GameResetDoneDrinking,
    GameRemoveAccusation
} from './game.actions'
import GameReducer, { defaultGameState } from './game.reducer'

describe('when the game reducer receives a GAME_ADD_TARGET', () => {
    it('then it adds a target to the target list', () => {
        expect(
            GameReducer({
                ...defaultGameState
                , Targets: {}
            }, GameAddTarget('playerWhoTargets', 'targetedPlayer'))
        ).toEqual({
            ...defaultGameState
            , Targets: {
                'playerWhoTargets': 'targetedPlayer'
            }
        })
    })
})

describe('when the game reducer receives a GAME_REMOVE_TARGET', () => {
    it('then it removes the target from the target list', () => {
        expect(
            GameReducer({
                ...defaultGameState
                , Targets: {
                    'playerWhoTargets': 'targetedPlayer'
                }
            }, GameRemoveTarget('playerWhoTargets'))
        ).toEqual({
            ...defaultGameState
            , Targets: {}
        })
    })
})

describe('when the game reducer receives a GAME_SET_STEP', () => {
    it('then it sets the step', () => {
        expect(
            GameReducer({
                ...defaultGameState
                , CurrentStep: GameStep.ChooseTarget
            }, GameSetStep(GameStep.Accuse))
        ).toEqual({
            ...defaultGameState
            , CurrentStep: GameStep.Accuse
        })
    })
})

describe('when the game reducer receives a GAME_ADD_ACCUSATION', () => {
    it('then it adds an accusation to the accusation list', () => {
        expect(
            GameReducer({
                ...defaultGameState
                , Accusations: {}
            }, GameAddAccusation('accusedPlayer', 'playerWhoAccuses'))
        ).toEqual({
            ...defaultGameState
            , Accusations: {
                'accusedPlayer': 'playerWhoAccuses'
            }
        })
    })
})

describe('when the game reducer receives two GAME_ADD_ACCUSATION with the same accuser', () => {

    let state: GameState

    beforeEach(() => {
        state = {
            ...defaultGameState
            , Accusations: {}
        }
        state = GameReducer(state, GameAddAccusation('accusedPlayer1', 'playerWhoAccuses'))
        state = GameReducer(state, GameAddAccusation('accusedPlayer2', 'playerWhoAccuses'))
    })

    it('then it adds both accusations to the accusation list', () => {
        expect(
            state
        ).toEqual({
            ...defaultGameState
            , Accusations: {
                'accusedPlayer1': 'playerWhoAccuses'
                , 'accusedPlayer2': 'playerWhoAccuses'
            }
        })
    })
})

describe('when the game reducer receives a GAME_REMOVE_ACCUSATION', () => {
    it('then it removes the accusation from the accusation list', () => {
        expect(
            GameReducer({
                ...defaultGameState
                , Accusations: {
                    'accusedPlayer': 'playerWhoAccuses'
                }
            }, GameRemoveAccusation('accusedPlayer'))
        ).toEqual({
            ...defaultGameState
            , Accusations: {}
        })
    })
})

describe('given a player that has 0 sips', () => {
    describe('when the game reducer receives a GAME_ADD_SIPS', () => {
        it('then it increments the sips number of a player', () => {
            expect(
                GameReducer({
                    ...defaultGameState
                    , Sips: {
                        'player': 0
                    }
                }, GameAddSips('player', 3))
            ).toEqual({
                ...defaultGameState
                , Sips: {
                    'player': 3
                }
            })
        })
    })
})

describe('given a player that has some sips', () => {
    describe('when the game reducer receives a GAME_ADD_SIPS', () => {
        it('then it increments the sips number of a player', () => {
            expect(
                GameReducer({
                    ...defaultGameState
                    , Sips: {
                        'player': 2
                    }
                }, GameAddSips('player', 3))
            ).toEqual({
                ...defaultGameState
                , Sips: {
                    'player': 5
                }
            })
        })
    })
})

describe('given status that does not have a player in its sips dictionary', () => {
    describe('when the game reducer receives a GAME_ADD_SIPS', () => {
        it('then it creates the player in the sips dictionary', () => {
            expect(
                GameReducer({
                    ...defaultGameState
                    , Sips: {}
                }, GameAddSips('player', 1))
            ).toEqual({
                ...defaultGameState
                , Sips: {
                    'player': 1
                }
            })
        })
    })
})

describe('when the game reducer receives a GAME_ADD_DONE_DRINKING', () => {
    it('then it adds the player to the done drinking list', () => {
        expect(
            GameReducer({
                ...defaultGameState
                , DoneDrinking: new Set
            }, GameAddDoneDrinking('player'))
        ).toEqual({
            ...defaultGameState
            , DoneDrinking: new Set(['player'])
        })
    })
})

describe('when the game reducer receives a GAME_RESET_DONE_DRINKING', () => {
    it('then it resets the done drinking list', () => {
        expect(
            GameReducer({
                ...defaultGameState
                , DoneDrinking: new Set(['player1', 'player2'])
            }, GameResetDoneDrinking())
        ).toEqual({
            ...defaultGameState
            , DoneDrinking: new Set
        })
    })
})
