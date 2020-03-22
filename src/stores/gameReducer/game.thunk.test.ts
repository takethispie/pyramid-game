import { GameStep } from './game.state'
import {
    ThunkChooseTarget,
    ThunkAccuse,
    ThunkAcceptToDrink,
    ThunkDrink,
    ThunkAdmitToLying,
    ThunkProveNotToLie
} from './game.thunk'
import configureMockStore, { MockStore } from 'redux-mock-store'
import thunk from 'redux-thunk'
import {
    GameAddTarget,
    GameRemoveTarget,
    GameSetStep,
    GameAddAccusation,
    GameAddSips,
    GAME_SET_STEP,
    GameAddDoneDrinking,
    GameResetDoneDrinking,
    GameRemoveAccusation
} from './game.actions'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

// TODO: a player can choose not to target anyone
describe('given a game in the target choosing step', () => {

    let store: MockStore

    beforeEach(() => {
        store = mockStore({
            gameReducer: {
                CurrentStep: GameStep.ChooseTarget
                , Players: new Set(['player1', 'player2', 'player3'])
            }
        })
    })

    describe('but there is more than one player that did not choose its target', () => {

        beforeEach(() => {
            store = mockStore({
                gameReducer: {
                    ...store.getState().gameReducer
                    , Targets: {}
                }
            })
        })

        describe('when a player chooses its target', () => {

            beforeEach(() => {
                ThunkChooseTarget('player1', 'player2')(store.dispatch, store.getState, null)
            })

            it('then the target is added to the target list', () => {
                expect(store.getActions()).toContainEqual(GameAddTarget('player1', 'player2'))
            })

            it('then the game remains in the target choosing step', () => {
                expect(store.getActions().filter(action => action.type == GAME_SET_STEP)).toEqual([])
            })
        })

    })

    describe('but there is only one player left that did not choose its target', () => {

        beforeEach(() => {
            store = mockStore({
                gameReducer: {
                    ...store.getState().gameReducer
                    , Targets: {
                        'player2': 'player3',
                        'player3': 'player2',
                    }
                }
            })
        })

        describe('when the player chooses its target', () => {

            beforeEach(() => {
                ThunkChooseTarget('player1', 'player2')(store.dispatch, store.getState, null)
            })

            it('then the game moves to the accuse step', () => {
                expect(store.getActions()).toContainEqual(GameSetStep(GameStep.Accuse))
            })
        })

    })
})

