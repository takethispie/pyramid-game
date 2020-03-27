import React, { useEffect } from 'react';
import { ConnectedProps, connect } from 'react-redux';
import { RootState } from 'stores/root.reducer';
import CardComponent from './Card';
import { Card } from 'models/Card';

interface props {
}


const mapState = (state: RootState) => ({
    cardsInHand: state.handReducer.Hand
});

const mapDispatch = {
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & props;


const Hand: React.FC<Props> = ({ cardsInHand }) => {
    let x: number = 600;
    let y: number = 600;
    return (
        <>
            {
                cardsInHand.map(noPositionCard => {
                    noPositionCard.X = x;
                    noPositionCard.Y = y;
                    x += 125;
                    return noPositionCard;
                }).map(card => <CardComponent card={card} color={"blue"}></CardComponent>)
            }
        </>
    );
};

export default connector(Hand);
