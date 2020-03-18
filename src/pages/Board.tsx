import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonGrid, IonRow, IonCol, IonCard, IonList, IonItem, IonButton } from '@ionic/react';
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
        <IonContent>          
        <IonGrid> 
          <IonRow>
            <IonCol offset={"4"} size={"5"}>
              <IonCard>
                <IonContent>
                  <IonList>
                    <IonItem>
                      <IonButton>Rejoindre une partie</IonButton>
                    </IonItem>
                    <IonItem>
                      <IonButton>Creer une partie</IonButton>
                    </IonItem>
                  </IonList>
                </IonContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
        </IonContent>
      </IonContent>
    </IonPage>
  );
};

export default Board;
