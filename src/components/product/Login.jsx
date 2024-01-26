import React from 'react';
import { useDispatch } from 'react-redux';
import { authActions } from '../../store/redux-toolkit-slice';

const Login = () => {
  const dispatch = useDispatch();
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(authActions.login());
  };
  return (
    <form className='login__form' onSubmit={handleSubmit}>
      <label htmlFor='email'>Email</label>
      <input type='email' id='email' placeholder='Enter your email' required />
      <label htmlFor='password'>Password</label>
      <input
        type='password'
        id='password'
        placeholder='Enter your password'
        required
        minLength='6'
      />
      <button type='submit'>Login</button>
    </form>
  );
};

export default Login;
