/**
 * @jest-environment node
 */

import { GameState, GameStep } from './game.state'
import GameReducer from './game.reducer'
import { defaultGameState } from './game.reducer'
import { GameChooseTarget, GameAccuse, GameAcceptToDrink, GameDrink } from './game.actions'


function eqSet<T>(as: Set<T>, bs: Set<T>) {
    if (as.size !== bs.size) return false
    for (var a of as) if (!bs.has(a)) return false
    return true
}

// TODO: a player can choose not to target anyone
describe('given a game in the target choosing step', () => {

    let game: GameState

    beforeEach(() => {
        game = defaultGameState
        game.CurrentStep = GameStep.ChooseTarget
        game.Players = new Set(['player1', 'player2', 'player3'])
    })

    describe('when a player chooses its target (not the last one)', () => {

        beforeEach(() => {
            game = GameReducer(game, GameChooseTarget('player1', 'player2'))
        })

        it('then the target is added to the target list', () => {
            expect(game.Targets['player1']).toBe('player2')
        })

        it('then the game remains in the target choosing step', () => {
            expect(game.CurrentStep).toBe(GameStep.ChooseTarget)
        })
    })

    describe('when the last player chooses its target', () => {

        beforeEach(() => {
            game.Targets = {
                'player2': 'player3',
                'player3': 'player2'
            }
            game = GameReducer(game, GameChooseTarget('player1', 'player2'))
        })

        it('then the game moves to the accuse step', () => {
            expect(game.CurrentStep).toBe(GameStep.Accuse)
        })

        it('then each player has a target', () => {
            expect(game.Targets['player1']).toBeDefined()
            expect(game.Targets['player2']).toBeDefined()
            expect(game.Targets['player3']).toBeDefined()
        })
    })
})

describe('given a game in the accuse step', () => {

    let game: GameState

    beforeEach(() => {
        game = defaultGameState
        game.CurrentStep = GameStep.Accuse
        game.Players = new Set(['player1', 'player2', 'player3'])
        game.Targets = {
            'player1': 'player2',
            'player2': 'player3',
            'player3': 'player2'
        }
    })

    describe('when a player accuses another player of lying', () => {

        beforeEach(() => {
            game = GameReducer(game, GameAccuse('player2', 'player1'))
        })

        it('then the accusation is added to the accusation list', () => {
            expect(game.Accusations['player2']).toBe('player1')
        })

        it('then the target is removed from the target list', () => {
            expect(game.Targets['player1']).not.toBeDefined()
        })
    })

    describe('when a player acusses another player of lying, but the other player did not target the accuser', () => {

        let updatedGame: GameState

        beforeEach(() => {
            updatedGame = GameReducer(game, GameAccuse('player1', 'player2'))
        })

        it('then nothing happens', () => {
            expect(updatedGame).toBe(game)
        })
    })

    describe('when a targeted player chooses to drink', () => {

        beforeEach(() => {
            game = GameReducer(game, GameAcceptToDrink('player2', 'player1'))
        })

        it('the number of sips of the player is incremented', () => {
            expect(game.Sips['player2']).toBe(1)
        })

        it('then the target is removed from the target list', () => {
            expect(game.Targets['player1']).not.toBeDefined()
        })
    })

    describe('when the last player accuses another player of lying', () => {

        beforeEach(() => {
            game = GameReducer(game, GameAccuse('player2', 'player1'))
            game = GameReducer(game, GameAccuse('player3', 'player2'))
            game = GameReducer(game, GameAccuse('player2', 'player3'))
        })

        it('then the game moves to the denying step', () => {
            expect(game.CurrentStep).toBe(GameStep.Deny)
        })
    })

    describe('when all players choose to drink', () => {

        beforeEach(() => {
            game = GameReducer(game, GameAcceptToDrink('player2', 'player1'))
            game = GameReducer(game, GameAcceptToDrink('player3', 'player2'))
            game = GameReducer(game, GameAcceptToDrink('player2', 'player3'))
        })

        it('then the game moves to the drinking step', () => {
            expect(game.CurrentStep).toBe(GameStep.Drink)
        })

        it('then each player has a number of sips', () => {
            expect(game.Sips['player1']).toBe(0)
            expect(game.Sips['player2']).toBe(2)
            expect(game.Sips['player3']).toBe(1)
        })

        it('then the target list is empty', () => {
            expect(Object.keys(game.Targets).length).toBe(0)
        })
    })

    describe('when the last player chooses to drink but another player accused someone', () => {

        beforeEach(() => {
            game = GameReducer(game, GameAcceptToDrink('player2', 'player1'))
            game = GameReducer(game, GameAccuse('player3', 'player2'))
            game = GameReducer(game, GameAcceptToDrink('player2', 'player3'))
        })

        it('then the game moves to the denying step', () => {
            expect(game.CurrentStep).toBe(GameStep.Deny)
        })

        it('then the target list is empty', () => {
            expect(Object.keys(game.Targets).length).toBe(0)
        })
    })
})

// TODO:
// given a game in the deny step
// ...

describe('given a game in the drinking step', () => {

    let game: GameState

    beforeEach(() => {
        game = defaultGameState
        game.CurrentStep = GameStep.Drink
        game.Players = new Set(['player1', 'player2', 'player3'])
    })

    describe('when a player drinks (not the last one)', () => {

        beforeEach(() => {
            game = GameReducer(game, GameDrink('player1'))
        })

        it('then the game remains in the drinking step', () => {
            expect(game.CurrentStep).toBe(GameStep.Drink)
        })

        it('the player who drank is added the to list of player done drinking', () => {
            expect(eqSet(game.DoneDrinking, new Set(['player1']))).toBeTruthy()
        })
    })

    describe('when the last player drinks', () => {

        beforeEach(() => {
            game.DoneDrinking = new Set(['player2', 'player3'])
            game = GameReducer(game, GameDrink('player1'))
        })

        it('the game moves to the target choosing step', () => {
            expect(game.CurrentStep).toBe(GameStep.ChooseTarget)
        })

        it('the list of player done drinking is reseted', () => {
            expect(eqSet(game.DoneDrinking, new Set)).toBeTruthy()
        })
    })
})

// TODO:
// given a game in the accuse step
// but the current card is in the second row
// when a player chooses to drink
// when a targeted player chooses to drink
// then number of sips of the player is incremented twice
