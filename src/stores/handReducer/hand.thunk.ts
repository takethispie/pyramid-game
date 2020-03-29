import { HandState } from "./hand.state";
import { ThunkAction } from "redux-thunk";
import { Action } from "redux";
import { LoadHand, LoadHandSuccess, LoadHandError, ShowHandHidden, ShowHandVisible, HideHand, ChooseCard, ChooseCardSuccess } from "./hand.actions";
import { Card } from "models/Card";
import { CreateHand } from "models/GameBoard";

export const ThunkLoadHand = (nickname: string, gameId: string, cardStack: Card[]): ThunkAction<void, HandState, unknown, Action<string>> => async dispatch => {
    dispatch(LoadHand(nickname, gameId));
    try {
        let result = CreateHand(cardStack);
        dispatch(LoadHandSuccess(result.hand));
    } catch (error) {
        dispatch(LoadHandError(error || "Erreur inconnue"));
    }
}


export const ThunkShowHiddenCards = (): ThunkAction<void, HandState, unknown, Action<string>> => dispatch => {
    dispatch(ShowHandHidden());
}

export const ThunkShowVisibleCards = (): ThunkAction<void, HandState, unknown, Action<string>> => dispatch => {
    dispatch(ShowHandVisible());
}

export const ThunkHideHand = (): ThunkAction<void, HandState, unknown, Action<string>> => dispatch => {
    dispatch(HideHand());
}

export const ThunkChooseCard = (): ThunkAction<void, HandState, unknown, Action<string>> => dispatch => {
    dispatch(ChooseCard());
}

export const ThunkChooseCardSuccess = (card: Card, index: number): ThunkAction<void, HandState, unknown, Action<string>> => dispatch => {
    dispatch(ChooseCardSuccess(card, index));
}