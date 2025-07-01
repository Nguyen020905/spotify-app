import React, { useEffect, useState } from "react";
import "./App.css";
import useSpotifyAuth from "./useSpotifyAuth";
import ArtistList from "./ArtistList";
import "animate.css";

const App = () => {
  const { accessToken, handleLogin, handleLogout } = useSpotifyAuth();
  const [topArtists, setTopArtists] = useState([]);

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

  return (
    <div className="container">
      <h1>Spotify Top Artists</h1>

      {!accessToken ? (
        <button className="btn" onClick={handleLogin}>
          Login to Spotify
        </button>
      ) : (
        <>
          <button className="btn" onClick={handleLogout}>
            Logout
          </button>
          <h2>Your Top 10 Artists:</h2>
          <ArtistList artists={topArtists} />
        </>
      )}
    </div>
  );
};

export default App;
