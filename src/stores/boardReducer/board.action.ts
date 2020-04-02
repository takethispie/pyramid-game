import { Card } from "models/Card";
import { SyncResetAction } from "stores/syncMiddleware/sync.action";

export const REVEAL_CARD = "REVEAL_CARD";
export const REVEAL_CARD_SUCCESS = "REVEAL_CARD_SUCCESS";
export const REVEAL_CARD_ERROR = "REVEAL_CARD_ERROR";

export const GENERATE_PYRAMID = "GENERATE_PYRAMID";
export const GENERATE_PYRAMID_SUCCESS = "GENERATE_PYRAMID_SUCCESS";
export const GENERATE_PYRAMID_ERROR = "GENERATE_PYRAMID_ERROR";

interface RevealCard {
    type: typeof REVEAL_CARD;
}

interface RevealCardSuccess {
    type: typeof REVEAL_CARD_SUCCESS;
    payload: {
        card: Card
    }
}


interface RevealCardError {
    type: typeof REVEAL_CARD_ERROR;
    payload: {
        errorMessage: string
    }
}

interface GeneratePyramid {
    type: typeof GENERATE_PYRAMID;
    payload: {
        cards: string[]
    }
}

interface GeneratePyramidSuccess {
    type: typeof GENERATE_PYRAMID_SUCCESS;
    payload: {
        pyramid: Card[],
        cardStack: Card[]
    }
}

interface GeneratePyramidError {
    type: typeof GENERATE_PYRAMID_ERROR,
    payload: {
        errorMessage: string
    }
}

export type BoardActionsTypes = RevealCard | RevealCardSuccess | RevealCardError
    | GeneratePyramid | GeneratePyramidSuccess | GeneratePyramidError | SyncResetAction;


export function RevealCard(): BoardActionsTypes {
    return {
        type: REVEAL_CARD,
    }
}

export function RevealCardSuccess(card: Card): BoardActionsTypes {
    return {
        type: REVEAL_CARD_SUCCESS,
        payload: {
            card
        }
    }
}

export function RevealCardError(errorMessage: string): BoardActionsTypes {
    return {
        type: REVEAL_CARD_ERROR,
        payload: {
            errorMessage
        }
    }
}

export function GeneratePyramid(randomizedCards: string[]): BoardActionsTypes {
    return {
        type: GENERATE_PYRAMID,
        payload: {
            cards: randomizedCards
        }
    }
}

export function GeneratePyramidSuccess(pyramid: Card[], cardStack: Card[]): BoardActionsTypes {
    return {
        type: GENERATE_PYRAMID_SUCCESS,
        payload: {
            pyramid,
            cardStack
        }
    }
}

export function GeneratePyramidError(errorMessage: string): BoardActionsTypes {
    return {
        type: GENERATE_PYRAMID_ERROR,
        payload: {
            errorMessage
        }
    }
}