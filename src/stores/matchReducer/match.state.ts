import { GameState } from "stores/gameReducer/game.state";

export interface MatchState {
    IsInMatch: boolean,
    MatchId: string,
    ErrorMessage: string,
    NickName: string
}