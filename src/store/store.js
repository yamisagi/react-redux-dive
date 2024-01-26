import { createStore } from 'redux';
import counterReducer from '../reducer/counter-reducer';

const store = createStore(counterReducer);


export default store;
