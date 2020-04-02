import { Card } from "models/Card";
import { HandStep } from "models/HandStep";

export interface HandState {
    handVisible: boolean;
    Hand: Card[];
    IsLoading: boolean;
    Step: HandStep;
    SelectedCardIndex: number; 
    ErrorMessage: string;
}