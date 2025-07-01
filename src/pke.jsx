// pke.js
const CLIENT_ID = "f310e379912b4a998967c82421ea67f4";
const REDIRECT_URI = "https://spotify-app-sandy-phi.vercel.app/";
const SPOTIFY_AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize";
const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const SCOPES = ["user-top-read"];

// Extract code from redirect URL
export const getReturnParamsFromSpotifyAuth = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return {
    code: urlParams.get("code"),
    error: urlParams.get("error"),
  };
};

// PKCE Helpers
const generateRandomString = (length) => {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
};

export const generateCodeVerifier = () => generateRandomString(64);

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
  const hashed = await sha256(verifier);
  return base64encode(hashed);
};

export {
  CLIENT_ID,
  REDIRECT_URI,
  SPOTIFY_AUTHORIZE_ENDPOINT,
  TOKEN_ENDPOINT,
  SCOPES,
};
