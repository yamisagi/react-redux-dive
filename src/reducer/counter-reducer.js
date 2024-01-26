// Usually using ENUMS for action types is a good practice.
// This is because it is easy to make typos when typing strings.
// And when our app grows, we will have many action types.

export const ENUM = {
  INCREASE: 'INCREASE',
  DECREASE: 'DECREASE',
};

const initialState = {
  counter: 0,
};

const counterReducer = (state = initialState, action) => {
  switch (action.type) {
    case ENUM.INCREASE:
      return {
        ...state,
        counter: state.counter + 1,
      };
    case ENUM.DECREASE:
      return {
        ...state,
        counter: state.counter - 1,
      };
    default:
      return state;
  }
};

export default counterReducer;
