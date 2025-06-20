import React, { useEffect, useState } from "react";
import "./App.css";

const CLIENT_ID = "f310e379912b4a998967c82421ea67f4";
const REDIRECT_URI = "https://spotify-app-sandy-phi.vercel.app/";
const SPOTIFY_AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize";
const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const SCOPES = ["user-top-read"];
/*https://spotify-app-sandy-phi.vercel.app/?code=AQBhfpLst91O7NMq2wEnVXJrLfhZ-EbvUdRlNsT7vr-f0h_YtJRXq9dF6hlS_96vbg0l92E1isl1tV_hX-A8Pl2zq2dw94ODLZlfwWVDvbn5Hj0byQ2b3FodTy_AUk3O2i0zN8Ejz_U2I4caaILvhtoI-iq_p8agtzz67aEhTnt6uzU8RjvJ6OCq7olh6cWQeiGPZ-dNM4f_fD3F69VbapE3Rr0385PQZKcC8ULrlk7_ZbsFrAtzTqhhusaj0c9eHISylcEyZdfhpUiaHI4N*/
const getReturnParamsFromSpoityfAuth = (hash) => {
  const queryString =
    window.location.search; /*get the code of the author spotify URL */
  const urlParams = new URLSearchParams(queryString);
  return {
    code: urlParams.get("code"),
    error: urlParams.get("error"),
  };
};
// src/pkce.js

const generateRandomString = (length) => {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
};

const generateCodeVerifier = () => generateRandomString(64);

const sha256 = async (plain) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest("SHA-256", data);
};

const base64encode = (input) => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
};

export const generateCodeChallenge = async (verifier) => {
  const hashed = await sha256(verifier); // ✅ Use the passed-in verifier
  return base64encode(hashed); // ✅ Return the result
};

const App = () => {
  const [accessToken, setAccessToken] = useState(null);
  useEffect(() => {
    const { code } = getReturnParamsFromSpoityfAuth();
    if (!code) return; /* return if no code are found*/

    const fetchAccessToken = async () => {
      const codeVerifier = localStorage.getItem("code_verifier");

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
        console.log("🔁 Spotify Token Response:", data); // ✅ See response in console

        if (data.access_token) {
          setAccessToken(data.access_token);
          window.history.replaceState({}, document.title, "/"); // ✅ Remove code from URL
        } else {
          console.error("❌ Token Error:", JSON.stringify(data, null, 2));
        }
      } catch (err) {
        console.error("❌ Network or server error:", err);
      }
    };

    fetchAccessToken();
  }, []);
  // Step 1: Handle login button click
  const handleLogin = async () => {
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    localStorage.setItem("code_verifier", codeVerifier);

    const clientId = CLIENT_ID;
    const redirectUri = REDIRECT_URI;
    const scope = SCOPES.join(" ");

    const params = {
      response_type: "code",
      client_id: clientId,
      scope,
      code_challenge_method: "S256",
      code_challenge: codeChallenge,
      redirect_uri: redirectUri,
      show_dialog: "true",
    };

    // ✅ Build URL and redirect
    window.location = `https://accounts.spotify.com/authorize?${new URLSearchParams(
      params
    )}`;
  };
  return (
    <div className="container">
      <h1></h1>
      <button className="btn" onClick={handleLogin}>
        Login to Spotify
      </button>
      {accessToken ? (
        <p>✅ Logged in! Access token: {accessToken}</p>
      ) : (
        <p>❌ Not logged in yet.</p>
      )}
    </div>
  );
};

export default App;
