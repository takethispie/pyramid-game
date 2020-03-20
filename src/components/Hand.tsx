import React, { useEffect } from 'react';
import { ConnectedProps, connect } from 'react-redux';
import { RootState } from 'stores/root.reducer';

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


const CardComponent: React.FC<Props> = ({ cardsInHand }) => {
    return <></>;
};

export default connector(CardComponent);
