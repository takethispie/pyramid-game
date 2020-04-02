import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
} from '@ionic/react';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { personOutline, homeOutline, playOutline } from 'ionicons/icons';
import './Menu.css';
import { RootState } from 'stores/root.reducer';
import { ConnectedProps, connect } from 'react-redux';

interface MenuProps extends RouteComponentProps {
  selectedPage: string;
}

interface AppPage {
  url: string;
  icon: string;
  title: string;
  label: string;
}

const appPages: AppPage[] = [
  {
    title: 'home',
    url: '/home',
    icon: homeOutline,
    label: "Accueil"
  },
  {
    title: "board",
    url: "/board",
    icon: playOutline,
    label: "Board"
  }
];

const mapState = (state: RootState) => ({
  players: state.gameReducer.Players
});

const mapDispatch = {};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & RouteComponentProps & {};

const Menu: React.FC<Props> = ({ /*selectedPage,*/ players }) => {

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="inbox-list">
          <IonListHeader>Pyramid</IonListHeader>
          <IonNote>the drinking game</IonNote>
          {appPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem /*className={selectedPage === appPage.title ? 'selected' : ''}*/ routerLink={appPage.url} routerDirection="none" lines="none" detail={false}>
                  <IonIcon slot="start" icon={appPage.icon} />
                  <IonLabel>{appPage.label}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
        </IonList>

        <IonList id="labels-list">
          <IonListHeader>Joueurs</IonListHeader>
          {[...players].map((player, index) => (
            <IonItem lines="none" key={index}>
              <IonIcon slot="start" icon={personOutline} />
              <IonLabel>{player}</IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default withRouter(connector(Menu));
