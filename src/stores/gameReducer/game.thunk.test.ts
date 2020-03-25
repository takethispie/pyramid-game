import { GameStep } from './game.state'
import {
    ThunkChooseTarget,
    ThunkAccuse,
    ThunkAcceptToDrink,
    ThunkDrink,
    ThunkAdmitToLying,
    ThunkProveNotToLie,
    ThunkJoinGame
} from './game.thunk'
import configureMockStore, { MockStore } from 'redux-mock-store'
import thunk from 'redux-thunk'
import {
    GameAddTarget,
    GameRemoveTarget,
    GameAddAccusation,
    GameAddSips,
    GameRemoveAccusation,
    GameResetSips,
    GAME_ADD_PLAYER
} from './game.actions'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

// TODO: a player can choose not to target anyone
describe('given a game in the target choosing step', () => {

    let store: MockStore

    beforeEach(() => {
        store = mockStore({
            gameReducer: {
                Players: new Set(['player1', 'player2', 'player3'])
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
        })

    })
})

describe('given a game in the accuse step', () => {

    let store: MockStore

    beforeEach(() => {
        store = mockStore({
            gameReducer: {
                Players: new Set(['player1', 'player2', 'player3'])
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
})

describe('given a game in the deny step', () => {

    let store: MockStore

    beforeEach(() => {
        store = mockStore({
            gameReducer: {
                Players: new Set([
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
                Players: new Set(['player1', 'player2', 'player3'])
            }
        })
    })

    describe('but there is more than one player who has not yet drunk', () => {

        beforeEach(() => {
            store = mockStore({
                gameReducer: {
                    ...store.getState().gameReducer
                    , Sips: {
                        'player1': 1
                        , 'player2': 1
                        , 'player3': 1
                    }
                }
            })
        })

        describe('when a player drinks', () => {

            beforeEach(() => {
                ThunkDrink('player1')(store.dispatch, store.getState, null)
            })

            it('the sips number of the player is reset', () => {
                expect(store.getActions()).toContainEqual(GameResetSips('player1'))
            })
        })
    })

    describe('but there is only one player who has not yet drunk', () => {

        beforeEach(() => {
            store = mockStore({
                gameReducer: {
                    ...store.getState().gameReducer
                    , Sips: {
                        'player1': 1
                        , 'player2': 0
                        , 'player3': 0
                    }
                }
            })
        })

        describe('when the last player drinks', () => {

            beforeEach(() => {
                ThunkDrink('player1')(store.dispatch, store.getState, null)
            })

            it('the sips number of the player is reset', () => {
                expect(store.getActions()).toContainEqual(GameResetSips('player1'))
            })
        })
    })

    describe('but there is only one player who has not yet drunk, but some sips are undefined', () => {

        beforeEach(() => {
            store = mockStore({
                gameReducer: {
                    ...store.getState().gameReducer
                    , Sips: {
                        'player1': 1
                    }
                }
            })
        })

        describe('when the last player drinks', () => {

            beforeEach(() => {
                ThunkDrink('player1')(store.dispatch, store.getState, null)
            })

            it('the sips number of the player is reset', () => {
                expect(store.getActions()).toContainEqual(GameResetSips('player1'))
            })
        })
    })
})

describe('the connect thunk', () => {
    let store: MockStore = mockStore({
        matchReducer: {
            NickName: "playerName"
        }
    })

    beforeEach(() => {
        ThunkJoinGame()(store.dispatch, store.getState, undefined)
    })

    it('adds a player to the players list', () => {
        expect(store.getActions().filter(action => action.type == GAME_ADD_PLAYER)).not.toEqual([])
    })

    it('uses the player name', () => {
        expect(store.getActions().filter(action => action.type == GAME_ADD_PLAYER)[0].payload.player).toEqual('playerName')
    })
})

// TODO:
// given a game in the accuse step
// but the current card is in the second row
// when a player chooses to drink
// when a targeted player chooses to drink
// then number of sips of the player is incremented twice
