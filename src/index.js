import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./authConfig";

const msalInstance = new PublicClientApplication(msalConfig);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <div style={{padding: "2rem", color:"blue"}}>
      <p>This React app is a demo of Azure SSO.<br/>
        The account must be created in Azure Entra AD before logging here.<br/>
        After logging in, the Frontend receives the ID and Access Tokens. <br/>
        The Access Token is forwarded as a header to the Backend API.<br/>
        The Backend API Gateway validates the Access Token using Oauth2 Security. <br/>
        It also takes de UserId from the "oid" claim  of the Access Token.
      </p>    
    </div>
    <MsalProvider instance={msalInstance}>
      <App />
    </MsalProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
