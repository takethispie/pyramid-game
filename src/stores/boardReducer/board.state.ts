import { Card } from "models/Card";

export interface BoardState {
    VisibleCardIds: number[];
    RemainingCards: number[];
    Pyramid: Card[];
    CardStack: Card[];
    LastId: number;
    IsPyramidLoaded: boolean;
    ErrorMessage: string;
}