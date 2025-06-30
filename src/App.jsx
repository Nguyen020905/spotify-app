import React, { useEffect, useState } from "react";
import "./App.css";

const CLIENT_ID = "f310e379912b4a998967c82421ea67f4";
const REDIRECT_URI = "https://spotify-app-sandy-phi.vercel.app/";
const SPOTIFY_AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize";
const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const SCOPES = ["user-top-read"];

// Extract code from redirect URL
const getReturnParamsFromSpotifyAuth = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return {
    code: urlParams.get("code"),
    error: urlParams.get("error"),
  };
};

// PKCE helpers
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

const generateCodeChallenge = async (verifier) => {
  const hashed = await sha256(verifier);
  return base64encode(hashed);
};

const App = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [topArtists, setTopArtists] = useState([]);

  // Step 1: Handle token retrieval on page load
  useEffect(() => {
    const { code } = getReturnParamsFromSpotifyAuth();

    if (!code) {
      const savedToken = localStorage.getItem("access_token");
      if (savedToken) setAccessToken(savedToken);
      return;
    }

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
        console.log("🔁 Spotify Token Response:", data);

        if (data.access_token) {
          setAccessToken(data.access_token);
          localStorage.setItem("access_token", data.access_token);
          window.history.replaceState({}, document.title, "/");
        } else {
          console.error("❌ Token Error:", data);
        }
      } catch (err) {
        console.error("❌ Network or server error:", err);
      }
    };

    fetchAccessToken();
  }, []);

  // Step 2: Fetch top 10 artists
  useEffect(() => {
    if (!accessToken) return;

    const fetchTopArtists = async () => {
      try {
        const response = await fetch(
          "https://api.spotify.com/v1/me/top/artists?limit=10",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const data = await response.json();
        setTopArtists(data.items || []);
      } catch (error) {
        console.error("❌ Failed to fetch top artists:", error);
      }
    };

    fetchTopArtists();
  }, [accessToken]);

  // Step 3: Handle login
  const handleLogin = async () => {
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    localStorage.setItem("code_verifier", codeVerifier);

    const params = {
      response_type: "code",
      client_id: CLIENT_ID,
      scope: SCOPES.join(" "),
      code_challenge_method: "S256",
      code_challenge: codeChallenge,
      redirect_uri: REDIRECT_URI,
      show_dialog: "true",
    };

    window.location = `${SPOTIFY_AUTHORIZE_ENDPOINT}?${new URLSearchParams(
      params
    )}`;
  };

  // Step 4: Logout
  const handleLogout = () => {
    setAccessToken(null);
    setTopArtists([]);
    localStorage.removeItem("access_token");
    localStorage.removeItem("code_verifier");
  };

  return (
    <div className="container">
      <h1>Spotify Top Artists</h1>

      {!accessToken ? (
        <button className="btn" onClick={handleLogin}>
          Login to Spotify
        </button>
      ) : (
        <>
          <p>✅ Logged in!</p>
          <button className="btn" onClick={handleLogout}>
            Logout
          </button>
          <h2>Your Top 10 Artists:</h2>
          <ul className="list_artist">
            {topArtists.length > 0 ? (
              topArtists.map((artist) => (
                <li key={artist.id} className="artist_item">
                  <img
                    src={artist.images[0]?.url}
                    alt={artist.name}
                    className="artist_image"
                  />
                  <span className="artist_name">{artist.name}</span>
                </li>
              ))
            ) : (
              <p>Loading artists...</p>
            )}
          </ul>
        </>
      )}
    </div>
  );
};

export default App;
