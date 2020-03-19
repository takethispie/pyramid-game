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

const mapState = (state: RootState) => ({});

const mapDispatch = {
  generatePyramid: ThunkGeneratePyramid
};

const connector = connect(mapState, mapDispatch);
// The inferred type will look like:
// {isOn: boolean, toggleOn: () => void}
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & RouteComponentProps & {};

const Home: React.FC<Props> = ({ generatePyramid, history }) => {
  const newGame = () => {
    generatePyramid();
    history.push("/board");
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
