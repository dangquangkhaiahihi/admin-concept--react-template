import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

import "bootstrap/dist/js/bootstrap.js";
import "./assets/styles/sb-admin-2.scss";
import "./assets/styles/common.scss";
import "./assets/styles/custom-bootstrap.scss";

import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import "./components/react-notifications/_customTypes.scss";
import { Provider } from 'react-redux';
import ReduxStore from './redux/redux-store';

ReactDOM.render(
  <React.StrictMode>
    <ReactNotification />
    <Provider store={ReduxStore}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
