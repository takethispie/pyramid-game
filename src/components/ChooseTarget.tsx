import React from 'react';
import { IonButton } from '@ionic/react';

interface Props {
    players: string[]
    , currentTarget: string
    , chooseTarget: (target: string) => void
}

const ChooseTargetComponent: React.FunctionComponent<Props> = ({ players, currentTarget, chooseTarget }) => {
    let targetButtons = []
    for (const player of players) {
        const color = player === currentTarget ? 'danger' : 'primary'
        targetButtons.push(
            <IonButton
                color={color}
                onClick={() => chooseTarget(player)}>
                {player}
            </IonButton>
        )
    }
    return (
        <div>
            <p>Qui fais-tu boire ?</p>
            {targetButtons}
        </div>
    )
};

export default ChooseTargetComponent;
