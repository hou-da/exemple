import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { AuthContextProvider } from "./context/AuthContext";
import store from './store/store';
import { Provider } from 'react-redux';

ReactDOM.render(
  <React.StrictMode>
    
    <AuthContextProvider>
    <Provider store={store}>
      <App />
      </Provider>
    </AuthContextProvider>
  
  </React.StrictMode>,
  document.getElementById("root")
);
reportWebVitals();