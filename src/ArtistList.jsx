// ArtistList.jsx
import React from "react";

const ArtistList = ({ artists }) => {
  return (
    <ul className="list_artist">
      {artists.length > 0 ? (
        artists.map((artist) => (
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
  );
};

export default ArtistList;
