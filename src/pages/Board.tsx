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
import React, { useEffect, useState } from "react";
import { Stage, Layer } from "react-konva";
import Card from "components/Card";
import { RootState } from "stores/root.reducer";
import { connect, ConnectedProps, Provider } from "react-redux";
import { ThunkRevealNextCard, ThunkGeneratePyramid } from "stores/boardReducer/board.thunk";
import store from "stores";
import Hand from "components/Hand";
import { ThunkLoadHand } from "stores/handReducer/hand.thunk";
import { connectToRoom } from "stores/syncMiddleware/sync.middleware";
import { ThunkLeaveGame, ThunkChooseTarget, ThunkAcceptToDrink, ThunkAccuse, ThunkAdmitToLying, ThunkProveNotToLie, ThunkDrink } from "stores/gameReducer/game.thunk";
import { useBeforeunload } from "react-beforeunload";
import { getStep, GameStep } from "stores/gameReducer/game.state";
import ChooseTargetComponent from "components/ChooseTarget";
import AccuseComponent from "components/Accuse"
import WaitingOtherPlayersComponent from "components/WaitingOtherPlayers"
import DenyComponent from "components/Deny"
import DrinkComponent from "components/Drink"

const mapState = (state: RootState) => ({
  pyramid: state.boardReducer.Pyramid
  , boardError: state.boardReducer.ErrorMessage
  , hand: state.handReducer.Hand
  , nickname: state.matchReducer.NickName
  , matchId: state.matchReducer.MatchId
  , cardStack: state.boardReducer.CardStack
  , game: state.gameReducer
  , players: state.gameReducer.Players
  , targets: state.gameReducer.Targets
  , accusations: state.gameReducer.Accusations
  , sips: state.gameReducer.Sips
});

const mapDispatch = {
  revealCard: ThunkRevealNextCard
  , loadHand: ThunkLoadHand
  , leaveGame: ThunkLeaveGame
  , generatePyramid: ThunkGeneratePyramid
  , chooseTarget: ThunkChooseTarget
  , acceptToDrink: ThunkAcceptToDrink
  , accuse: ThunkAccuse
  , admitToLying: ThunkAdmitToLying
  , proveNotToLie: ThunkProveNotToLie
  , drink: ThunkDrink
};

const connector = connect(mapState, mapDispatch);
// The inferred type will look like:
// {isOn: boolean, toggleOn: () => void}
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {};

const Board: React.FC<Props> = ({
  revealCard
  , pyramid
  , boardError
  , hand
  , loadHand
  , nickname
  , matchId
  , cardStack
  , leaveGame
  , generatePyramid
  , game
  , players
  , targets
  , chooseTarget
  , acceptToDrink
  , accuse
  , accusations
  , admitToLying
  , proveNotToLie
  , sips
  , drink
}) => {

  if (hand.length === 0) loadHand(nickname, matchId, cardStack);

  const [connectedRoom, setConnectedRoom] = useState('')

  useEffect(() => {
    const urlPathParts = window.location.pathname!.split('/')
    if (urlPathParts[1] == 'board' && urlPathParts.length >= 3) {
      const storeId = urlPathParts[2]
      if (connectedRoom != storeId) {
        setConnectedRoom(storeId)
        connectToRoom(storeId, () => store.dispatch).then(() => {
          console.log('CONNECTED')
          if (store.getState().boardReducer.Pyramid.length == 0) {
            generatePyramid()
          }
        })
      }
    }
  }, [connectedRoom, pyramid.length, generatePyramid])

  useBeforeunload(() => leaveGame());

  function getControls(step: GameStep): JSX.Element {
    switch (step) {
      case GameStep.ChooseTarget:
        const otherPlayers = [...players].filter(player => player != nickname)
        if (otherPlayers.length > 0) {
          return <ChooseTargetComponent players={otherPlayers} currentTarget={targets[nickname]} chooseTarget={player => chooseTarget(nickname, player)} />
        } else {
          return <WaitingOtherPlayersComponent />
        }
      case GameStep.Accuse:
        let targetedByList = Object.keys(targets).filter(key => targets[key] == nickname)
        if (targetedByList.length > 0) {
          const playerWhoTargets = targetedByList[0]
          let selectedButton: 'None' | 'Accuse' | 'AcceptToDrink' = 'None'
          if (accusations[playerWhoTargets] == nickname) {
            selectedButton = 'Accuse'
          } else if (targets[playerWhoTargets] == undefined) {
            selectedButton = 'AcceptToDrink'
          }
          return <AccuseComponent playerWhoTargets={playerWhoTargets} acceptToDrink={() => acceptToDrink(playerWhoTargets, nickname)} accuseOfLying={() => accuse(playerWhoTargets, nickname)} />
        } else {
          return <WaitingOtherPlayersComponent />
        }
      case GameStep.Deny:
        if (accusations[nickname] != undefined) {
          return <DenyComponent playerWhoAccuses={accusations[nickname]} proveNotToLie={() => proveNotToLie(nickname, accusations[nickname])} admitToLying={() => admitToLying(nickname, accusations[nickname])} />
        } else {
          return <WaitingOtherPlayersComponent />
        }
      case GameStep.Drink:
        if (sips[nickname] > 0) {
          return <DrinkComponent numberOfSips={sips[nickname]} drink={() => drink(nickname)} />
        } else {
          return <WaitingOtherPlayersComponent />
        }
    }
  }

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
          <IonRow>
            <IonCol>
              <IonItem>
                <IonButton onClick={() => revealCard()}>test</IonButton>
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonItem>
                {getControls(getStep(game)!)}
              </IonItem>
            </IonCol>
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
