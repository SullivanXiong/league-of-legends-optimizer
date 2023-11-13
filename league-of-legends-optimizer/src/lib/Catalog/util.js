export function parseTeam(data) {
  return {
    name: data["Team Name"],
    players: Object.entries(data)
      .filter(([key, value]) => key.includes("Players") && value !== "")
      .map(([key, value]) => value),
  };
}
