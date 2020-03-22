import { GameStep } from './game.state'
import {
    ThunkChooseTarget,
    ThunkAccuse,
    ThunkAcceptToDrink,
    ThunkDrink,
    ThunkAdmitToLying,
    ThunkProveNotLying as ThunkProveNotToLie
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
            CurrentStep: GameStep.ChooseTarget
            , Players: new Set(['player1', 'player2', 'player3'])
        })
    })

    describe('when a player chooses its target (not the last one)', () => {

        beforeEach(() => {
            store = mockStore({
                ...store.getState()
                , Targets: {}
            })
            ThunkChooseTarget('player1', 'player2')(store.dispatch, store.getState, null)
        })

        it('then the target is added to the target list', () => {
            expect(store.getActions()).toContainEqual(GameAddTarget('player1', 'player2'))
        })

        it('then the game remains in the target choosing step', () => {
            expect(store.getActions().filter(action => action.type == GAME_SET_STEP)).toEqual([])
        })
    })

    describe('when the last player chooses its target', () => {

        beforeEach(() => {
            store = mockStore({
                ...store.getState()
                , Targets: {
                    'player2': 'player3',
                    'player3': 'player2',
                }
            })
            ThunkChooseTarget('player1', 'player2')(store.dispatch, store.getState, null)
        })

        it('then the game moves to the accuse step', () => {
            expect(store.getActions()).toContainEqual(GameSetStep(GameStep.Accuse))
        })
    })
})

describe('given a game in the accuse step', () => {

    let store: MockStore

    beforeEach(() => {
        store = mockStore({
            CurrentStep: GameStep.ChooseTarget
            , Players: new Set(['player1', 'player2', 'player3'])
            , Targets: {
                'player1': 'player2',
                'player2': 'player3',
                'player3': 'player2'
            }
        })
    })

    describe('when a player accuses another player of lying', () => {

        beforeEach(() => {
            ThunkAccuse('player2', 'player1')(store.dispatch, store.getState, null)
        })

        it('then the accusation is added to the accusation list', () => {
            expect(store.getActions()).toContainEqual(GameAddAccusation('player2', 'player1'))
        })

        it('then the target is removed from the target list', () => {
            expect(store.getActions()).toContainEqual(GameRemoveTarget('player1'))
        })
    })

    describe('when a player acusses another player of lying, but the other player did not target the accuser', () => {

        beforeEach(() => {
            ThunkAccuse('player1', 'player2')(store.dispatch, store.getState, null)
        })

        it('then nothing happens', () => {
            expect(store.getActions()).toEqual([])
        })
    })

    describe('when a targeted player chooses to drink', () => {

        beforeEach(() => {
            ThunkAcceptToDrink('player2', 'player1')(store.dispatch, store.getState, null)
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
            ThunkAcceptToDrink('player1', 'player2')(store.dispatch, store.getState, null)
        })

        it('then nothing happens', () => {
            expect(store.getActions()).toEqual([])
        })
    })

    describe('when the last player accuses another player of lying', () => {

        beforeEach(() => {
            store = mockStore({
                ...store.getState()
                , Targets: {
                    'player2': 'player3'
                }
                , Accusations: {
                    'player2': 'player1',
                    'player3': 'player2'
                }
            })
            ThunkAccuse('player3', 'player2')(store.dispatch, store.getState, null)
        })

        it('then the game moves to the denying step', () => {
            expect(store.getActions()).toContainEqual(GameSetStep(GameStep.Deny))
        })
    })

    describe('when all players choose to drink', () => {

        beforeEach(() => {
            store = mockStore({
                ...store.getState()
                , Targets: {
                    'player2': 'player3'
                }
                , Accusations: {}
            })
            ThunkAcceptToDrink('player3', 'player2')(store.dispatch, store.getState, null)
        })

        it('then the game moves to the drinking step', () => {
            expect(store.getActions()).toContainEqual(GameSetStep(GameStep.Drink))
        })
    })

    describe('when the last player chooses to drink but another player accused someone', () => {

        beforeEach(() => {
            store = mockStore({
                ...store.getState()
                , Targets: {
                    'player3': 'player2'
                }
                , Accusations: {
                    'player3': 'player2'
                }
            })
            ThunkAcceptToDrink('player2', 'player3')(store.dispatch, store.getState, null)
        })

        it('then the game moves to the denying step', () => {
            expect(store.getActions()).toContainEqual(GameSetStep(GameStep.Deny))
        })
    })
})

describe('given a game in the deny step', () => {

    let store: MockStore

    beforeEach(() => {
        store = mockStore({
            CurrentStep: GameStep.Deny
            , Players: new Set([
                'accuser1'
                , 'accused1'
                , 'accuser2'
                , 'accused2'
                , 'non-accused'
                , 'non-accuser'
            ])
        })
    })

    describe('but there are more that one accusation pending', () => {

        beforeEach(() => {
            store = mockStore({
                ...store.getState()
                , Accusations: {
                    'accuser1': 'accused1',
                    'accuser2': 'accused2',
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
                expect(store.getActions()).toContainEqual(GameRemoveAccusation('accuser1'))
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
                expect(store.getActions()).toContainEqual(GameRemoveAccusation('accuser1'))
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
                ...store.getState()
                , Accusations: {
                    'accuser1': 'accused1'
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
                expect(store.getActions()).toContainEqual(GameRemoveAccusation('accuser1'))
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
                expect(store.getActions()).toContainEqual(GameRemoveAccusation('accuser1'))
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
            CurrentStep: GameStep.Drink
            , Players: new Set(['player1', 'player2', 'player3'])
            , DoneDrinking: new Set
        })
    })

    describe('when a player drinks (not the last one)', () => {

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

    describe('when the last player drinks', () => {

        beforeEach(() => {
            store = mockStore({
                ...store.getState()
                , DoneDrinking: new Set(['player2', 'player3'])
            })
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

// TODO:
// given a game in the accuse step
// but the current card is in the second row
// when a player chooses to drink
// when a targeted player chooses to drink
// then number of sips of the player is incremented twice