describe('given a game in the accuse step', () => {

    let store: MockStore

    beforeEach(() => {
        store = mockStore({
            gameReducer: {
                CurrentStep: GameStep.ChooseTarget
                , Players: new Set(['player1', 'player2', 'player3'])
            }
        })
    })

    describe('but there is more than one player that is still targeted', () => {

        beforeEach(() => {
            store = mockStore({
                gameReducer: {
                    ...store.getState().gameReducer
                    , Targets: {
                        'player1': 'player2',
                        'player2': 'player3',
                        'player3': 'player2'
                    }
                }
            })
        })

        describe('when a player accuses another player of lying', () => {

            beforeEach(() => {
                ThunkAccuse('player1', 'player2')(store.dispatch, store.getState, null)
            })

            it('then the accusation is added to the accusation list', () => {
                expect(store.getActions()).toContainEqual(GameAddAccusation('player1', 'player2'))
            })

            it('then the target is removed from the target list', () => {
                expect(store.getActions()).toContainEqual(GameRemoveTarget('player1'))
            })
        })

        describe('when a player acusses another player of lying, but the other player did not target the accuser', () => {

            beforeEach(() => {
                ThunkAccuse('player2', 'player1')(store.dispatch, store.getState, null)
            })

            it('then nothing happens', () => {
                expect(store.getActions()).toEqual([])
            })
        })

        describe('when a targeted player chooses to drink', () => {

            beforeEach(() => {
                ThunkAcceptToDrink('player1', 'player2')(store.dispatch, store.getState, null)
            })

            it('the number of sips of the player is incremented', () => {
                expect(store.getActions()).toContainEqual(GameAddSips('player2', 1))
            })

            it('then the target is removed from the target list', () => {
                expect(store.getActions()).toContainEqual(GameRemoveTarget('player1'))
            })
        })

        describe('when a player chooses to drink, but the other player did not target the player', () => {

            beforeEach(() => {
                ThunkAcceptToDrink('player2', 'player1')(store.dispatch, store.getState, null)
            })

            it('then nothing happens', () => {
                expect(store.getActions()).toEqual([])
            })
        })
    })

    describe('but only one targeted player is remaining', () => {

        beforeEach(() => {
            store = mockStore({
                gameReducer: {
                    ...store.getState().gameReducer
                    , Targets: {
                        'player2': 'player3'
                    }
                    , Accusations: {
                        'player2': 'player1',
                        'player3': 'player2'
                    }
                }
            })
        })

        describe('when the player accuses another player of lying', () => {

            beforeEach(() => {
                ThunkAccuse('player2', 'player3')(store.dispatch, store.getState, null)
            })

            it('then the game moves to the denying step', () => {
                expect(store.getActions()).toContainEqual(GameSetStep(GameStep.Deny))
            })
        })
    })

    describe('but only one targeted player is remaining and the other choose to drink', () => {

        beforeEach(() => {
            store = mockStore({
                gameReducer: {
                    ...store.getState().gameReducer
                    , Targets: {
                        'player2': 'player3'
                    }
                    , Accusations: {}
                }
            })
        })

        describe('when the player chooses to drink', () => {

            beforeEach(() => {
                ThunkAcceptToDrink('player2', 'player3')(store.dispatch, store.getState, null)
            })

            it('then the game moves to the drinking step', () => {
                expect(store.getActions()).toContainEqual(GameSetStep(GameStep.Drink))
            })
        })
    })

    describe('but only one targeted player is remaining and there exist an accusation', () => {

        beforeEach(() => {
            store = mockStore({
                gameReducer: {
                    ...store.getState().gameReducer
                    , Targets: {
                        'player3': 'player2'
                    }
                    , Accusations: {
                        'player2': 'player3'
                    }
                }
            })
        })

        describe('when the player chooses to drink', () => {

            beforeEach(() => {
                ThunkAcceptToDrink('player3', 'player2')(store.dispatch, store.getState, null)
            })

            it('then the game moves to the denying step', () => {
                expect(store.getActions()).toContainEqual(GameSetStep(GameStep.Deny))
            })
        })
    })
})

