import { withRouter, RouteComponentProps } from "react-router";
import { connect, ConnectedProps } from "react-redux";
import React from "react";
import { RootState } from "stores/root.reducer";
import { GameStep, getStep } from "stores/gameReducer/game.state";
import { ThunkChooseTarget, ThunkAccuse, ThunkAcceptToDrink, ThunkProveNotToLie, ThunkAdmitToLying, ThunkDrink, ThunkLeaveGame } from "stores/gameReducer/game.thunk";
import { useBeforeunload } from 'react-beforeunload'

const mapState = (state: RootState) => ({
  players: state.gameReducer.Players
  , targets: state.gameReducer.Targets
  , accusations: state.gameReducer.Accusations
  , sips: state.gameReducer.Sips
  , keepAlive: state.gameReducer.KeepAlive
  , game: state.gameReducer
  , nickName: state.matchReducer.NickName
});

const mapDispatch = {
  chooseTarget: ThunkChooseTarget
  , accuse: ThunkAccuse
  , acceptToDrink: ThunkAcceptToDrink
  , proveNotToLie: ThunkProveNotToLie
  , admitToLying: ThunkAdmitToLying
  , drink: ThunkDrink
  , leaveGame: ThunkLeaveGame
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & RouteComponentProps & {};

const GamePoc: React.FC<Props> = ({
  players
  , targets
  , accusations
  , sips
  , keepAlive
  , game
  , nickName
  , chooseTarget
  , accuse
  , acceptToDrink
  , proveNotToLie
  , admitToLying
  , drink
  , leaveGame
}) => {

  useBeforeunload(() => leaveGame());

  const currentStep = getStep(game)
  let controls

  switch (currentStep) {

    case GameStep.ChooseTarget:
      let potentialTargetsButtons = []
      for (const potentialTarget of players) {
        if (potentialTarget != nickName) {
          potentialTargetsButtons.push(<p><button onClick={() => chooseTarget(nickName, potentialTarget)}>{potentialTarget}</button></p>)
        }
      }
      controls =
        <div>
          <p>Choose your target: </p>
          {potentialTargetsButtons}
        </div>
      break

    case GameStep.Accuse:
      let targetedByList = Object.keys(targets).filter(key => targets[key] == nickName)
      if (targetedByList.length == 0) {
        controls =
          <div>
            <p>You are not targeted</p>
          </div>
      } else {
        let targetedByComponents = []
        for (const targetedBy of targetedByList) {
          targetedByComponents.push(
            <div>
              You are targeted by {targetedBy}
              <button onClick={() => accuse(targetedBy!, nickName)}>Accuse of lying</button>
              <button onClick={() => acceptToDrink(targetedBy!, nickName)}>Accept to drink</button>
            </div>
          )
        }
        controls =
          <div>
            {targetedByComponents}
          </div>
      }
      break

    case GameStep.Deny:
      let accuser = accusations[nickName]
      if (accuser != undefined) {
        controls =
          <div>
            {accuser} accuses you of lying!
              <button onClick={() => proveNotToLie(nickName, accuser!)}>I have a card</button>
            <button onClick={() => admitToLying(nickName, accuser!)}>I was lying</button>
          </div>
      } else {
        controls = <p>Nothing to do</p>
      }
      break

    case GameStep.Drink:
      if (sips[nickName] != undefined && sips[nickName] > 0) {
        controls =
          <div>
            You have to drink {sips[nickName]} sips
              <button onClick={() => drink(nickName)}>Done</button>
          </div>
      } else {
        controls = <p>You don't drink (this time)</p>
      }
      break
  }

  const objectToComponent = (object: any) => Object.keys(object).map(key => <p>{key}: {object[key].toString()}</p>)

  const setToComponent = (set: any) => [...set].map(value => <p>{value}</p>)

  let gameStateComponent =
    <div>
      <p>Players:</p>
      {setToComponent(players)}
      <p>Current step: {currentStep}</p>
      <p>Targets:</p>
      {objectToComponent(targets)}
      <p>Accusations:</p>
      {objectToComponent(accusations)}
      <p>Sips:</p>
      {objectToComponent(sips)}
      <p>KeepAlive:</p>
      {objectToComponent(keepAlive)}
    </div>

  return (
    <div>
      <h1>{nickName}</h1>
      <div>
        {controls}
      </div>
      <h1>Game state</h1>
      {gameStateComponent}
    </div>
  );
};

export default withRouter(connector(GamePoc));