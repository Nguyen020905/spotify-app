import React, { useEffect, useState } from "react";
import "./App.css";
import useSpotifyAuth from "./useSpotifyAuth";
import ArtistList from "./ArtistList";
import "animate.css";

const [timeRange, setTimeRange] = useState("short-term");

const App = () => {
  const { accessToken, handleLogin, handleLogout } = useSpotifyAuth();
  const [topArtists, setTopArtists] = useState([]);

  useEffect(() => {
    if (!accessToken) return;

    const fetchTopArtists = async () => {
      try {
        const response = await fetch(
          "https://api.spotify.com/v1/me/top/artists?limit=10&time_range=${timeRange}",
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
          /*drop down for the time range */
          <select
            className="btn"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="short_term">Last 4 Weeks</option>
            <option value="medium_term">Last 6 Months</option>
            <option value="long_term">All Time</option>
          </select>
          <h2>Your Top 10 Artists:</h2>
          <ArtistList artists={topArtists} />
        </>
      )}
    </div>
  );
};

export default App;
