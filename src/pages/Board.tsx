import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonGrid, IonRow, IonCol, IonCard, IonList, IonItem, IonButton, IonCardContent, IonImg } from '@ionic/react';
import React from 'react';
import Card from 'components/Card';
import { Stage, Layer } from 'react-konva';
import Konva from 'konva';
import { RandomizeCards, CreatePyramid } from 'models/GameBoard';

const Board: React.FC = () => {
  //temporary code
  let cards = RandomizeCards();
  let pyramidBoard = CreatePyramid(cards);

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
            {
              pyramidBoard.pyramid.map(card => <Card key={card.Id} x={card.X} y={card.Y} cardName={card.Name} id={card.Id}></Card>)
            }
          </Layer>
        </Stage>
      </IonContent>
    </IonPage>
  );
};

export default Board;
