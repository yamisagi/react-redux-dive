import React from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { useDispatch, useSelector } from 'react-redux';

const Counter = () => {
  const dispatch = useDispatch();
  const counter = useSelector((state) => state.counter);

  console.log('counter', counter);

  const handleIncrement = () => {
    dispatch({ type: 'INCREASE' });
  };

  const handleDecrement = () => {
    dispatch({ type: 'DECREASE' });
  };

  return (
    <Card className={'product__counter'}>
      <p className='counter__title' role='heading' aria-level='3'>
        Counter
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
    </Card>
  );
};

export default Counter;
