import { Card } from "models/Card";

export interface BoardState {
    VisibleCardIds: number[]
    RemainingCards: number[]
    Pyramid: Card[]
    LastId: number
}