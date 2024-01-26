import { configureStore, createSlice } from '@reduxjs/toolkit';

const initialState = {
  counter: 0,
};

// In Redux Toolkit, we don't need to write action types.

// Redux Toolkit will automatically generate action types for us.

// We just need to write reducers.

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    // This seems like we are mutating the state.
    // But we are not mutating the state.
    // Redux Toolkit uses Immer under the hood.
    // Immer will create a copy of the state for us.
    // So we can write code that looks like we are mutating the state.
    // Enjoy the convenience of writing code that looks like we are mutating the state :)
    increase(state) {
      state.counter++;
    },
    decrease(state) {
      state.counter--;
    },
  },
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { isAuthenticated: false },
  reducers: {
    login(state) {
      state.isAuthenticated = true;
    },
    logout(state) {
      state.isAuthenticated = false;
    },
  },
});

const reduxToolkitStore = configureStore({
  reducer: { counter: counterSlice.reducer, auth: authSlice.reducer },
});

export default reduxToolkitStore;
export const counterActions = counterSlice.actions;
export const authActions = authSlice.actions;
