import { shell } from "electron";

export async function oAuthStart(event, client) {
  try {
    // Generate the Google OAuth URL
    const authUrl = client.generateAuthUrl({
      access_type: "offline", // Request refresh token
      scope: ["https://www.googleapis.com/auth/userinfo.profile"], // The scopes you want
    });

    // Open the Google OAuth URL in the user's default browser
    shell.openExternal(authUrl);

    // Inform the user to enter the code in the UI (handled in renderer process)
    // No oauth-success sent here; it will be sent after tokens are retrieved.
  } catch (error) {
    console.error("Error during OAuth flow:", error);
    event.sender.send("oauth-error", error);
  }
}

export async function oAuthCode(event, authCode) {
  try {
    // Exchange the authorization code for tokens
    const { tokens } = await client.getToken(authCode);
    client.setCredentials(tokens); // Set the credentials (access and refresh tokens)

    // Send the tokens back to the renderer process
    event.sender.send("oauth-success", tokens);
  } catch (error) {
    console.error("Error during token exchange:", error);
    event.sender.send("oauth-error", error);
  }
}
