// Cache port and token locally so it doesn't have to be fetched every time
export async function getPortAndToken() {
  const commandOutput = await runCommand(
    "WMIC PROCESS WHERE \"name='LeagueClientUx.exe'\" GET commandline"
  );

  const portMatch = commandOutput.match(/--app-port=(\d+)/);
  const tokenMatch = commandOutput.match(/--remoting-auth-token=([\w-]+)/);
  if (!portMatch || !tokenMatch) {
    console.error("Main process: Error - Could not extract port/token");
    throw new Error("Could not extract port or token");
  }

  const port = portMatch[1];
  const token = tokenMatch[1];
  return { port, token };
}
