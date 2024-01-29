# <span style="color: #8338ec;">React-Redux Advanced Notes</span>

[<img src="https://redux.js.org/img/redux.svg" height="75" alt="Redux Logo" style="display: block; margin: auto;"/>](https://redux.js.org)

### <span style="color: #c1121f;"> **_Asynchronous Actions & Side Effects in Redux_**</span>

- When we use Redux we must provide a pure, side-effect free and synchronous function to the reducer. Because of this, we can't make API calls or dispatch actions asynchronously. We can only dispatch actions synchronously.

<br/>

| Input              | Output    |
| ------------------ | --------- |
| Old state + Action | New state |

<br/>

### <span style="color: #c1121f;"> **_What is the Middleware?_**</span>

- Middleware is a layer of software placed between the moment an action is dispatched and the moment the reducer responds to that action in Redux. Middleware is used to extend, customize, and handle side effects in Redux operations.

- Middleware can process or modify actions before they reach the reducers, typically dealing with various operations such as asynchronous tasks, logging, analytics tracking, authentication checks, and more.

- In Redux, middleware is employed to track a series of actions and handle different scenarios in the application. For instance, middleware like Redux Saga or Redux Thunk is utilized to manage asynchronous tasks. Through the use of such middleware, updating the application state and handling asynchronous operations becomes more manageable.

- We can think **middleware** as pipes,

<br/>

```javascript
// Redux middleware

const middleware = (store) => (next) => (action) => {
  // Middleware logic

  // 'store' is the Redux store

  // 'next' is a function that calls the next middleware or the reducer
  next(action);

  // 'action' is the action that is dispatched
};
```



### <span style="color: #c1121f;"> **_So how do we handle asynchronous actions in Redux?_**</span>

  - We can use our side effects in the component itself. We can make API calls in the component and then dispatch the action to the reducer. So Redux itself doesn't know about the side effects.

    - For example, we want to post a new post to the server. And in our reducer,
      we have notification status. So when we post a new post, we want to show a notification to the user. So we can make an API call in the component and then dispatch the action to the reducer. So the reducer will update the state and then we can show the notification to the user.

      <br/>

    ```javascript
    // slice.js

    const initialState = {
      posts: [],
      notification: {
        status: "idle",
        message: "",
      },
    };

    const postSlice = createSlice({
      name: "posts",
      initialState,
      reducers: {
        showNotification(state, action) {
          state.notification.status = action.payload.status;
          state.notification.message = action.payload.message;
        },
        addPost(state, action) {
          state.posts.push(action.payload);
        },
        // Other reducers
      },
    });

    export const { showNotification, addPost } = postSlice.actions;
    ```

    ```javascript
    // AnotherComponent.js

    import { useDispatch, useSelector } from "react-redux";
    import { showNotification } from "./postsSlice";

    //? We can also add a variable to initially don't show the notification
    //? to the user. And don't make the API call when the component is rendered.

    const AnotherComponent = () => {
      const dispatch = useDispatch();
      const { notification } = useSelector((state) => state.posts);
      const { posts } = useSelector((state) => state.posts);

      useEffect(() => {
       const sendPostData = async () => {
        dispatch(
          showNotification({
            status: "pending",
            message: "Sending post data...",
          })
        );

        const response = await fetch(
          "https://jsonplaceholder.typicode.com/posts",
          {
            method: "POST",
            body: JSON.stringify(posts),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        dispatch(
          showNotification({
            status: "success",
            message: "Successfully sent post data!",
          })
        );
      };

      sendPostData().catch((error) => {
        dispatch(
          showNotification({
            status: "error",
            message: error.message,
          })
        );
      });

    }
     [posts, dispatch]);
    };

    // Code ...

    export default AnotherComponent;
    ```

    ``` javascript
    // PostForm.js
    
    import { useDispatch } from "react-redux";
    import { postAdded } from "./postsSlice";

    // In another component we can post a new post to the server.

    const handleSubmit = (event) => {
      event.preventDefault();

      // Maybe we can add some validation here

      dispatch(
        postAdded({
          title: enteredTitle,
          content: enteredContent,
        })
      );
    };
    ```

    ```javascript
    // Notification.js
    
    import { useDispatch, useSelector } from "react-redux";
    import { showNotification } from "./postsSlice"; 

    // In Notification component we can show the notification to the user
    // Based on the notification status etc.

    const Notification = () => {
      const dispatch = useDispatch();
      const { status: notificationStatus, message } = useSelector((state) => state.posts);

      const statusClass = notificationStatus || "pending";

      const hideNotification = () => {
        dispatch(
          showNotification({
            status: "idle",
            message: "",
          })
        );
      };

      return (
        <section className={`notification ${statusClass}`} onClick={hideNotification}>
          <h2>{message}</h2>
        </section>
      );
    };
    ```
    <br/>

    - The idea behind here is when the form is submitted, an action is dispatched to the reducer. Subsequently, the useEffect hook is triggered by the state change, initiating an API call. Following the API call, another action is dispatched to the reducer to update the notification state. As a result, the reducer modifies the state, allowing for the display of notifications to the user.

    - With this approach, we keep data transformation logic in the reducer and side effects in the component.

    - But this is not a good approach because always it is not simple like this. Sometimes we need to make multiple API calls and then dispatch the action to the reducer. So we need to write a lot of code in the component. This is not a good practice.
  
  - _Another option we can use write our action creator as a_ **thunk**.
  
    - What is a thunk?

      > A thunk is a function that wraps an expression to delay its evaluation. In Redux, thunks are used to delay dispatching an action until a later time. They are useful for when we need to dispatch an action in response to a network request.

      - So we can write our action creator as a thunk. And then we can dispatch the thunk to the store. And then the thunk will make the API call and then dispatch the action to the reducer. So the reducer will update the state.

      <br/>

      ```javascript

      // postsSlice.js

      import { createSlice } from "@reduxjs/toolkit";

      const initialState = {
        posts: [],
        notification: {
          status: "idle",
          message: "",
        },
      };

      const postSlice = createSlice({
        name: "posts",
        initialState,
        reducers: {
          showNotification(state, action) {
            state.notification.status = action.payload.status;
            state.notification.message = action.payload.message;
          },
          addPost(state, action) {
            state.posts.push(action.payload);
          },
          // Other reducers
        },
      });

      export const sendPostData = (postData) => {
        return async (dispatch) => {
          dispatch(
            showNotification({
              status: "pending",
              message: "Sending post data...",
            })
          );

          const sendRequest = async () => {
            const response = await fetch(
              "https://jsonplaceholder.typicode.com/posts",
              {
                method: "POST",
                body: JSON.stringify(postData),
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            if (!response.ok) {
              throw new Error("Something went wrong!");
            }
          };

          try {
            await sendRequest();

            dispatch(
              showNotification({
                status: "success",
                message: "Successfully sent post data!",
              })
            );
          } catch (error) {
            dispatch(
              showNotification({
                status: "error",
                message: error.message,
              })
            );
          }
        };
      };

      export const { showNotification, addPost } = postSlice.actions;

      export default postSlice.reducer;
      ```

      ```javascript

      // AnotherComponent.js

      import { useDispatch, useSelector } from "react-redux";

      import { sendPostData } from "./postsSlice";

      // ...

      const { posts } = useSelector((state) => state.posts);

      useEffect(() => {
        dispatch(sendPostData(posts));
      }, [posts, dispatch]);

      // ...
      ```

      - With this approach, we keep data transformation logic in the reducer and side effects in the action creator. And keep our component lean and clean.

  - What is the **_Redux-Thunk_** library?
    - In official **Redux** documentation, they recommend using the **Redux-Thunk** library to write our action creators as thunks.

    - **Redux-Thunk** is a middleware that allows us to write action creators that return a function instead of an action. The thunk can be used to delay the dispatch of an action, or to dispatch only if a certain condition is met. The inner function receives the store methods dispatch and getState as parameters.

    - But in **Redux-Toolkit**, we don't need to use the **Redux-Thunk** library. Because Redux-Toolkit has built-in support for writing action creators as thunks. So we can use the Redux-Toolkit to write our action creators as thunks.

    - We add applyMiddleware(thunk) to the createStore function. So we can use the Redux-Thunk library to write our action creators as thunks like we did in the previous example.
  
    <br/>

      ```javascript

      // store.js

      import { createStore, applyMiddleware } from 'redux';
      import thunk from 'redux-thunk';
      import postsReducer from './reducers/postsReducer';

      const store = createStore(postsReducer, applyMiddleware(thunk));

      export default store;

      ```

    - What is the **_createAsyncThunk()_** function?

      - Redux-Toolkit has a **_createAsyncThunk()_** function. We can use this function to write our action creators as thunks. 
      - It takes **two** arguments. The first argument is the name of the thunk. And the second argument is a function that returns a promise. And the promise will be resolved with the value that we want to dispatch to the reducer.
      - When we use the **_createAsyncThunk()_** function, it will automatically dispatch three actions for us. The first action is a pending action. The second action is a fulfilled action. And the third action is a rejected action. So we don't need to dispatch these actions manually.
      - And we should add the **_extraReducers_** property to the slice. And then we can add the **_builder.addCase()_** method to the **_extraReducers_** property. And then we can add the **_action type_** and the **_callback function_** to the **_builder.addCase()_** method. 
      - So when the action is dispatched, the callback function will be executed.
      
      <br/>

      ```javascript

      // postsSlice.js

      import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

      const initialState = {
        posts: [],
        notification: {
          status: "idle",
          message: "",
        },
      };

      export const sendPostData = createAsyncThunk(
        "posts/sendPostData",
        async (postData) => {
          const response = await fetch(
            "https://jsonplaceholder.typicode.com/posts",
            {
              method: "POST",
              body: JSON.stringify(postData),
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error("Something went wrong!");
          }
        }
      );

      const postSlice = createSlice({
        name: "posts",
        initialState,
        reducers: {
          // Other reducers
        }
        extraReducers: (builder) => {
          builder.addCase(sendPostData.pending, (state, action) => {
            state.notification.status = "pending";
            state.notification.message = "Sending post data...";
          });
          builder.addCase(sendPostData.fulfilled, (state, action) => {
            state.notification.status = "success";
            state.notification.message = "Successfully sent post data!";
          });
          builder.addCase(sendPostData.rejected, (state, action) => {
            state.notification.status = "error";
            state.notification.message = action.error.message;
          });
        },
      });

      ```

- What is **_Redux-Saga_** library?
    - Redux-Saga is a library that aims to make application side effects (i.e. asynchronous things like data fetching and impure things like accessing the browser cache) easier to manage, more efficient to execute, easy to test, and better at handling failures.
    - Redux-Saga uses an ES6 feature called Generators to make those asynchronous flows easy to read, write and test.

    - But in Redux-Toolkit, we don't need to use the Redux-Saga library. Because Redux-Toolkit has built-in support for writing action creators as thunks. So we can use the Redux-Toolkit to write our action creators as thunks.

    - For example, 

      - First, we need to apply middleware to the store. We can use the **_applyMiddleware()_** function to apply middleware to the store. We can import **_createSagaMiddleware()_** function from the **_redux-saga_** library. 
      
      - Then we can use the **_sagaMiddleware.run()_** function to run our saga. We can import **_rootSaga_** from the **_sagas_** folder. And then we can use the **_sagaMiddleware.run()_** function to run our saga.

      <br/>

      ```javascript

      // store.js

      import { createStore, applyMiddleware } from "redux";
      import createSagaMiddleware from "redux-saga";
      import postsReducer from "./reducers/postsReducer";
      import { rootSaga } from "./sagas";


      const sagaMiddleware = createSagaMiddleware();

      const store = createStore(postsReducer, applyMiddleware(sagaMiddleware));

      sagaMiddleware.run(rootSaga);

      export default store;

      ```

    - In sagas folder, we can create a **_index.js_** file. And then we can create a **_rootSaga_** function. And then we can use the **_takeEvery()_** function to write our action creators as thunks. And then we can add the **_action type_** and the **_callback function_** to the **_takeEvery()_** function.

      <br/>

      ```javascript

      // sagas/index.js

      import { call, put, takeEvery } from 'redux-saga/effects';

      function* sendPostDataSaga(action) {
        try {
          yield put({
            type: 'PENDING',
          });

          const response = yield call(fetch, 'https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            body: JSON.stringify(action.payload),
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error('Something went wrong!');
          }

          yield put({
            type: 'SUCCESS',
          });
        } catch (error) {
          yield put({
            type: 'ERROR',
            error: error.message,
          });
        }
      }

      function* watchSendPostData() {
        yield takeEvery('SEND_POST', sendPostDataSaga);
      }

      export function* rootSaga() {
        yield watchSendPostData();
        // Other sagas can be added here
      }

      ```

  - So when the action is dispatched, the callback function will be executed.
    
    <br/>

    ```javascript

    // SomeComponent.js

    import { useDispatch, useSelector } from "react-redux";

    // ...

    const dispatch = useDispatch();

    const handleSubmit = (event) => {
      event.preventDefault();

  
      // When the form is submitted, we can dispatch the action to the store.
      // And because we listen to 'SEND_POST' action in the rootSaga function,
      // the sendPostDataSaga function will be executed.
      dispatch('SEND_POST', payload: postData);

    }

    // ...

    ```

    <br/>
    
  - Shortly, what we did here is,
    - We passed the **_rootSaga_** function to the **_sagaMiddleware.run()_** function. So the **_rootSaga_** function will be executed when the store is created.
    - And then we created a **_sendPostDataSaga_** function. That function will be executed when the action is dispatched.
    - We used the call, put, and takeEvery functions from the redux-saga/effects library.
      - The **_call_** function is used to initiate asynchronous processes, typically to make API calls.
      - The **_put_** function is used to dispatch an action to the reducer, effectively sending an action to the Redux store.
      - The **_takeEvery_** function is used to create a domain that listens for a specific action type and runs a specified function whenever that action type is triggered.
    - We used the **_yield_** keyword to wait for the asynchronous process to complete before moving on to the next line of code.
    - And we created a **_rootSaga_** function. Then passed the **_sendPostDataSaga_** function to the **_takeEvery()_** function. So the **_sendPostDataSaga_** function will be executed when the action is dispatched.

    - What is the difference between **_takeEvery()_** and **_takeLatest()_** functions?
      - The **_takeEvery()_** function will run the saga every time the action is dispatched. So if we dispatch the action multiple times, the saga will run multiple times.
      - The **_takeLatest()_** function will run the saga only once. So if we dispatch the action multiple times, the saga will run only once. And it will cancel the previous saga. So we can use the **_takeLatest()_** function to prevent multiple API calls.

- What is the best solution for handling asynchronous actions in Redux? Redux-Thunk or Redux-Saga?
  - There is no best solution for handling asynchronous actions in Redux. It depends on the project. If we have a simple project, we can use Redux-Thunk. If we have a complex project, we can use Redux-Saga. 
  - Redux-Saga is a great tool for managing complex asynchronous actions in Redux. But it has a learning curve. So if we have a simple project, we can use Redux-Thunk. Because Redux-Thunk is simple and easy to use. 
  - Redux-Thunk is easy to use. But it has some limitations. For example, we can't cancel the previous API call. So if we dispatch the action multiple times, the API call will be made multiple times. But in Redux-Saga, we can cancel the previous API call. So if we dispatch the action multiple times, the API call will be made only once. And etc.
  - So, choose the best solution for your project based on your project requirements.

<br/>

### <span style="color: #c1121f;"> **_Conclusion_**</span>

> * **Redux** & **@Redux-Toolkit** is a great tool for managing complex state in our applications.
> * It based on the **Flux** architecture. It has a **single source of truth**, **unidirectional data flow**, and **immutable state**.
> * **Redux** is a state management library. It has no any **_dependencies_**. So we can use it with any UI library or framework.
> * Redux is a predictable state container. So we can predict what will happen in our application.
> * Redux has **three main principles**. Single source of truth, state is read-only, and changes are made with pure functions.
> * Redux has three main **building blocks**. Actions, Reducers, and Store.
> * **Actions** are payloads of information that send data from our application to the store.
> * **Reducers** specify how the application's state changes in response to actions sent to the store.
> * The **Store** is the object that brings them together. The store has three main methods. getState(), dispatch(), and subscribe() in Redux. 
> * Which we can use in React with the help of the **react-redux** library as **_useSelector()_** and **_useDispatch()_**.
> * Middleware is a layer of software placed between the moment an action is dispatched and the moment the reducer responds to that action in Redux.
> * It is used to extend, customize, and handle side effects in Redux operations.
> * Redux-Toolkit is the official, opinionated, batteries-included toolset for efficient Redux development.
> * Redux-Toolkit has built-in support for writing action creators as thunks.
> * Redux-Toolkit has built-in support for writing immutable update logic for reducers. So we can write reducers as a mutable way. But Redux-Toolkit will take care of the immutability.
> * Redux DevTools Extension is a great tool for debugging our Redux application.
> * Redux allow us to use middleware. We can use middleware to write our action creators as thunks. We can use the Redux-Thunk library to write our action creators as thunks.
> * We can use simply **_createAsyncThunk()_** function to write our action creators as thunks. And it will automatically dispatch three actions for us. The first action is a pending action. The second action is a fulfilled action. And the third action is a rejected action. So we don't need to dispatch these actions manually.
> * Redux-Saga is a great tool for managing complex asynchronous actions in Redux. But it has a learning curve. So if we have a simple project, we can use Redux-Thunk. Because Redux-Thunk is simple and easy to use.
> * Redux-Thunk is easy to use. But it has some limitations. For example, we can't cancel the previous API call. So if we dispatch the action multiple times, the API call will be made multiple times. 

<br/>

### <span style="color: #c1121f;"> **_Last Words_**</span>

> * Thank you for reading, I hope you enjoyed it. 
> * If you have any questions, please feel free to contact me.
> * You can find my contact information on my [GitHub profile](https://github.com/yamisagi).
> * If you want to support me, you can give a star to this repository.
> * And you can follow me on [Twitter](https://twitter.com/_yamisagi).
> * Also appreciated any PR's to improve this document or fix any typo mistakes 🚀



<br/>

### <span style="color: #c1121f;"> **_References_**</span>

- [Redux Documentation](https://redux.js.org/)

- [Redux-Toolkit Documentation](https://redux-toolkit.js.org/)

- [Redux-Thunk Documentation](https://github.com/reduxjs/redux-thunk)



