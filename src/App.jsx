// App.jsx
import { useEffect, useState } from "react";
import "./App.css";
import TopArtist from "./TopArtist.jsx";
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "token";
const SCOPES = ["user-top-read"];
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;

console.log("Environment variables:");
console.log("VITE_CLIENT_ID:", import.meta.env.VITE_CLIENT_ID);
console.log("VITE_REDIRECT_URI:", import.meta.env.VITE_REDIRECT_URI);
console.log("Client ID:", CLIENT_ID);

function App() {
  const [token, setToken] = useState("");
  useEffect(() => {
  const hash = window.location.hash;
  let storedToken = window.localStorage.getItem("token");

  if (!storedToken && hash) {
    const extractedToken = new URLSearchParams(hash.substring(1)).get("access_token");
    if (extractedToken) {
      window.location.hash = "";
      window.localStorage.setItem("token", extractedToken);
      setToken(extractedToken); // ✅ set correct token from hash
      return; // ✅ exit early
    }
  }

  if (storedToken) {
    setToken(storedToken); // ✅ fallback to localStorage token
  }
}, []);


  console.log("Current token state:", token); // Debug: log the current token state

  const logOut = () => {
    setToken("");
    window.localStorage.removeItem("token");
  };

  const checkLocalStorage = () => {
    const storedToken = window.localStorage.getItem("token");
    console.log("Current localStorage token:", storedToken);
    alert(`Current localStorage token: ${storedToken || 'null'}`);
  };

  const loginUrl = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPES.join("%20")}&response_type=${RESPONSE_TYPE}`.replace(/\s+/g, '');
  
  console.log("Login URL:", loginUrl); // Debug: see the actual URL being generated

  return (
    <div className="center-container">
      <h1>Spotify App</h1>

      {!token ? (
        <>
          <a
            className="btn"
            href={loginUrl}
          >
            Login to Spotify
          </a>
          <button onClick={checkLocalStorage} style={{marginTop: '10px'}}>
            Check localStorage
          </button>
        </>
      ) : (
        <>
          <button onClick={logOut} className="bnt">
            Logout
          </button>
          <p>You are logged in!</p>
          <TopArtist token={token} />
          {console.log("Token being passed to TopArtist:", token)}
        </>
      )}
    </div>
  );
}

export default App;
