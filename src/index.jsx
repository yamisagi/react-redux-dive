import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import store from './store/store';
import reduxToolkitStore from './store/redux-toolkit-slice';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={reduxToolkitStore}>
      <App />
    </Provider>
  </React.StrictMode>
);
