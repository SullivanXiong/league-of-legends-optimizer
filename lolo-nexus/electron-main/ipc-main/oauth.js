require("dotenv").config();
const { CodeChallengeMethod, OAuth2Client } = require("google-auth-library");
const crypto = require("crypto");
const { shell } = require("electron");

// TODO: Move constants to a util file.
const PORT = process.env.ELECTRON_PORT || 7000;
const LOCALHOST_URL = `http://localhost:${PORT}`;
const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID, // Load from environment variable
  process.env.GOOGLE_CLIENT_SECRET, // Load from environment variable
  `${LOCALHOST_URL}/callback` // Redirect URI for desktop apps
);

function generateCodeVerifier() {
  return crypto.randomBytes(32).toString("base64url");
}

function generateCodeChallenge(verifier) {
  return crypto.createHash("sha256").update(verifier).digest("base64url");
}

const code_verifier = generateCodeVerifier(); // PKCE code verifier

async function oAuthStart(event) {
  try {
    const code_challenge = generateCodeChallenge(code_verifier); // PKCE code challenge

    const authUrl = client.generateAuthUrl({
      access_type: "offline",
      scope: ["https://www.googleapis.com/auth/userinfo.profile"],
      code_challenge: code_challenge,
      code_challenge_method: CodeChallengeMethod.S256, // Use S256 method
    });

    shell.openExternal(authUrl);
  } catch (error) {
    console.error("Error during OAuth flow:", error);
    event.sender.send("oauth-error", error);
  }
}

async function oAuthCode(authCode) {
  try {
    const { tokens } = await client.getToken({
      code: authCode,
      codeVerifier: code_verifier, // Pass the stored PKCE code_verifier
    });

    client.setCredentials(tokens); // Set the credentials (access and refresh tokens)

    // Send the tokens back to the renderer process
    // event.sender.send("oauth-success", tokens);
  } catch (error) {
    console.error("Error during token exchange:", error);
    // event.sender.send("oauth-error", error);
  }
}

module.exports = { oAuthStart, oAuthCode };
