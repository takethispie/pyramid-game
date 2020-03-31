import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonButton,
  IonToast,
  IonFooter,
  IonProgressBar
} from "@ionic/react";
import React from "react";
import { Stage, Layer } from "react-konva";
import Card from "components/Card";
import { RootState } from "stores/root.reducer";
import { connect, ConnectedProps, Provider } from "react-redux";
import { ThunkRevealNextCard, ThunkGeneratePyramid } from "stores/boardReducer/board.thunk";
import store from "stores";
import Hand from "components/Hand";
import { ThunkLoadHand } from "stores/handReducer/hand.thunk";

const mapState = (state: RootState) => ({
  pyramid: state.boardReducer.Pyramid,
  boardError: state.boardReducer.ErrorMessage,
  hand: state.handReducer.Hand,
  nickname: state.matchReducer.NickName,
  matchId: state.matchReducer.MatchId,
  cardStack: state.boardReducer.CardStack
});

const mapDispatch = {
  revealCard: ThunkRevealNextCard,
  loadHand: ThunkLoadHand
};

const connector = connect(mapState, mapDispatch);
// The inferred type will look like:
// {isOn: boolean, toggleOn: () => void}
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {};

const Board: React.FC<Props> = ({ revealCard, pyramid, boardError, hand, loadHand, nickname, matchId, cardStack }) => {

  if(hand.length === 0) loadHand(nickname, matchId, cardStack);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Board</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonToast isOpen={boardError !== ""} message={boardError} duration={3000}></IonToast>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Board</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonGrid>
          <IonRow>
            <Stage width={window.innerWidth} height={800}>
              <Provider store={store}>
                <Layer>
                  {pyramid.map(card => (
                    <Card key={card.Id} card={card}></Card>
                  ))}
                  <Hand></Hand>
                </Layer>
              </Provider>
            </Stage>
          </IonRow>
        </IonGrid>
      </IonContent>
      <IonFooter>
        <IonToolbar>
          <IonProgressBar value={0.5}></IonProgressBar>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default connector(Board);
