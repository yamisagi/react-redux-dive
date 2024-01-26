import React from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { useDispatch, useSelector } from 'react-redux';
import { ENUM } from '../../reducer/counter-reducer';
import { counterActions } from '../../store/counter-slice';
import { authActions } from '../../store/auth-slice';

const Counter = () => {
  const dispatch = useDispatch();
  const { counter } = useSelector((state) => state.counter);
  console.log(counter);

  const handleIncrement = () => {
    // dispatch({ type: ENUM.INCREASE });
    // Since we are using redux-toolkit, we can use the action creator
    // to dispatch the action instead of using the type property

    dispatch(counterActions.increase()); // dispatch({ type: 'UNIQUE_IDENTIFIER'})
  };

  const handleDecrement = () => {
    // dispatch({ type: ENUM.DECREASE });
    dispatch(counterActions.decrease());
  };

  const handleLogout = () => {
    dispatch(authActions.logout());
  };

  return (
    <Card className={'product__counter'}>
      <p className='counter__title' role='heading' aria-level='3'>
        Very Secure Counter
      </p>
      <span className='counter__value'>{counter}</span>
      <div
        className='counter__btn-group'
        role='group'
        aria-label='Button group'
      >
        <Button onClick={handleDecrement} disabled={counter === 0}>
          -
        </Button>
        <Button onClick={handleIncrement}>+</Button>
      </div>
      <Button onClick={handleLogout}>Logout</Button>
    </Card>
  );
};

export default Counter;
