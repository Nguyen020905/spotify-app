import React, { useEffect, useState } from "react";
import "./App.css";
import {
  CLIENT_ID,
  REDIRECT_URI,
  SPOTIFY_AUTHORIZE_ENDPOINT,
  TOKEN_ENDPOINT,
  SCOPES,
  getReturnParamsFromSpotifyAuth,
  generateCodeVerifier,
  generateCodeChallenge,
} from "./pke";

const App = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [topArtists, setTopArtists] = useState([]);

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
