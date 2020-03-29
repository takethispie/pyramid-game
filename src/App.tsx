import Menu from './components/Menu';
import React, { useState } from 'react';
import { IonApp, IonRouterOutlet, IonSplitPane } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
/* Theme variables */
import "./theme/variables.css";

import Board from 'pages/Board';
import Home from 'pages/Home';
import GamePoc from 'pages/GamePoc';
import { Provider } from 'react-redux';
import store from 'stores';

const App: React.FC = () => {

  const [selectedPage, setSelectedPage] = useState('');

  return (
    <Provider store={store}>
      <IonApp>
        <IonReactRouter>
          <IonSplitPane contentId="main">
            <Menu selectedPage={selectedPage} />
            <IonRouterOutlet id="main">
              <Route path="/board" render={() => {
                return <Board />;
              }} />
              <Route path="/home" render={() => {
                return <Home />;
              }} />
              <Route path="/" render={() => <Redirect to="/home" />} exact={true} />
              <Route path="/game-poc" render={() => {
                return <GamePoc />;
              }} />
            </IonRouterOutlet>
          </IonSplitPane>
        </IonReactRouter>
      </IonApp>
    </Provider>
  );
};

export default App;
