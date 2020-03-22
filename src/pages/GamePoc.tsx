import { withRouter, RouteComponentProps } from "react-router";
import { connect, ConnectedProps } from "react-redux";
import React from "react";
import { RootState } from "stores/root.reducer";
import { GameStep } from "stores/gameReducer/game.state";
import { ThunkChooseTarget, ThunkAccuse, ThunkAcceptToDrink, ThunkProveNotToLie, ThunkAdmitToLying, ThunkDrink } from "stores/gameReducer/game.thunk";

const mapState = (state: RootState) => ({
  players: state.gameReducer.Players
  , currentStep: state.gameReducer.CurrentStep
  , targets: state.gameReducer.Targets
  , accusations: state.gameReducer.Accusations
  , sips: state.gameReducer.Sips
});

const mapDispatch = {
  chooseTarget: ThunkChooseTarget
  , accuse: ThunkAccuse
  , acceptToDrink: ThunkAcceptToDrink
  , proveNotToLie: ThunkProveNotToLie
  , admitToLying: ThunkAdmitToLying
  , drink: ThunkDrink
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & RouteComponentProps & {};

const GamePoc: React.FC<Props> = ({
  players
  , currentStep
  , targets
  , accusations
  , sips
  , chooseTarget
  , accuse
  , acceptToDrink
  , proveNotToLie
  , admitToLying
  , drink
}) => {

  let playerControls = []
  for (const player of players) {
    let controls

    switch (currentStep) {

      case GameStep.ChooseTarget:
        let potentialTargetsButtons = []
        for (const potentialTarget of players) {
          if (potentialTarget != player) {
            potentialTargetsButtons.push(<p><button onClick={() => chooseTarget(player, potentialTarget)}>{potentialTarget}</button></p>)
          }
        }
        controls =
          <div>
            <p>Choose your target: </p>
            {potentialTargetsButtons}
          </div>
        break

      case GameStep.Accuse:
        let targetedByList = Object.keys(targets).filter(key => targets[key] == player)
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
                <button onClick={() => accuse(targetedBy!, player)}>Accuse of lying</button>
                <button onClick={() => acceptToDrink(targetedBy!, player)}>Accept to drink</button>
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
        let accuser = accusations[player]
        if (accuser != undefined) {
          controls =
            <div>
              {accuser} accuses you of lying!
              <button onClick={() => proveNotToLie(player, accuser!)}>I have a card</button>
              <button onClick={() => admitToLying(player, accuser!)}>I was lying</button>
            </div>
        } else {
          controls = <p>Nothing to do</p>
        }
        break

      case GameStep.Drink:
        if (sips[player] != undefined && sips[player] > 0) {
          controls =
            <div>
              You have to drink {sips[player]} sips
              <button onClick={() => drink(player)}>Done</button>
            </div>
        } else {
          controls = <p>You don't drink (this time)</p>
        }
        break
    }
    playerControls.push(
      <div>
        <h2>{player}</h2>
        {controls}
      </div>
    )
  }

  const objectToComponent = (object: any) => Object.keys(object).map(key => <p>{key}: {object[key]}</p>)

  const setToComponent = (set: any) => [...set].map(value => <p>{value}</p>)

  let gameStateComponent =
    <div>
      <p>Current step: {currentStep}</p>
      <p>Targets:</p>
      {objectToComponent(targets)}
      <p>Accusations:</p>
      {objectToComponent(accusations)}
      <p>Sips:</p>
      {objectToComponent(sips)}
    </div>

  return (
    <div>
      <h1>Players</h1>
      <div>
        {playerControls}
      </div>
      <h1>Game state</h1>
      {gameStateComponent}
    </div>
  );
};

export default withRouter(connector(GamePoc));