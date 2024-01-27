# <span style="color: #8338ec;">React-Redux Advanced Notes</span>

[<img src="https://redux.js.org/img/redux.svg" height="75" alt="Redux Logo" style="display: block; margin: auto;"/>](https://redux.js.org)

### <span style="color: #c1121f;"> **_Asynchronous Actions & Side Effects in Redux_**</span>

- When we use Redux we must provide a pure, side-effect free and synchronous function to the reducer. Because of this, we can't make API calls or dispatch actions asynchronously. We can only dispatch actions synchronously.

<br/>

| Input              | Output    |
| ------------------ | --------- |
| Old state + Action | New state |

<br/>

- So how do we handle asynchronous actions in Redux?

  - We can use our side effects in the component itself. We can make API calls in the component and then dispatch the action to the reducer. So Redux itself doesn't know about the side effects.

    - For example, we want to post a new post to the server. And in our reducer,
      we have notification status. So when we post a new post, we want to show a notification to the user. So we can make an API call in the component and then dispatch the action to the reducer. So the reducer will update the state and then we can show the notification to the user.

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

    export const { showNotification } = postSlice.actions;
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

    - The idea behind here is when the form is submitted, an action is dispatched to the reducer. Subsequently, the useEffect hook is triggered by the state change, initiating an API call. Following the API call, another action is dispatched to the reducer to update the notification state. As a result, the reducer modifies the state, allowing for the display of notifications to the user.

    - With this approach, we keep data transformation logic in the reducer and side effects in the component.

    - But this is not a good approach because always it is not simple like this. Sometimes we need to make multiple API calls and then dispatch the action to the reducer. So we need to write a lot of code in the component. This is not a good practice.
