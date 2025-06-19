import React, { useEffect, useState } from "react";
import "./App.css";
import { generateCodeVerifier, generateCodeChallenge } from "./pkce";

const CLIENT_ID = "f310e379912b4a998967c82421ea67f4";
const REDIRECT_URI = "https://spotify-app-sandy-phi.vercel.app/";
const SPOTIFY_AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize";
const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const SCOPES = ["user-top-read"];

const App = () => {
  const [accessToken, setAccessToken] = useState(null);

  // Step 1: Handle login button click
  const handleLogin = async () => {
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    localStorage.setItem("code_verifier", codeVerifier);

    const authUrl = new URL(SPOTIFY_AUTHORIZE_ENDPOINT);
    authUrl.search = new URLSearchParams({
      response_type: "code",
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      scope: SCOPES.join(" "),
      code_challenge_method: "S256",
      code_challenge: codeChallenge,
      show_dialog: "true",
    }).toString();

    window.location.href = authUrl.toString();
  };
  return (
    <div className="container">
      <h1>Hi</h1>
      <button onClick={handleLogin}>Login to Spotify</button>
    </div>
  );
};

export default App;
