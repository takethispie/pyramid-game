import React from 'react';
import { IonButton } from '@ionic/react';

interface Props {
    playerWhoAccuses: string
    , proveNotToLie: () => void
    , admitToLying: () => void
}

const ChooseTargetComponent: React.FunctionComponent<Props> = ({ playerWhoAccuses, proveNotToLie, admitToLying }) => {
    return (
        <div>
            <p>{playerWhoAccuses} t'accuse de mentir !</p>
            <IonButton onClick={proveNotToLie}>Je ne mens pas</IonButton>
            <IonButton onClick={admitToLying}>Je l'admets, j'ai menti</IonButton>
        </div>
    )
};

export default ChooseTargetComponent;
