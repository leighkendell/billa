import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import DBProvider from './components/db-provider';
import { Provider as BumbagProvider } from 'bumbag';

ReactDOM.render(
  <React.StrictMode>
    <BumbagProvider>
      <DBProvider>
        <App />
      </DBProvider>
    </BumbagProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
