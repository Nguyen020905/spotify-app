import React from "react";
import { useEffect, useState } from "react";
const TopArtist = ({ token }) => {
  const [tracks, setTracks] = useState([]); /* create an array of top song */
  useEffect(() => {
    if (!token) return;

    const fetchTopTracks = async () => {
      try {
        const response = await fetch(
          "https://api.spotify.com/v1/me/top/tracks?limit=10",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        setTracks(data.items);
      } catch (error) {
        console.error("Error fetching top tracks:", error);
      }
    };

    fetchTopTracks();
  }, [token]);

  return (
    <div className="top-tracks">
      <h2>Your Top 10 Tracks</h2>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Track Name</th>
            <th>Artist(s)</th>
          </tr>
        </thead>
        <tbody>
          {tracks.map((track, index) => (
            <tr key={track.id}>
              <td>{index + 1}</td>
              <td>{track.name}</td>
              <td>{track.artists.map((artist) => artist.name).join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TopArtist;
