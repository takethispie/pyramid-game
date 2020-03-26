import { Middleware, AnyAction } from "redux"
import { multiAction } from "./multiAction.middleware"
import { MultiAction } from "./multiAction.actions"
import { Dispatch } from "react"

describe('given a multiAction middleware', () => {
    let middleware: Middleware

    beforeEach(() => {
        middleware = multiAction
    })

    describe('when it receives a multi action', () => {
        let next: jest.Mock<any, any>

        beforeEach(() => {
            next = jest.fn()
            multiAction({ dispatch: jest.fn(), getState: jest.fn() })(next)(MultiAction([
                { type: 'ACTION1' },
                { type: 'ACTION2' }
            ]))
        })

        it('then it calls next on each action', () => {
            expect(next.mock.calls[0][0]).toEqual({ type: 'ACTION1' })
            expect(next.mock.calls[1][0]).toEqual({ type: 'ACTION2' })
        })
    })

    describe('when it receives a normal action', () => {
        let next: jest.Mock<any, any>

        beforeEach(() => {
            next = jest.fn()
            multiAction({ dispatch: jest.fn(), getState: jest.fn() })(next)({ type: 'ACTION1' })
        })

        it('then it calls next on the action', () => {
            expect(next.mock.calls[0][0]).toEqual({ type: 'ACTION1' })
        })
    })
})