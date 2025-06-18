import React, { useEffect, useState } from "react";
import TopArtist from "./TopArtist";

const App = () => {
  const [token, setToken] = useState(null);

  // Call this when user clicks login
  const authorize = () => {
    const client_id = "f310e379912b4a998967c82421ea67f4";
    const redirect_uri = "https://spotify-app-sandy-phi.vercel.app/";
    const scopes = "user-top-read playlist-modify-public playlist-modify-private";

    let url = "https://accounts.spotify.com/authorize";
    url += "?response_type=token";
    url += "&client_id=" + encodeURIComponent(client_id);
    url += "&scope=" + encodeURIComponent(scopes);
    url += "&redirect_uri=" + encodeURIComponent(redirect_uri);

    window.location.href = url;
  };

  // Parse access_token from URL or localStorage
  useEffect(() => {
    const hash = window.location.hash;
    let _token = window.localStorage.getItem("token");

    if (!_token && hash) {
      _token = new URLSearchParams(hash.substring(1)).get("access_token");
      window.location.hash = "";
      window.localStorage.setItem("token", _token);
    }

    setToken(_token);
  }, []);

  return (
    <div className="App">
      <h1>Spotify Stats</h1>
      {!token ? (
        <button onClick={authorize}>Login with Spotify</button>
      ) : (
        <TopArtist token={token} />
      )}
    </div>
  );
};

export default App;
