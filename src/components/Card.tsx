import React, { useEffect } from 'react';
import { Image } from 'react-konva';
import useImage from 'use-image';
import { Card } from 'models/Card';
import { ConnectedProps, connect } from 'react-redux';
import { RootState } from 'stores/root.reducer';
import { ThunkRevealNextCardSuccess } from 'stores/boardReducer/board.thunk';

interface props {
    card: Card;
    color?: "gray" | "blue";
    clicked?: (card: Card) => void;
}


const mapState = (state: RootState) => ({
    visibleCards: state.boardReducer.VisibleCardIds
});

const mapDispatch = {
    revealCardSuccess: ThunkRevealNextCardSuccess
};

const connector = connect(mapState, mapDispatch);
// The inferred type will look like:
// {isOn: boolean, toggleOn: () => void}
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & props;


const CardComponent: React.FC<Props> = ({ card, visibleCards, revealCardSuccess, clicked = () => {}, color = "gray" }) => {
    if(visibleCards.some(id => id === card.Id && card.Visible == false)) revealCardSuccess(card);

    const [img] = useImage("/assets/cards/" + card.Name.toString() + ".png");
    const [hiddenCardImg] = useImage("/assets/cards/" + color + "_back.png");
    return card.Visible ? <Image width={110} height={180} x={card.X} y={card.Y} image={img} /> 
        : <Image width={110} height={180} x={card.X} y={card.Y} image={hiddenCardImg} onClick={() => clicked(card)}></Image>
};

export default connector(CardComponent);
