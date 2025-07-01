import React, { useEffect, useState } from "react";
import "./App.css";
import useSpotifyAuth from "./useSpotifyAuth";
import ArtistList from "./ArtistList";
import "animate.css";

const App = () => {
  const { accessToken, handleLogin, handleLogout } = useSpotifyAuth();
  const [topArtists, setTopArtists] = useState([]);
  const [timeRange, setTimeRange] = useState("short_term"); // ✅ Spotify-compatible value

  useEffect(() => {
    if (!accessToken) return;

    const fetchTopArtists = async () => {
      try {
        const response = await fetch(
          `https://api.spotify.com/v1/me/top/artists?limit=10&time_range=${timeRange}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          const text = await response.text(); // 🧠 Use .text() instead of .json() for failed responses
          console.error(`❌ API ${response.status} error:`, text);
          return;
        }

        const data = await response.json();
        console.log("🎯 Top artists response:", data);
        setTopArtists(data.items || []);
      } catch (error) {
        console.error("❌ Network error:", error);
      }
    };

    fetchTopArtists();
  }, [accessToken, timeRange]); // ✅ re-fetch when timeRange changes

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

          {/* ✅ Dropdown to choose time range */}
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

          {/* ✅ Re-render ArtistList when timeRange changes */}
          <div key={timeRange}>
            <ArtistList artists={topArtists} />
          </div>
        </>
      )}
    </div>
  );
};

export default App;
