import { Card } from "models/Card";
import { HandStep } from "models/HandStep";

export interface HandState {
    showCardsHidden: boolean;
    showCardsVisible: boolean;
    Hand: Card[];
    IsLoading: boolean;
    Step: HandStep;
    SelectedCardIndex: number; 
    ErrorMessage: string;
}