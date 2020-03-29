import { Card } from "models/Card";

export interface HandState {
    showCardsHidden: boolean;
    showCardsVisible: boolean;
    Hand: Card[];
    IsLoading: boolean;
    CardSelectionStep: boolean;
    SelectedCardIndex: number; 
    ErrorMessage: string;
}