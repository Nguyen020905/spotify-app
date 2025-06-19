import React from "react";
import "./App.css";

const CLIENT_ID = "f310e379912b4a998967c82421ea67f4";
const SPOTIFY_AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize";
const REDIRECT_URL_AFTER_LOGIN = "https://spotify-app-sandy-phi.vercel.app/";
const SCOPES = ["user-top-read"];

const App = () => {
  const handLogin = () => {
    window.location = `${SPOTIFY_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL_AFTER_LOGIN}&scope=${SCOPES}&response_type=token&show_diaglog=true`;
  };
  return (
    <div className="container">
      <h1>Hi</h1>
      <button onClick={handLogin}>Login to Spotify</button>
    </div>
  );
};

export default App;
