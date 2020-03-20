import { HandState } from "./hand.state";
import { HandActionsTypes } from "./hand.actions";

export const defaultHandState: HandState = {
    IsLoading: false,
    showCardsHidden: false,
    showCardsVisible: false,
    Hand: [],
    CardSelectionStep: false,
    HasSelectedCard: false,
    SelectedCardIndex: -1
}


const HandReducer = (state: HandState = defaultHandState, action: HandActionsTypes): HandState => {
    switch (action.type) {


        default:
            return state;
    }
};

export default HandReducer;