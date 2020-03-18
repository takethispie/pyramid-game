import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonGrid, IonRow, IonCol, IonCard, IonList, IonItem, IonButton, IonCardContent, IonImg } from '@ionic/react';
import React from 'react';
import Card from 'components/Card';
import { CardName } from 'models/CardName';
import { Stage, Layer, Rect, Text } from 'react-konva';
import Konva from 'konva';

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
        <Stage width={window.innerWidth} height={window.innerHeight}>
          <Layer>
            
            <Card x={500} y={500} cardName={CardName.C2}></Card>
          </Layer>
        </Stage>
      </IonContent>
    </IonPage>
  );
};

export default Board;
