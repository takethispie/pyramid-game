import { Card } from "./Card";

const cardPadding = 15;
const cardWidth = 110;
const cardHeight = 180;
const startingX = 50;
const startingY = 700;

export const CardPositions: {x: number, y: number, id: string}[] = [
    {x: startingX, y: startingY, id: "0:0"},
    { x: startingX + cardWidth + cardPadding, y: startingY, id: "0:1"},
    { x: startingX + (cardWidth + cardPadding) * 2, y: startingY, id: "0:2"},
    { x: startingX + (cardWidth + cardPadding) * 3, y: startingY, id: "0:3"},
    //second row
    { x: cardWidth + cardPadding, y: startingY - cardHeight - cardPadding, id: "1:0"},
    { x: (cardWidth + cardPadding) * 2, y: startingY - cardHeight - cardPadding, id: "1:1"},
    { x: (cardWidth + cardPadding) * 3, y: startingY - cardHeight - cardPadding, id: "1:2"},
    //third row
    { x: cardWidth * 2 - cardPadding * 2, y: startingY - (cardHeight + cardPadding)*2, id: "2:0"},
    { x: cardWidth * 3 - cardPadding, y: startingY - (cardHeight + cardPadding)*2, id: "2:1"},
    //last row
    { x: cardWidth * 2 + cardPadding * 2, y: startingY - (cardHeight + cardPadding)*3, id: "2:2"},
];

export const GenerateGameBoardCards = () => {

} 