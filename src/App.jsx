import React, { useEffect, useState } from "react";
import "./App.css";
import { generateCodeVerifier, generateCodeChallenge } from "./pkce"; // Import helper functions from pkce.js

const CLIENT_ID = "f310e379912b4a998967c82421ea67f4";
const REDIRECT_URI = "https://spotify-app-sandy-phi.vercel.app/";
const SPOTIFY_AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize";
const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const SCOPES = ["user-top-read"];

const App = () => {
  const [accessToken, setAccessToken] = useState(null);

  // Step 1: Handle login click
  const handleLogin = async () => {
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    localStorage.setItem("code_verifier", codeVerifier); // Save for token exchange

    const authUrl = `${SPOTIFY_AUTHORIZE_ENDPOINT}?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&scope=${SCOPES.join(
      "%20"
    )}&code_challenge_method=S256&code_challenge=${codeChallenge}`;

    window.location.href = authUrl;
  };

  // Step 2: After redirect from Spotify
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      const storedVerifier = localStorage.getItem("code_verifier");
      if (storedVerifier) {
        exchangeToken(code, storedVerifier);
      }
    }
  }, []);

  // Step 3: Exchange code for access token
  const exchangeToken = async (code, codeVerifier) => {
    const body = new URLSearchParams({
      client_id: CLIENT_ID,
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI,
      code_verifier: codeVerifier,
    });

    try {
      const response = await fetch(TOKEN_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
      });

      const data = await response.json();
      setAccessToken(data.access_token);
      console.log("Access Token:", data.access_token);
    } catch (err) {
      console.error("Failed to get access token:", err);
    }
  };

  return (
    <div className="container">
      <h1>Spotify PKCE Login</h1>
      {!accessToken ? (
        <button onClick={handleLogin}>Login to Spotify</button>
      ) : (
        <p>You're logged in! 🎧</p>
      )}
    </div>
  );
};

export default App;
