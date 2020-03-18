import { CardName } from "./CardName";

export class Card {
    public Name: string;

    constructor(name: CardName, public X: number, public Y: number, public Id: string) {
        this.Name = name.substring(1) + name.substring(0,1);
    }
}