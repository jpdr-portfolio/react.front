import {useState, useEffect, useCallback} from "react";
import { useMsal } from "@azure/msal-react";

const backendServerNotesUrl = process.env.REACT_APP_BACKED_SERVER_URL_NOTES;
const request = {scopes: [process.env.REACT_APP_AZURE_SCOPE]};
const azureRedirectUrl = process.env.REACT_APP_AZURE_REDIRECT_URL;

function Editor() {
  const [notes, setNotes] = useState([]);
  const [nuevoMensaje, setNewNote] = useState("");
  const { instance} = useMsal();


  const fetchNotes = useCallback( async () => {

    const activeAccount = instance.getActiveAccount();
    if (!activeAccount) return;

    instance.acquireTokenSilent({ ...request, account: activeAccount })
    .then((response) => {
      const token = response.accessToken;

      return fetch(backendServerNotesUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    })
    .then((res) => {
      if (!res.ok) throw new Error("HTTP Error " + res.status);
      return res.json();
    })
    .then((json) => {
      setNotes(json);
    })
    .catch((err) => {
      console.error("❌ Error fetching Notes:", err);
    }); 
  },[instance]);

  useEffect(() => {    
    fetchNotes();
  }, [fetchNotes]);  

  const handleAdd = async () => {
  
    if (!nuevoMensaje.trim()) return;

   const activeAccount = instance.getActiveAccount();
    if (!activeAccount) return;

    instance.acquireTokenSilent({ ...request, account: activeAccount })
    .then((response) => {
      const token = response.accessToken;      
      return fetch(backendServerNotesUrl, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            },
        method: "POST",        
        body: JSON.stringify({ noteMessage: nuevoMensaje}),
        })
    })
    .then((res) => {
            if (!res.ok) throw new Error("HTTP Error " + res.status);
             return res.json();
            })
        .then((json) => {
            setNewNote("");
            fetchNotes();
        })
        .catch((err) => {
            console.error("❌ Error fetching Notes:", err);
        }); 
    };


  const handleDelete = async (id) => {


   const activeAccount = instance.getActiveAccount();
    if (!activeAccount) return;

    instance.acquireTokenSilent({ ...request, account: activeAccount })
    .then((response) => {
      const token = response.accessToken;      
      return fetch(`${backendServerNotesUrl}/${id}/remove`, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            },
        method: "POST",                
        })
    })
    .then((res) => {
        if (!res.ok) throw new Error("HTTP Error " + res.status);
    })
    .then(() => {            
        fetchNotes();
    })
    .catch((err) => {
        console.error("❌ Error fetching Notes:", err);
    }); 
};    
 
const handleLogout = async () => {
  instance.logoutRedirect({postLogoutRedirectUri: azureRedirectUrl});
};


  return (
    <div style={{ paddingLeft: "2rem" }}>
      <h3>📩 User Notes Manager</h3>

      <input
        type="text"
        value={nuevoMensaje}
        onChange={(e) => setNewNote(e.target.value)}
        placeholder="New message"
        style={{border: "1px solid #ccc",borderRadius: "2px",padding: "8px 12px",}}
      />
      <button onClick={handleAdd}
      style={{border: "1px solid #ccc",borderRadius: "2px",padding: "8px 12px",}}
      
      >Add</button>

      <ul style={{ listStyleType: "none", padding: 0 }}>
        {notes.map((msg) => (
          <li key={msg.noteId} style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            maxWidth: "400px",
            padding: "8px 12px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            marginBottom: "10px" }} >
            <span>💬 {msg.noteMessage} </span>
            <button onClick={() => handleDelete(msg.noteId)}>🗑️</button>
          </li>
        ))}
      </ul>
      <button onClick={handleLogout}
      style={{border: "1px solid #ccc",borderRadius: "2px",padding: "8px 12px",}}      
      >Logout</button>  
    </div>
  );

}

export default Editor;