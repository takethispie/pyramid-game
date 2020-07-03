import React from 'react';
import { GameStep } from 'stores/gameReducer/game.state';
import ChooseTargetComponent from "components/ChooseTarget";
import AccuseComponent from "components/Accuse"
import WaitingOtherPlayersComponent from "components/WaitingOtherPlayers"
import DenyComponent from "components/Deny"
import DrinkComponent from "components/Drink"

interface Props {
	step: GameStep,
	players: Set<string>,
	targets: { [id: string]: string },
	accusations: { [id: string]: string },
	sips: { [id: string]: number },
	keepAlive: { [id: string]: Date },
	nickname: string,
	acceptToDrink(playerWhoTargets: string, nickname: string): void,
	chooseTarget(nickname: string, player: string): void,
	proveNotToLie(nickname: string, accusation: string): void,
	accuse(playerWhoTargets: string, nickname: string): void,
	admitToLying(nickname: string, accusation: string): void,
	drink(nickname: string): void
}

const PlayerActions: React.FC<Props> = ({ step, players, targets, accusations, sips, keepAlive, 
	nickname, acceptToDrink, chooseTarget, proveNotToLie, accuse, admitToLying,  drink}) => {
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
				return <AccuseComponent playerWhoTargets={playerWhoTargets} acceptToDrink={() => acceptToDrink(playerWhoTargets, nickname)} 
						accuseOfLying={() => accuse(playerWhoTargets, nickname)} />
			} else {
				return <WaitingOtherPlayersComponent />
			}
		case GameStep.Deny:
			if (accusations[nickname] != undefined) {
				return <DenyComponent playerWhoAccuses={accusations[nickname]} proveNotToLie={() => proveNotToLie(nickname, accusations[nickname])} 
						admitToLying={() => admitToLying(nickname, accusations[nickname])} />
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
};

export default PlayerActions;
