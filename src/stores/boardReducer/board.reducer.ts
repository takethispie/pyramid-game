import { BoardState } from "./board.state";
import { BoardActionsTypes, REVEAL_CARD, REVEAL_CARD_SUCCESS, GENERATE_PYRAMID, GENERATE_PYRAMID_SUCCESS, GENERATE_PYRAMID_ERROR } from "./board.action";
import { SYNC_RESET } from "stores/syncMiddleware/sync.action";

export const defaultBoardState: BoardState = {
    VisibleCardIds: [],
    RemainingCards: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    Pyramid: [],
    LastId: -1,
    IsPyramidLoaded: false,
    ErrorMessage: "",
    CardStack: []
};

const BoardReducer = (state: BoardState = defaultBoardState, action: BoardActionsTypes): BoardState => {
    switch (action.type) {
        case SYNC_RESET:
            return defaultBoardState

        case REVEAL_CARD:
            return { ...state, VisibleCardIds: [...state.VisibleCardIds, state.LastId + 1], LastId: state.LastId + 1, RemainingCards: state.RemainingCards.filter(c => c !== state.LastId + 1) }

        case REVEAL_CARD_SUCCESS:
            return { ...state, Pyramid: state.Pyramid.map(card => { if (card.Id === state.LastId) card.Visible = true; return card }) }

        case GENERATE_PYRAMID:
            return { ...state, ErrorMessage: "", VisibleCardIds: [], RemainingCards: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], LastId: -1, IsPyramidLoaded: false };

        case GENERATE_PYRAMID_SUCCESS:
            return { ...state, Pyramid: action.payload.pyramid, IsPyramidLoaded: true, CardStack: action.payload.cardStack }

        case GENERATE_PYRAMID_ERROR:
            return { ...state, ErrorMessage: action.payload.errorMessage };

        default:
            return state;
    }
};

export default BoardReducer;