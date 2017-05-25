import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {useStrict} from 'mobx'
import DevTools from 'mobx-react-devtools'
useStrict(true)

ReactDOM.render(
  (
    <div>
      <App />
      <DevTools/>
    </div>),
  document.getElementById('root')
);
