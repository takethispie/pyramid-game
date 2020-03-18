import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonGrid, IonRow, IonCol, IonCard, IonList, IonItem, IonButton, IonCardContent } from '@ionic/react';
import React from 'react';

const Board: React.FC = () => {
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
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Board</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonGrid> 
          <IonRow>
            <IonCol offset={"4"} size={"5"}>
              <IonCard>
                <IonCardContent>
                  <IonList>
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

export default Board;
