export function setupOAuthListeners() {
  // OAuth Start
  document.getElementById("google-btn").addEventListener("click", () => {
    window.electronAPI.sendOAuthStart();
    // Show the authorization code input box
    document.getElementById("auth-code-container").style.display = "block";
  });

  // Handle OAuth Code submission
  document.getElementById("submit-code-btn").addEventListener("click", () => {
    const authCode = document.getElementById("auth-code-input").value;
    window.electronAPI.sendAuthCode(authCode);
    document.getElementById("auth-code-container").style.display = "none";
  });
}

export function setupOAuthResultHandlers() {
  // Handle OAuth Success
  window.electronAPI.onOAuthSuccess((event, tokens) => {
    console.log("OAuth Success:", tokens);
    window.electronAPI.syncTokens(tokens.id_token, tokens.access_token, tokens.refresh_token);
  });

  // Handle OAuth Error
  window.electronAPI.onOAuthError((event, error) => {
    console.error("OAuth Error:", error);
  });
}
