const exec = require("child_process").exec;

function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout) => {
      if (error) return reject(error);
      resolve(stdout);
    });
  });
}

// Function to check if the LeagueClientUx process is running
async function isLeagueClientRunning() {
  return new Promise((resolve) => {
    exec("WMIC PROCESS WHERE \"name='LeagueClientUx.exe'\" GET commandline", (error, stdout) => {
      resolve(stdout.includes("LeagueClientUx.exe"));
    });
  });
}

// Cache port and token locally so it doesn't have to be fetched every time
async function getPortAndToken() {
  const commandOutput = await runCommand("WMIC PROCESS WHERE \"name='LeagueClientUx.exe'\" GET commandline");

  const portMatch = commandOutput.match(/--app-port=(\d+)/);
  const tokenMatch = commandOutput.match(/--remoting-auth-token=([\w-]+)/);
  if (!portMatch || !tokenMatch) {
    throw new Error("Could not extract port or token, check if the client is running.");
  }

  const port = portMatch[1];
  const token = tokenMatch[1];
  return { port: port, token: token };
}

module.exports = { isLeagueClientRunning, getPortAndToken };
