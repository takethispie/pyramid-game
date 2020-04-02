import React from 'react';
import { IonButton } from '@ionic/react';

interface Props {
    numberOfSips: number
    , drink: () => void
}

const ChooseTargetComponent: React.FunctionComponent<Props> = ({ numberOfSips, drink }) => {
    if (numberOfSips > 0) {
        return (
            <div>
                <p>Tu dois boire {numberOfSips} gorgées</p>
                <IonButton onClick={drink}>Glou !</IonButton>
            </div>
        )
    } else {
        return (
            <div>
                <p>Tu n'as pas de gorgées à boire (pour ce tour-ci)</p>
            </div>
        )
    }
};

export default ChooseTargetComponent;
