import { CardName } from "./CardName";

export class Card {
    public Name: string;
    public Visible: boolean;

    constructor(name: CardName, public X: number, public Y: number, public Id: number) {
        this.Name = name.substring(1) + name.substring(0,1);
        this.Visible = false;
    }
}