const redux = require('redux');

//! NOTES.md 29. 99. comment

//? As we can see, non-React projects can also use Redux.
//? Redux is a state management library. Not a React library.

//* We need to install redux library.
//* npm install redux
//* Then we can import it. (See above)

//* Redux has a createStore function. 
//* We can use it to create a store.

//* We can create a reducer function. It is regular JavaScript function. Not a React function.
//* It takes two arguments. First one is the state. Second one is the action. 
//* It returns the new state. It must return the new state. It must not mutate the old state.
//* We can use the spread operator to copy the old state. Then we can change the state.

//* We can create an initial state. It is a JavaScript object. It is usually an object. But it can be anything.
//* We can use it as the default value of the state argument of the reducer function.

//* Then we have subscribe function. It is a function. It takes no argument.
//* It gets the state from the store. Then it logs the state to the console.

//* Then we have store.subscribe(subscribe). It adds listener to the store.
//* So when the state changes, the listener is called. Then the listener calls the subscribe function.
//* If we want to get the state from the store, we can use store.getState().

//* Then we have store.dispatch({ type: INCREASE }). 
//* It dispatches an action. So the reducer function is called. After that state changes.

//? It is that simple. We can use Redux in non-React projects. 

//? In the end, This example shows how Redux works. 


const initialState = {
  counter: 0,
};
const INCREASE = 'INCREASE';
const DECREASE = 'DECREASE';

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case INCREASE:
      return {
        ...state,
        counter: state.counter + 1,
      };
    case DECREASE:
      return {
        ...state,
        counter: state.counter - 1,
      };
    default:
      return state;
  }
};

const store = redux.createStore(reducer);

const subscribe = () => {
  const state = store.getState();
  console.log(state);
};

store.subscribe(subscribe);

store.dispatch({ type: INCREASE });

store.dispatch({ type: DECREASE });