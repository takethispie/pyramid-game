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
  IonCard,
  IonList,
  IonItem,
  IonButton,
  IonCardContent,
  IonImg,
  IonToast
} from "@ionic/react";
import React, { useEffect } from "react";
import { Stage, Layer } from "react-konva";
import Konva from "konva";
import { RandomizeCards, CreatePyramid } from "models/GameBoard";
import CardComponent from "components/Card";
import { RootState } from "stores/root.reducer";
import { connect, ConnectedProps, Provider } from "react-redux";
import { ThunkRevealNextCard, ThunkGeneratePyramid } from "stores/boardReducer/board.thunk";
import store from "stores";

const mapState = (state: RootState) => ({
  pyramid: state.boardReducer.Pyramid,
  boardError: state.boardReducer.ErrorMessage
});

const mapDispatch = {
  revealCard: ThunkRevealNextCard,
  generatePyramid: ThunkGeneratePyramid
};

const connector = connect(mapState, mapDispatch);
// The inferred type will look like:
// {isOn: boolean, toggleOn: () => void}
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {};

const Board: React.FC<Props> = ({ revealCard, pyramid, boardError }) => {


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
                    <CardComponent key={card.Id} card={card}></CardComponent>
                  ))}
                </Layer>
              </Provider>
            </Stage>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonButton onClick={() => revealCard()}>test</IonButton>
              </IonItem>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default connector(Board);
