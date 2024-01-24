import React from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';

const Counter = () => {
  return (
    <Card className={'product__counter'}>
      <p className='counter__title' role='heading' aria-level='3'>
        Counter
      </p>
      <span className='counter__value'>0</span>
      <div
        className='counter__btn-group'
        role='group'
        aria-label='Button group'
      >
        <Button>-</Button>
        <Button>+</Button>
      </div>
    </Card>
  );
};

export default Counter;
