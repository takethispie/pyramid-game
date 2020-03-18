import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardTitle,
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

const Home: React.FC = () => {
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
                      <IonButton>Creer une partie</IonButton>
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

export default Home;
