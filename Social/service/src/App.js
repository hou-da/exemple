import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Profile from "./pages/profile/Profile";
import Register from "./pages/register/Register";
import Messenger from "./pages/messenger/Messenger";
import Dashboard from "./pages/call/Dashboard";
import DirectCall from "./components/call/DirectCall/DirectCall";
import {
  BrowserRouter,
  Switch,
  Route,
  Routes,
  Link,
  Redirect,
  Navigate
} from "react-router-dom";
import { useContext } from "react";
import {useEffect} from 'react';
import { AuthContext } from "./context/AuthContext";
import {connectWithWebSocket} from './utils/wssConnection/wssConnection';
import  CallingDialog from './components/call/CallingDialog/CallingDialog'
function App() {
  const { user } = useContext(AuthContext);
  useEffect(() => {
    connectWithWebSocket();
  },[]);
  return (
    <BrowserRouter>
   <Routes>
   <Route path="/" element={<Register/>} />
   <Route path="/home" element={<Home />} />
   <Route path="/login" element={user ? <Navigate to={`/profile/${user._id}`} />: <Login /> }/>
   <Route path="/messenger" element={<Messenger />}/>
   {/*!user ? <Navigate to="/home" /> : */}
   <Route path="/profile/:userId" element={<Profile />} />
   <Route path="/Dashboard" element={<Dashboard />} />

 </Routes>
</BrowserRouter>
   
  );
}

export default App;

