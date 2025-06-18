import React, { useEffect, useState } from "react";

const TopArtist = ({ token }) => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true); // Optional: show loading
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;

    const fetchTopArtists = async () => {
      try {
        console.log("Token being used:", token);
        const res = await fetch(
          "https://api.spotify.com/v1/me/top/artists?limit=10",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch top artists");

        const data = await res.json();
        console.log("Full API response:", data); // Debug: log the full response
        console.log("Data items:", data.items); // Debug: log the items array
        console.log("Items length:", data.items?.length); // Debug: log the length
        
        setArtists(data.items || []);
      } catch (err) {
        setError(err.message);
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopArtists();
  }, [token]);

  return (
    <div>
      <h2>Your Top Artists</h2>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {artists.length === 0 && !loading && <p>No top artists found.</p>}
      <ul>
        {artists.map((artist, index) => (
          <li key={artist.id}>
            {index + 1}. {artist.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopArtist;
