import React, { useEffect } from 'react';
import { ConnectedProps, connect } from 'react-redux';
import { RootState } from 'stores/root.reducer';
import CardComponent from './Card';
import { Card } from 'models/Card';
import { IonProgressBar } from '@ionic/react';
import { HandStep } from 'models/HandStep';

interface props {
}


const mapState = (state: RootState) => ({
    cardsInHand: state.handReducer.Hand,
    step: state.handReducer.Step
});

const mapDispatch = {
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & props;


const Hand: React.FC<Props> = ({ cardsInHand, step }) => {
    let x: number = 700;
    let y: number = 600;

    const selectCard = (card: Card) => {
        if(step == HandStep.Choose)
            console.log(card);
    }

    return (
        <>
            {
                cardsInHand.map(noPositionCard => {
                    noPositionCard.X = x;
                    noPositionCard.Y = y;
                    x += 125;
                    return noPositionCard;
                }).map(card => <CardComponent key={card.Name} card={card} color={"blue"} clicked={selectCard}></CardComponent>)
            }
        </>
    );
};

export default connector(Hand);