describe('given a game in the deny step', () => {

    let store: MockStore

    beforeEach(() => {
        store = mockStore({
            gameReducer: {
                CurrentStep: GameStep.Deny
                , Players: new Set([
                    'accuser1'
                    , 'accused1'
                    , 'accuser2'
                    , 'accused2'
                    , 'non-accused'
                    , 'non-accuser'
                ])
            }
        })
    })

    describe('but there are more that one accusation pending', () => {

        beforeEach(() => {
            store = mockStore({
                gameReducer: {
                    ...store.getState().gameReducer
                    , Accusations: {
                        'accused1': 'accuser1',
                        'accused2': 'accuser2',
                    }
                }
            })
        })

        describe('when an accused player proves not to lie', () => {

            beforeEach(() => {
                ThunkProveNotToLie('accused1', 'accuser1')(store.dispatch, store.getState, null)
            })

            it('then the accuser receives twice the sips', () => {
                expect(store.getActions()).toContainEqual(GameAddSips('accuser1', 2))
            })

            it('then the accusation is removed from the list of accusations', () => {
                expect(store.getActions()).toContainEqual(GameRemoveAccusation('accused1'))
            })

            it('then the game remains in the deny step', () => {
                expect(store.getActions().filter(action => action.type == GAME_SET_STEP)).toEqual([])
            })
        })

        describe('when an accused player admits to lying', () => {

            beforeEach(() => {
                ThunkAdmitToLying('accused1', 'accuser1')(store.dispatch, store.getState, null)
            })

            it('then the accused player receives twice the sips', () => {
                expect(store.getActions()).toContainEqual(GameAddSips('accused1', 2))
            })

            it('then the accusation is removed from the list of accusations', () => {
                expect(store.getActions()).toContainEqual(GameRemoveAccusation('accused1'))
            })

            it('then the game remains in the deny step', () => {
                expect(store.getActions().filter(action => action.type == GAME_SET_STEP)).toEqual([])
            })
        })

        describe('when a non-accused player tries to prove not lying', () => {

            beforeEach(() => {
                ThunkProveNotToLie('non-accused', 'non-accuser')(store.dispatch, store.getState, null)
            })

            it('then nothing happens', () => {
                expect(store.getActions()).toEqual([])
            })
        })

        describe('when a non-accused player tries to admit to lying', () => {

            beforeEach(() => {
                ThunkAdmitToLying('non-accused', 'non-accuser')(store.dispatch, store.getState, null)
            })

            it('then nothing happens', () => {
                expect(store.getActions()).toEqual([])
            })
        })
    })

    describe('but there only one accusation pending', () => {

        beforeEach(() => {
            store = mockStore({
                gameReducer: {
                    ...store.getState().gameReducer
                    , Accusations: {
                        'accused1': 'accuser1'
                    }
                }
            })
        })

        describe('when the accused player proves not to lie', () => {

            beforeEach(() => {
                ThunkProveNotToLie('accused1', 'accuser1')(store.dispatch, store.getState, null)
            })

            it('then the accuser receives twice the sips', () => {
                expect(store.getActions()).toContainEqual(GameAddSips('accuser1', 2))
            })

            it('then the accusation is removed from the list of accusations', () => {
                expect(store.getActions()).toContainEqual(GameRemoveAccusation('accused1'))
            })

            it('then the game moves to the drinking step', () => {
                expect(store.getActions()).toContainEqual(GameSetStep(GameStep.Drink))
            })
        })

        describe('when the accused player admits to lying', () => {

            beforeEach(() => {
                ThunkAdmitToLying('accused1', 'accuser1')(store.dispatch, store.getState, null)
            })

            it('then the accused player receives twice the sips', () => {
                expect(store.getActions()).toContainEqual(GameAddSips('accused1', 2))
            })

            it('then the accusation is removed from the list of accusations', () => {
                expect(store.getActions()).toContainEqual(GameRemoveAccusation('accused1'))
            })

            it('then the game moves to the drinking step', () => {
                expect(store.getActions()).toContainEqual(GameSetStep(GameStep.Drink))
            })
        })

        describe('when a non-accused player tries to prove not lying', () => {

            beforeEach(() => {
                ThunkProveNotToLie('non-accused', 'non-accuser')(store.dispatch, store.getState, null)
            })

            it('then nothing happens', () => {
                expect(store.getActions()).toEqual([])
            })
        })

        describe('when a non-accused player tries to admit to lying', () => {

            beforeEach(() => {
                ThunkAdmitToLying('non-accused', 'non-accuser')(store.dispatch, store.getState, null)
            })

            it('then nothing happens', () => {
                expect(store.getActions()).toEqual([])
            })
        })
    })
})

describe('given a game in the drinking step', () => {

    let store: MockStore

    beforeEach(() => {
        store = mockStore({
            gameReducer: {
                CurrentStep: GameStep.Drink
                , Players: new Set(['player1', 'player2', 'player3'])
            }
        })
    })

    describe('but there is more than one player who has not yet drunk', () => {

        beforeEach(() => {
            store = mockStore({
                gameReducer: {
                    ...store.getState().gameReducer
                    , DoneDrinking: new Set
                }
            })
        })

        describe('when a player drinks', () => {

            beforeEach(() => {
                ThunkDrink('player1')(store.dispatch, store.getState, null)
            })

            it('then the game remains in the drinking step', () => {
                expect(store.getActions().filter(action => action.type == GAME_SET_STEP)).toEqual([])
            })

            it('the player who drank is added the to list of player done drinking', () => {
                expect(store.getActions()).toContainEqual(GameAddDoneDrinking('player1'))
            })
        })
    })

    describe('but there is only one player who has not yet drunk', () => {

        beforeEach(() => {
            store = mockStore({
                gameReducer: {
                    ...store.getState().gameReducer
                    , DoneDrinking: new Set(['player2', 'player3'])
                }
            })
        })

        describe('when the last player drinks', () => {

            beforeEach(() => {
                ThunkDrink('player1')(store.dispatch, store.getState, null)
            })

            it('the game moves to the target choosing step', () => {
                expect(store.getActions()).toContainEqual(GameSetStep(GameStep.ChooseTarget))
            })

            it('the list of player done drinking is reseted', () => {
                expect(store.getActions()).toContainEqual(GameResetDoneDrinking())
            })
        })
    })

    // TODO: last player with non-zero sips remaining
    // TODO: drinking removes resets the sips
})

// TODO:
// given a game in the accuse step
// but the current card is in the second row
// when a player chooses to drink
// when a targeted player chooses to drink
// then number of sips of the player is incremented twice
