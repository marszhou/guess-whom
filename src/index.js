import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import {Provider} from 'mobx-react'
import {useStrict} from 'mobx'

import GameStore from './stores/Game'

import DevTools from 'mobx-react-devtools'
useStrict(true)

let game = new GameStore()

ReactDOM.render(
  (
    <div>
      <Provider game={game}>
        <App />
      </Provider>
      <DevTools/>
    </div>),
  document.getElementById('root')
);
