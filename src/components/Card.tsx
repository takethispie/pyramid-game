import React from 'react';
import { Stage, Layer, Image } from 'react-konva';
import useImage from 'use-image';
import { CardName } from 'models/CardName';

interface props {
    x: number,
    y: number,
    cardName: CardName
}

const Card: React.FC<props> = ({ x, y, cardName }) => {
    const [img] = useImage("/assets/cards/" + cardName.toString() + ".png");
    return <Image width={110} height={180} x={x} y={y} image={img} />;
};

export default Card;
