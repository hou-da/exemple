import './App.css';
import {
  BrowserRouter,
  Switch,
  Route,
  Routes,
  Link,
  Redirect,
  Navigate
} from "react-router-dom";
import {useEffect} from 'react';
import {connectWithWebSocket} from './utils/wssConnection/wssConnection';
import Dashboard from './Dashboard/Dashboard';
import LoginPage from './LoginPage/LoginPage';

function App() {
  useEffect(() => {
    connectWithWebSocket();
  },[]);
  return (
    <BrowserRouter>
   <Routes>
        <Route path='/dashboard' element={<Dashboard/>} />
          
        
        <Route path='/' element={<LoginPage/>}/>
          
        </Routes>
     
  </BrowserRouter>
  );
}

export default App;
