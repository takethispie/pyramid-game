import { ThunkAction } from "redux-thunk";
import { Action } from "redux";
import { BoardState } from "./board.state";
import { RevealCard, GeneratePyramid, GeneratePyramidSuccess, RevealCardSuccess } from "./board.action";
import { RandomizeCards, CreatePyramid } from "models/GameBoard";
import { Card } from "models/Card";

export const ThunkRevealNextCard = (): ThunkAction<void, BoardState, unknown, Action<string>> => dispatch => {
    dispatch(RevealCard());
}

export const ThunkRevealNextCardSuccess = (card: Card): ThunkAction<void, BoardState, unknown, Action<string>> => dispatch => {
    dispatch(RevealCardSuccess(card));
}

export const ThunkGeneratePyramid = (): ThunkAction<void, BoardState, unknown, Action<string>> => dispatch => {
    const cards = RandomizeCards();
    dispatch(GeneratePyramid(cards));
    const result = CreatePyramid(cards);
    dispatch(GeneratePyramidSuccess(result.pyramid));
}