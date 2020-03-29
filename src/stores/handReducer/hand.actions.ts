import { Card } from "models/Card";

export const LOAD_HAND = "LOAD_HAND";
export const LOAD_HAND_SUCCESS = "LOAD_HAND_SUCCESS";
export const LOAD_HAND_ERROR = "LOAD_HAND_ERROR";

export const SHOW_HAND_VISIBLE = "SHOW_HAND_VISIBLE";
export const SHOW_HAND_HIDDEN = "SHOW_HAND_HIDDEN";
export const HIDE_HAND = "HIDE_HAND";

export const CHOOSE_CARD = "CHOOSE_CARD";
export const CHOOSE_CARD_SUCCESS = "CHOOSE_CARD_SUCCESS";

interface LoadHand {
  type: typeof LOAD_HAND;
  payload: {
    nickname: string;
    gameId: string;
  };
}

interface LoadHandSuccess {
  type: typeof LOAD_HAND_SUCCESS;
  payload: {
    cards: Card[];
  };
}

interface LoadHandError {
  type: typeof LOAD_HAND_ERROR;
  payload: {
    errorMessage: string;
  };
}

interface ShowHandVisible {
  type: typeof SHOW_HAND_VISIBLE;
}

interface ShowHandHidden {
  type: typeof SHOW_HAND_HIDDEN;
}

interface HideHand {
  type: typeof HIDE_HAND;
}

interface ChooseCard {
  type: typeof CHOOSE_CARD;
}

interface ChooseCardSuccess {
  type: typeof CHOOSE_CARD_SUCCESS;
  payload: {
    card: Card;
    index: number;
  };
}

export type HandActionsTypes =
  | LoadHand
  | LoadHandSuccess
  | LoadHandError
  | ShowHandVisible
  | ShowHandHidden
  | HideHand
  | ChooseCard
  | ChooseCardSuccess;

export function LoadHand(nickname: string, gameId: string): HandActionsTypes {
  return {
    type: LOAD_HAND,
    payload: {
      nickname,
      gameId
    }
  };
}

export function LoadHandSuccess(cards: Card[]): HandActionsTypes {
  return {
    type: LOAD_HAND_SUCCESS,
    payload: {
      cards
    }
  };
}

export function LoadHandError(errorMessage: string): HandActionsTypes {
  return {
    type: LOAD_HAND_ERROR,
    payload: {
      errorMessage
    }
  };
}

export function ShowHandVisible(): HandActionsTypes {
  return {
    type: SHOW_HAND_VISIBLE
  };
}

export function ShowHandHidden(): HandActionsTypes {
  return {
    type: SHOW_HAND_HIDDEN
  };
}

export function HideHand(): HandActionsTypes {
  return {
    type: HIDE_HAND
  };
}

export function ChooseCard(): HandActionsTypes {
  return {
    type: CHOOSE_CARD
  };
}

export function ChooseCardSuccess(card: Card, index: number): HandActionsTypes {
  return {
    type: CHOOSE_CARD_SUCCESS,
    payload: {
      card,
      index
    }
  };
}
