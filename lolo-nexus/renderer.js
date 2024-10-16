import { setupOAuthListeners, setupOAuthResultHandlers } from "./electron-renderer/oauth";
import { setupMatchHistoryResultHandlers } from "./electron-renderer/update-match-history";

// Initialize listeners
document.addEventListener("DOMContentLoaded", () => {
  setupOAuthListeners(); // OAuth logic
  setupOAuthResultHandlers(); // Handle OAuth events
  setupMatchHistoryResultHandlers(); // Match history updates
});
