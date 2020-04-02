import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonGrid,
  IonRow,
  IonCol,
  IonCardContent,
  IonList,
  IonItem,
  IonButton,
  IonLabel,
  IonInput,
} from "@ionic/react";
import React from "react";
import { RootState } from "stores/root.reducer";
import { ThunkGeneratePyramid } from "stores/boardReducer/board.thunk";
import { connect } from "react-redux";
import { ConnectedProps } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router";

const mapState = (state: RootState) => ({
  cardStack: state.boardReducer.CardStack,
  nickname: state.matchReducer.NickName,
  gameId: state.matchReducer.MatchId,
});

const mapDispatch = {
  generatePyramid: ThunkGeneratePyramid,
};

const connector = connect(mapState, mapDispatch);
// The inferred type will look like:
// {isOn: boolean, toggleOn: () => void}
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & RouteComponentProps & {};

const Home: React.FC<Props> = ({ generatePyramid, history, nickname, gameId, cardStack }) => {
  function generateUniqueString(length: number) {
    let string = ''
    for (let i = 0; i < length; i++) {
      string += String.fromCharCode('a'.charCodeAt(0) + Math.floor(Math.random() * 26))
    }
    return string
  }
  const newGame = () => {
    //generatePyramid();
    const storeId = generateUniqueString(5)
    history.push("/board/" + storeId);
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>home</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">home</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonGrid>
          <IonRow>
            <IonCol offset={"3"} size={"6"}>
              <IonCard>
                <IonCardContent>
                  <IonList>
                    <IonItem>
                      <IonLabel position={'floating'}>Lien de la partie</IonLabel>
                      <IonInput></IonInput>
                    </IonItem>
                    <IonItem>
                      <IonButton>Rejoindre une partie</IonButton>
                    </IonItem>
                    <IonItem>
                      <IonButton onClick={() => newGame()}>Creer une partie</IonButton>
                    </IonItem>
                  </IonList>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default withRouter(connector(Home));
