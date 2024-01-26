import './App.css';
import Counter from './components/product/Counter';
import Login from './components/product/Login';
import { useSelector } from 'react-redux';

const App = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  console.log(isAuthenticated);
  return (
    <>
      {!isAuthenticated && <Login />}
      {isAuthenticated && <Counter />}
    </>
  );
};

export default App;
