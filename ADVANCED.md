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

    - For example, we want to post a new post to the server. We can use useEffect hook to make the API call and then dispatch the action to the reducer.

    ```javascript
    import React, { useEffect } from 'react';
    import { useDispatch, useSelector } from 'react-redux';
    import { backendActions } from '../actions/postActions';

    const PostForm = () => {
      const dispatch = useDispatch();
      const { post } = useSelector((state) => state.post);

      useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/posts', {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify(post),
        });
      }, [post]);

      // ... Some code
    };

      export default PostForm;

      // Dispatch the action to the reducer somewhere

      const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(
          backendActions.postItem({
            // Some data
          })
        );
      };
    ```

    - The idea behind here is when we submit the form, we dispatch the action to the reducer. Then our reducer will update the state. So when the state is updated, the useEffect hook will be triggered and make the API call.

    - With this approach, we keep data transformation logic in the reducer and side effects in the component.

    - But this is not a good approach because always it is not simple like this. Sometimes we need to make multiple API calls and then dispatch the action to the reducer. So we need to write a lot of code in the component. This is not a good practice.
