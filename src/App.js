import './App.css';
import { useEffect, useState, useCallback } from 'react';
import { useMsal } from "@azure/msal-react";
import Editor from './component/Editor';

const backendServerNotesUrl = process.env.REACT_APP_BACKED_SERVER_URL_NOTES;
const request = {scopes: [process.env.REACT_APP_AZURE_SCOPE]};

function App() {
  const { instance, accounts } = useMsal();
  const [data, setData] = useState(null);  

  const initInstance = useCallback( async (instance) => {
    await instance.initialize();
  },[]);  

  useEffect(() => {
    initInstance(instance);
    instance.handleRedirectPromise()
      .then(async (response) => {
        let account = null;

        if (response) {
          console.trace("✅ Successful Login:", response.account);
          account = response.account;
          instance.setActiveAccount(account);
        } else if (accounts.length > 0) {
          console.trace("🧑 Already logged:", accounts[0]);
          account = accounts[0];
          instance.setActiveAccount(account);
        }

        if(!account){
          console.warn("⚠️ No account available");
          return;
        } 

        try{
           const tokenResponse = await instance.acquireTokenSilent({
            ...request,
            account,
           });

            const accessToken = tokenResponse.accessToken;
            console.trace("🔐 accessToken:", accessToken);
        
        const res = await fetch(backendServerNotesUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });


      const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("❌ AccessToken or API Call Error :", err);
      }
    })
    .catch((error) => {
      console.error("❌ Login Error:", error);
    });

        


        
  }, [instance, initInstance,accounts]);

  const login = () => {
    instance.loginRedirect({prompt : "login"});
  };

  return accounts.length === 0 ? (
    <div>
      <h3>Notes App</h3>
      <button onClick={login}>Start session with Azure</button>
    </div>
  ) : !data ? (<div>Loading data...</div>) : 
  (<div>
        <div style={{ paddingLeft: "2rem" }}>
          <h3>Welcome, {accounts[0].name}</h3>             
          <Editor/>
       </div>      
    </div>        
  )
}

export default App;

