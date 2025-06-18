// App.jsx
import { useEffect, useState } from "react";
import "./App.css";
import TopArtist from "./TopArtist.jsx";
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "token";
const SCOPES = ["user-top-read"];
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;

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

    setToken(token);
  }, []);

  const logOut = () => {
    setToken("");
    window.localStorage.removeItem("token");
  };

  return (
    <div class="center-container">
      <h1>Spotify App</h1>

      {!token ? (
        <a
          className="btn"
          href={`${AUTH_ENDPOINT}?client_id=${
            import.meta.env.VITE_CLIENT_ID
          }&redirect_uri=${REDIRECT_URI}&scope=${SCOPES.join(
            "%20"
          )}&response_type=${RESPONSE_TYPE}`}
        >
          Login to Spotify
        </a>
      ) : (
        <>
          <button onClick={logOut} className="bnt">
            Logout
          </button>
          <p>You are logged in!</p>
          <TopArtist token={token} />
        </>
      )}
    </div>
  );
}

export default App;
