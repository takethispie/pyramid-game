import { Card } from "./Card";
import { CardName } from "./CardName";

const cardPadding = 15;
const cardWidth = 110;
const cardHeight = 180;
const startingX = 50;
const startingY = 600;

function getRndInteger(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) ) + min;
  }

export const CardPositions: {x: number, y: number, id: number}[] = [
    {x: startingX, y: startingY, id: 0},
    { x: startingX + cardWidth + cardPadding, y: startingY, id: 1},
    { x: startingX + (cardWidth + cardPadding) * 2, y: startingY, id: 2},
    { x: startingX + (cardWidth + cardPadding) * 3, y: startingY, id: 3},
    //second row
    { x: cardWidth + cardPadding, y: startingY - cardHeight - cardPadding, id: 4},
    { x: (cardWidth + cardPadding) * 2, y: startingY - cardHeight - cardPadding, id: 5},
    { x: (cardWidth + cardPadding) * 3, y: startingY - cardHeight - cardPadding, id: 6},
    //third row
    { x: cardWidth * 2 - cardPadding * 2, y: startingY - (cardHeight + cardPadding)*2, id: 7},
    { x: cardWidth * 3 - cardPadding, y: startingY - (cardHeight + cardPadding)*2, id: 8},
    //last row
    { x: cardWidth * 2 + cardPadding * 2, y: startingY - (cardHeight + cardPadding)*3, id: 9},
];

export const RandomizeCards = () => {
    let cardNameArray: string[] = [];
    let randomizedCard: string[] = [];
    for(let name in CardName) {
        cardNameArray.push(name);
    }
    while(cardNameArray.length > 0) {
        const pointer = getRndInteger(0, cardNameArray.length);
        const name = cardNameArray[pointer]
        randomizedCard.push(name);
        cardNameArray = cardNameArray.filter((card) => card !== name);
    }
    return randomizedCard;
} 

export const CreatePyramid = (randomizedCard: string[]) => {
    let cards = [...randomizedCard];
    let pyramid: Card[] = [];
    for(let position of CardPositions) {
        const pointer = getRndInteger(0, cards.length);
        pyramid.push(new Card(cards[pointer] as CardName, position.x, position.y, position.id));
        cards = cards.filter(c => c !== cards[pointer]);
    }
    return {pyramid, cards};
}