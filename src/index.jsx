import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

// Override template's bootstrap js file => comment out
// import "bootstrap/dist/js/bootstrap.js";
// import "./assets/styles/sb-admin-2.scss";
// import "./assets/styles/common.scss";
// import "./assets/styles/custom-bootstrap.scss";

import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import "./components/react-notifications/_customTypes.scss";
import { Provider } from 'react-redux';
import ReduxStore from './redux/redux-store';
import { LocalizationProvider, viVN } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import 'dayjs/locale/vi';

ReactDOM.render(
  <React.StrictMode>
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={"vi"}>
      <ReactNotification />
      <Provider store={ReduxStore}>
        <App />
      </Provider>
    </LocalizationProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
