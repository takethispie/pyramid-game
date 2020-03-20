import { HandState } from "./hand.state";
import { ThunkAction } from "redux-thunk";
import { Action } from "redux";
import { LoadHand, LoadHandSuccess, LoadHandError, ShowHandHidden, ShowHandVisible, HideHand, ChooseCard, ChooseCardSuccess } from "./hand.actions";
import { Card } from "models/Card";
import { CardName } from "models/CardName";

export const ThunkLoadHand = (nickname: string, gameId: string): ThunkAction<void, HandState, unknown, Action<string>> => async dispatch => {
    dispatch(LoadHand(nickname, gameId));
    try {
        //async firebase calls
        let result: Card[] = [
            new Card(CardName.C4, 0, 0, 0),
            new Card(CardName.D10, 0, 0, 0),
            new Card(CardName.HA, 0, 0, 0),
            new Card(CardName.HK, 0, 0, 0)
        ];
        dispatch(LoadHandSuccess(result))
    } catch (error) {
        dispatch(LoadHandError(error));
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