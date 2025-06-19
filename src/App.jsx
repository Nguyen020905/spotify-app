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
    const hash =
      window.location
        .hash; /* grab the access token from the URL  ex='http://localhost:5173/#access_token=ABC123&token_type=Bearer&expires_in=3600*/
    let token =
      window.localStorage.getItem(
        "token"
      ); /* check if we have the previous token already save in the local storage */

    if (!token && hash) {
      token = new URLSearchParams(hash.substring(1)).get(
        "access_token"
      ); /* delte the # in the #access_token=ABC123&token_type=Bearer&expires_in=3600* and only get the acces_token */
      window.location.hash = "";
      window.localStorage.setItem("token", token);
    }

    console.log("Token from localStorage:", token); // Debug: log the token
    console.log("Hash from URL:", hash); // Debug: log the hash
    setToken(token);
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

  const fetchTopArtists = async () => {
    if (token) {
      try {
        const response = await fetch('https://api.spotify.com/v1/me/top/artists?limit=10', {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error('Error fetching top artists:', error);
      }
    }
  };

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
          <button onClick={fetchTopArtists}>Fetch Top Artists</button>
        </>
      )}
    </div>
  );
}

export default App;
