import MatchReducer, { defaultMatchState } from "./match.reducer"
import { ChangeNickName } from "./match.actions"

describe('when a match reducer receives a MATCH_CHANGE_NICKNAME', () => {
    it('it changes the nickname', () => {
        expect(
            MatchReducer({
                ...defaultMatchState
                , NickName: 'oldNickname'
            }, ChangeNickName('newNickname')).NickName
        ).toBe('newNickname')
    })
})