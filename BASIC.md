# <span style="color: #8338ec;">React-Redux Basic Notes</span>

[<img src="https://redux.js.org/img/redux.svg" height="75" alt="Redux Logo" style="display: block; margin: auto;"/>](https://redux.js.org)

### <span style="color: #c1121f;"> _What is Redux?_</span>

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
to dispatch an action using 'useDispatch' hook to handle all stuffs behind the scenes. 

For non specific framework or library we have to use 'store.subscribe' method to subscribe the components to the store. 

So, we are subscribing the components to the store using 'store.subscribe' method. And we are getting the state using 'store.getState' method.

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

//! IMPORTANT: We usually use Object as a state. Object is a reference type. So, we have to return a new object. We never mutate the state, we always return a new state.

// Objects & Arrays are working in HEAP. But Primitives are working in STACK.
// Thats the difference between them. Short explanation is, HEAP is a big memory space. An Object variable knows the pointer which is in STACK.
// And this pointer is pointing to address of the Object in HEAP. So, when we create a new Object, we are creating a new pointer in STACK but it still points to the same address in HEAP.

// So for example take a look at this 👇🏻

// https://gist.github.com/yamisagi/cf858327ec4690344b79b836921c3e27

const initialState = {
  counter: 0,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD':
      // We are returning a new object here. Because we never mutate the state.
      return {
        // We are spreading the state here.
        // Because we could have more than one state in a Object and we want to copy all of them.
        ...state,
        counter: state.counter + action.payload,
      };
    case 'SUBTRACT':
      return {
        ...state,
        counter: state.counter - action.payload,
      };
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

### <span style="color: #c1121f;"> _**How to use Redux in React?**_</span>

<br/>

As we see in the above example, we have to create a store using '**createStore**' method from '**redux**' package. And we have to pass a reducer as an argument to the createStore method. And we can also pass **preloadedState** as an argument to the createStore method. Which can be came from the localStorage or from the server.

---

And we have to wrap our application with '**Provider**' component from 'react-redux' package. And we have to pass the store as a prop to the '**Provider**' component. Usually we wrap our **Provider** component with the **root** component of our application.

```javascript
import { Provider } from 'react-redux';

// Can be imported from the same file or from another file.

import reducer from './reducer';

const store = createStore(reducer, preloadedState);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
```

---

And we have to use '**useSelector**' hook to get the state from the store. And we have to use '**useDispatch**' hook to dispatch an action to the reducer.

```javascript
import { useSelector, useDispatch } from 'react-redux';

const App = () => {
  // useSelector is a hook which is used to get the state from the store.
  const state = useSelector((state) => state.counter);

  // useDispatch is a hook which is used to dispatch an action to the reducer.
  const dispatch = useDispatch();

  //! Types of actions are coming from the reducer that we added above. (ADD, SUBTRACT)

  //! Payload is the data which is passed to the reducer. (10, 5)

  return (
    <div>
      <h1>{state.counter}</h1>

      {/* dispatch an action to the reducer */}

      <button onClick={() => dispatch({ type: 'ADD', payload: 10 })}>
        Add
      </button>

      <button onClick={() => dispatch({ type: 'SUBTRACT', payload: 5 })}>
        Subtract
      </button>
    </div>
  );
};
```

---

<br/>

### <span style="color: #c1121f;"> _**How to use Redux in Class-based Components?**_</span>

<br/>

We can use '**connect**' method from 'react-redux' package to connect the Redux with Class-based Components. Because we can not use hooks in Class-based Components.

---

- For example, we have a class-based component called '**Counter**'. And we have to **connect** this component with **Redux**.

```javascript

import { connect } from 'react-redux';

class Counter extends React.Component {

  const handleAdd = () => {
   // If we were using 'dispatch' in mapDispatchToProps, we could use like this 👇🏻

   //* this.props.dispatch({ type: 'ADD', payload: 10 });

   // But we are using 'increment' in mapDispatchToProps, so we have to use like this 👇🏻

    this.props.increment();
};

  const handleSubtract = () => {

    // Same as above 👆🏻
    // this.props.dispatch({ type: 'SUBTRACT', payload: 5 });

    this.props.decrement();
  };

  render() {
    return (
      <div>
        <h1>{this.props.state.counter}</h1>
        <button onClick={this.handleAdd.bind(this)}>
          Add
        </button>

        <button onClick={this.handleSubtract.bind(this)}>
          Subtract
        </button>
      </div>
    );
  }
}

// mapStateToProps is a function which is used to get the state from the store.

const mapStateToProps = (state) => {
  return {
    state: state.counter,
  };
};

// mapDispatchToProps is a function which is used to dispatch an action to the reducer.

const mapDispatchToProps = (dispatch) => {
  return {
    // dispatch: dispatch, // We can use like this.
    // Or we can use like this 👇🏻
    // This is cleaner way to use dispatch to me for simple applications.
    increment: () => dispatch({ type: 'ADD', payload: 10 }),
    decrement: () => dispatch({ type: 'SUBTRACT', payload: 5 }),
  };
};


// connect is a method which is used to connect the Redux with Class-based Components. And it takes two arguments.

// First one is mapStateToProps and second one is mapDispatchToProps.

// So first one is used to get the state from the store. And second one is used to dispatch an action to the reducer.

// Like useSelector and useDispatch hooks in React.

// This usage is called 'Decorator' in React or Higher Order Component (HOC).

// We can use like this 👇🏻

//? How this HOC works ?
//? It takes the Counter component as an argument
//? And returns the new component with the props which we passed to the connect method.

export default connect(mapStateToProps,mapDispatchToProps)(Counter);

```

---

<br/>

### <span style="color: #c1121f;"> _**How to use Redux Toolkit?**_</span>

<br/>

Redux Toolkit is a package which is created by the Redux team. It is a package which is used to simplify the Redux. Instead of using '**createStore**' method from '**redux**' package, we can use '**configureStore**' method from '**@reduxjs/toolkit**' package. And we can use '**createSlice**' method from '**@reduxjs/toolkit**' package to create a reducer.

---

- For example, we have two state in our application, '**counter**' and '**auth**'.
- We can create as much as state we want in Redux Toolkit. But we have to create a slice for each state.

  ```javascript
  // We can use 'createSlice' method from '@reduxjs/toolkit' package to create a reducer.
  // And we can use 'configureStore' method from '@reduxjs/toolkit' package to create a store.

  import { createSlice } from '@reduxjs/toolkit';

  import { configureStore } from '@reduxjs/toolkit';

  // The 'createSlice' method takes an object as an argument.
  // And this object contains three properties, name, initialState and reducers.
  // IMPORTANT: We should give a name to the slice.
  // Because Redux Toolkit uses the name to auto-generate action type strings.
  // And one thing is that we don't have to use 'return' keyword in the reducers.
  // Because Redux Toolkit uses 'immer' inside of it. So, we can mutate the state directly.
  // Behind the scenes, Redux Toolkit is calling 'produce' from 'immer'
  // And passing in the current state and the action object to create a new state.

  const counterSlice = createSlice({
    name: 'counter',
    initialState: {
      counter: 0,
    },
    reducers: {
      increment: (state, action) => {
        state.counter += action.payload;
      },
      decrement: (state, action) => {
        state.counter -= action.payload;
      },
    },
  });

  const authSlice = createSlice({
    name: 'auth',
    initialState: {
      isAuth: false,
    },
    reducers: {
      login: (state) => {
        state.isAuth = true;
      },
      logout: (state) => {
        state.isAuth = false;
      },
    },
  });

  // We can use 'configureStore' method to create a store.

  const store = configureStore({
    reducer: {
      counter: counterSlice.reducer,
      auth: authSlice.reducer,
    },
  });

  // And we can export the actions from the reducers.

  export const counterActions = counterSlice.actions;
  export const authActions = authSlice.actions;

  export default store;
  ```

---

- After creating our Toolkit store, same as above, we are passing the store as a prop to the '**Provider**' component. And we are wrapping our application with '**Provider**' component.

  ```javascript
  import { Provider } from 'react-redux';

  import store from './store';

  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
  );
  ```

---

- Let's secure our **App** component with '**auth**' state. If the user is not authenticated,
  we will show Login page. If the user is authenticated, we will show Counter page.

  ```javascript
  import { useSelector } from 'react-redux';
  import Login from './Login';

  const App = () => {
    const { isAuth } = useSelector((state) => state.auth);

    return (
      <div>
        {!isAuth && <Login />}
        {isAuth && <Counter />}
      </div>
    );
  };

  export default App;
  ```


---

- And we can use '**useSelector**' hook to get the state from the store. And we can use '**useDispatch**' hook to dispatch an action to the reducer.

  ```javascript
  import { useSelector, useDispatch } from 'react-redux';

  import { counterActions, authActions } from './store';

  const App = () => {
    // We are using destructuring here.
    // Because we have more than one state in the store. (counter, auth)

    const { counter } = useSelector((state) => state.counter);

    const dispatch = useDispatch();

    // As we see here we are using 'counterActions' which we exported from the store.
    // We are not creating type, just using 'counterActions.increment' and 'counterActions.decrement'.
    // And we are passing payload as an argument to it.
    // We can use like this 👇🏻

    const handleAdd = () => {
      dispatch(counterActions.increment(10));
    };

    const handleSubtract = () => {
      dispatch(counterActions.decrement(5));
    };

    const handleLogout = () => {
      dispatch(authActions.logout());
    };

    return (
      <div>
        <p>Very Secure App 🔐</p>
        <h1>{counter}</h1>
        <button onClick={handleAdd}>Add</button>
        <button onClick={handleSubtract}>Subtract</button>
        <button onClick={handleLogout}>Logout</button>
      </div>
    );
  };
  ```

---

Let's create a simple Login page with Redux Toolkit.

```javascript
import { useSelector, useDispatch } from 'react-redux';

import { authActions } from './store';

const Login = () => {
  const { isAuth } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(authActions.login());
  };

  return (
    <form onSubmit={handleLogin}>
      <label htmlFor='email'>Email</label>
      <input type='email' id='email' />
      <label htmlFor='password'>Password</label>
      <input type='password' id='password' />
      <button type='submit'>Login</button>
    </form>
  );
};

export default Login;
```

---

<br/>
