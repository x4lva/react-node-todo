import React from 'react';
import ReactDOM from 'react-dom';
import App from './app/App';
import "./assets/css/bootstarp/bootstrap.min.css"
import store from "./redux";
import { Provider } from "react-redux";

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);