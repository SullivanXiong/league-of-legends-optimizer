const exec = require("child_process").exec;

function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout) => {
      if (error) return reject(error);
      resolve(stdout);
    });
  });
}

// Function to check if LeagueClientUx.exe is running
function isLeagueClientRunning() {
  return new Promise((resolve, reject) => {
    exec("tasklist", (err, stdout, stderr) => {
      if (err) {
        return reject(err);
      }
      // Check if the LeagueClientUx.exe is listed in the tasklist output
      const isRunning = stdout.toLowerCase().includes("leagueclientux.exe");
      resolve(isRunning);
    });
  });
}

// Cache port and token locally so it doesn't have to be fetched every time
async function getPortAndToken() {
  const commandOutput = await runCommand("WMIC PROCESS WHERE \"name='LeagueClientUx.exe'\" GET commandline");

  const portMatch = commandOutput.match(/--app-port=(\d+)/);
  const tokenMatch = commandOutput.match(/--remoting-auth-token=([\w-]+)/);
  if (!portMatch || !tokenMatch) {
    console.error("Main process: Error - Could not extract port/token");
    throw new Error("Could not extract port or token");
  }

  const port = portMatch[1];
  const token = tokenMatch[1];
  return { port: port, token: token };
}

module.exports = { getPortAndToken };
