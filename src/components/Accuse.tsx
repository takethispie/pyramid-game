import React from 'react';
import { IonButton } from '@ionic/react';

interface Props {
    playerWhoTargets: string
    , acceptToDrink: () => void
    , accuseOfLying: () => void
}

const ChooseTargetComponent: React.FunctionComponent<Props> = ({ playerWhoTargets, acceptToDrink, accuseOfLying }) => {
    return (
        <div>
            <p>{playerWhoTargets} te fait boire ! Que fais-tu ?</p>
            <IonButton onClick={acceptToDrink}>Je vais boire...</IonButton>
            <IonButton onClick={accuseOfLying}>{playerWhoTargets} ment !</IonButton>
        </div>
    )
};

export default ChooseTargetComponent;
