import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './counter-slice';
import authReducer from './auth-slice';

const reduxToolkitStore = configureStore({
  reducer: { counter: counterReducer, auth: authReducer },
});

export default reduxToolkitStore;
