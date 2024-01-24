# <span style="color: #8338ec;">Notes for React-Redux</span>

[<img src="https://redux.js.org/img/redux.svg" height="75" alt="Redux Logo" style="display: block; margin: auto;"/>](https://redux.js.org)

### <span style="color: #c1121f;"> _What is React-Redux?_</span>

**Redux** is a state management library. It is used to manage the state of an application. **Redux** provides a predictable state container for JavaScript applications. It is commonly used with libraries like React to efficiently manage the state of an application in a centralized manner. The core principles of Redux revolve around maintaining the application state in a single store, ensuring that state changes are handled through predictable actions, and employing pure functions called reducers to update the state.

Redux inspired from **Flux**.

Like Flux, Redux prescribes that you concentrate your model update logic in a certain layer of your application (“stores” in Flux, “reducers” in Redux). Instead of letting the application code directly mutate the data, both tell you to describe every mutation as a plain object called an “action”.

<a href="https://redux.js.org/understanding/history-and-design/prior-art#flux" style="text-decoration: none; font-weight: semi-bold;">But difference from **Flux** is that **Redux** assumes you never mutate your data. You can use plain objects and arrays for your state just fine, but mutating them inside the reducers is strongly <span style="color: #c1121f;">**discouraged**</span>. You should always return a new object, which can be done using the (…) object spread operator.</a>

**React-Redux** is a package which is used to connect the Redux with React. So we can understand that Redux is not only for React. We can use Redux with any other framework or library. It has one store which is a globalized state. And we can access this state from anywhere in the application. And we can update the state using 'dispatch' method.

But Important thing is that in Redux,<span style="color: #c1121f;"> _we can not directly update the state of Components_</span>. We have to dispatch an action to update the state.

And reducer is not a hook which we have in React 'useReducer'.

One more thing is 'Store' concept in Redux, gives subscription to the components. So, whenever the state changes, the components will be updated automatically.

---

### <span style="color: #c1121f;"> _**Core concepts of Redux are**_</span>

<br/>

1. <span style="color: #ef233c;">**Store**</span>

```javascript
// Create a store using 'createStore' method from 'redux' package.
// We have to pass a reducer as an argument to the createStore method.
// And we can also pass preloadedState as an argument to the createStore method.
// Which can be came from the localStorage or from the server.

const store = createStore(reducer, preloadedState);
```

<br/>

2. <span style="color: #ef233c;">**Action**</span>

```javascript
// Actions are usuallly an object which contains a type and payload.
// Type is the name of the action and payload is the data which is passed to the reducer. Payload is optional. We can pass any data to the reducer.

const action = {
  type: 'ADD',
  payload: 10,
};

// And Action Creator is a function which returns an action.
// We can use 'useDispatch' hook to dispatch an action for React.
// But we can not use 'useDispatch' hook outside of the React. So, we can use 'store.dispatch' method to dispatch an action.

dispatch(action); // We can use like this if we are using 'useDispatch' hook.
store.dispatch({ type: 'ADD', payload: 10 });
store.dispatch({ type: 'SUBTRACT', payload: 5 });

// But for better understanding, nowadays we are using React or any other framework or library with Redux.

/* 
If we are not using React or any other framework or library with Redux,
We need to use older ways because for example in React we have simple way 
to dispatch an action using 'useDispatch' hook to handle all stuffs behind the scenes. For non specific framework or library we have to use 'store.subscribe' method to subscribe the components to the store. So, we are subscribing the components to the store using 'store.subscribe' method. And we are getting the state using 'store.getState' method.
*/

// Like this👇🏻

const subscription = () => {
  console.log('State updated', store.getState());
};

store.subscribe(subscription);
```

<br/>

3. <span style="color: #ef233c;">**Reducer**</span>

```javascript
// Reducer is a function which takes the current state and action as an argument and returns the new state. Reducer is the only thing which can update the state.

// And also we can pass initial state as default value of the state.

const initialState = 0;

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD':
      return state + action.payload;
    case 'SUBTRACT':
      return state - action.payload;
    default:
      return state;
  }
};
```

<br/>

- <span style="color: #7209b7;">_**Store**</span>: Store is a globalized state which is accessible from anywhere in the application._

- <span style="color: #7209b7;">_**Action**</span>: Action is a function which returns an object. This object contains a type and payload. Type is the name of the action and payload is the data which is passed to the reducer._

- <span style="color: #7209b7;">_**Reducer**</span>: Reducer is a function which takes the current state and action as an argument and returns the new state. Reducer is the only thing which can update the state._

<br/>

---

## <span style="color: #c1121f;">NOTE</span> : Redux createStore() is (not) deprecated

**React Redux** team now recommends the usage of an extra package called Redux Toolkit and another way of creating the Redux store. But, the createStore() method is not deprecated. It is still available in the Redux package.

---
