import { GameStep } from './game.state'
import {
    ThunkChooseTarget,
    ThunkAccuse,
    ThunkAcceptToDrink,
    ThunkDrink,
    ThunkAdmitToLying,
    ThunkProveNotToLie,
    ThunkJoinGame,
    ThunkLeaveGame
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
    GAME_ADD_PLAYER,
    GAME_REMOVE_PLAYER,
    GAME_KEEPALIVE,
    GameRemoveKeepAlive
} from './game.actions'
import { defaultRootState } from 'stores/root.reducer'
import { Action } from 'redux'

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
                expect(store.getActions()[0].payload.actions).toContainEqual(GameAddAccusation('player1', 'player2'))
            })

            it('then the target is removed from the target list', () => {
                expect(store.getActions()[0].payload.actions).toContainEqual(GameRemoveTarget('player1'))
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
                expect(store.getActions()[0].payload.actions).toContainEqual(GameAddSips('player2', 1))
            })

            it('then the target is removed from the target list', () => {
                expect(store.getActions()[0].payload.actions).toContainEqual(GameRemoveTarget('player1'))
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
                expect(store.getActions()[0].payload.actions).toContainEqual(GameAddSips('accuser1', 2))
            })

            it('then the accusation is removed from the list of accusations', () => {
                expect(store.getActions()[0].payload.actions).toContainEqual(GameRemoveAccusation('accused1'))
            })
        })

        describe('when an accused player admits to lying', () => {

            beforeEach(() => {
                ThunkAdmitToLying('accused1', 'accuser1')(store.dispatch, store.getState, null)
            })

            it('then the accused player receives twice the sips', () => {
                expect(store.getActions()[0].payload.actions).toContainEqual(GameAddSips('accused1', 2))
            })

            it('then the accusation is removed from the list of accusations', () => {
                expect(store.getActions()[0].payload.actions).toContainEqual(GameRemoveAccusation('accused1'))
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
                expect(store.getActions()[0].payload.actions).toContainEqual(GameAddSips('accuser1', 2))
            })

            it('then the accusation is removed from the list of accusations', () => {
                expect(store.getActions()[0].payload.actions).toContainEqual(GameRemoveAccusation('accused1'))
            })
        })

        describe('when the accused player admits to lying', () => {

            beforeEach(() => {
                ThunkAdmitToLying('accused1', 'accuser1')(store.dispatch, store.getState, null)
            })

            it('then the accused player receives twice the sips', () => {
                expect(store.getActions()[0].payload.actions).toContainEqual(GameAddSips('accused1', 2))
            })

            it('then the accusation is removed from the list of accusations', () => {
                expect(store.getActions()[0].payload.actions).toContainEqual(GameRemoveAccusation('accused1'))
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

describe('given a game that the player did not join yet', () => {
    let store: MockStore

    beforeEach(() => {
        store = mockStore({
            matchReducer: {
                NickName: "playerName"
            }
        })
    })

    describe('when the player joins the game', () => {
        beforeEach(() => {
            ThunkJoinGame()(store.dispatch, store.getState, undefined)
        })

        it('adds a player to the players list', () => {
            expect(store.getActions()[0].payload.actions.filter((action: Action) => action.type == GAME_ADD_PLAYER)).not.toEqual([])
        })

        it('uses the player\'s nickname', () => {
            expect(store.getActions()[0].payload.actions.filter((action: Action) => action.type == GAME_ADD_PLAYER)[0].payload.player).toEqual('playerName')
        })

        it('updates its keepalive timer', () => {
            expect(store.getActions()[0].payload.actions.filter((action: Action) => action.type == GAME_KEEPALIVE)).not.toEqual([])
        })
    })
})

describe('given a game that the player has already joined', () => {
    let store: MockStore
    const now = new Date

    beforeEach(() => {
        store = mockStore({
            ...defaultRootState
            , matchReducer: {
                ...defaultRootState.matchReducer
                , NickName: "player1"
            }
            , gameReducer: {
                ...defaultRootState.gameReducer
                , Players: new Set(['player1', 'player2', 'player3'])
                , Targets: {
                    'player1': 'player2'
                    , 'player2': 'player1'
                    , 'player3': 'player1'
                }
                , Accusations: {
                    'player1': 'player2'
                    , 'player2': 'player1'
                    , 'player3': 'player1'
                }
                , Sips: {
                    'player1': 1
                }
                , KeepAlive: {
                    'player1': now
                }
            }
        })
    })

    describe('when the player leaves the game', () => {

        beforeEach(() => {
            ThunkLeaveGame()(store.dispatch, store.getState, undefined)
        })

        it('then it removes the player from the players list', () => {
            expect(store.getActions()[0].payload.actions.filter((action: Action) => action.type == GAME_REMOVE_PLAYER)).not.toEqual([])
        })

        it('then it uses the player nickname', () => {
            expect(store.getActions()[0].payload.actions.filter((action: Action) => action.type == GAME_REMOVE_PLAYER)[0].payload.player).toEqual('player1')
        })

        it('then it removes the pending target', () => {
            expect(store.getActions()[0].payload.actions).toContainEqual(GameRemoveTarget('player1'))
        })

        it('then it removes all targets targetting the leaving player', () => {
            expect(store.getActions()[0].payload.actions).toContainEqual(GameRemoveTarget('player2'))
            expect(store.getActions()[0].payload.actions).toContainEqual(GameRemoveTarget('player3'))
        })

        it('then it removes the pending accusation', () => {
            expect(store.getActions()[0].payload.actions).toContainEqual(GameRemoveAccusation('player1'))
        })

        it('then it removes all targets targetting the leaving player', () => {
            expect(store.getActions()[0].payload.actions).toContainEqual(GameRemoveAccusation('player2'))
            expect(store.getActions()[0].payload.actions).toContainEqual(GameRemoveAccusation('player3'))
        })

        it('then it resets the player\'s sips', () => {
            expect(store.getActions()[0].payload.actions).toContainEqual(GameResetSips('player1'))
        })

        it('then it removes the player\'s keepalive', () => {
            expect(store.getActions()[0].payload.actions).toContainEqual(GameRemoveKeepAlive('player1'))
        })
    })
})

// TODO:
// given a game in the accuse step
// but the current card is in the second row
// when a player chooses to drink
// when a targeted player chooses to drink
// then number of sips of the player is incremented twice
