import { HandState } from "./hand.state";
import {
  HandActionsTypes,
  LOAD_HAND,
  LOAD_HAND_SUCCESS,
  LOAD_HAND_ERROR,
  SHOW_HAND_VISIBLE,
  SHOW_HAND_HIDDEN,
  HIDE_HAND,
  CHOOSE_CARD,
  CHOOSE_CARD_SUCCESS
} from "./hand.actions";
import { HandStep } from "models/HandStep";
import { Card } from "models/Card";

export const defaultHandState: HandState = {
  IsLoading: false,
  handVisible: false,
  Hand: [],
  Step: HandStep.Idle,
  SelectedCardIndex: -1,
  ErrorMessage: ""
};

const mapHandVisibility = (cards: Card[], visibility: boolean) =>
  cards.map(card => {
    card.Visible = visibility;
    return card;
});

const HandReducer = (
  state: HandState = defaultHandState,
  action: HandActionsTypes
): HandState => {
  switch (action.type) {
    case LOAD_HAND:
      return { ...state, IsLoading: true, ErrorMessage: "" };

    case LOAD_HAND_SUCCESS:
      return { ...state, Hand: action.payload.cards, IsLoading: false };

    case LOAD_HAND_ERROR:
      return {
        ...state,
        IsLoading: false,
        ErrorMessage: action.payload.errorMessage
      };

    case SHOW_HAND_VISIBLE:
      return {
        ...state,
        handVisible: true,
        Hand: mapHandVisibility(state.Hand, true)
      };

    case SHOW_HAND_HIDDEN:
      return {
        ...state,
        handVisible: true,
        Hand: mapHandVisibility(state.Hand, false)
      };

    case HIDE_HAND:
      return {
        ...state,
        handVisible: false,
        Hand: mapHandVisibility(state.Hand, false)
      };

    case CHOOSE_CARD:
      return { ...state, Step: HandStep.Choose, ErrorMessage: "" };

    case CHOOSE_CARD_SUCCESS:
      return {
        ...state,
        SelectedCardIndex: action.payload.index,
        Step: HandStep.Idle,
        Hand: state.Hand.map((card, id) => {
          if (action.payload.index === id) card.Visible = true;
          return card;
        })
      };

    default:
      return state;
  }
};

export default HandReducer;
