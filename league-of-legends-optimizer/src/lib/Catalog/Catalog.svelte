<script>
  import { getContext, onDestroy, onMount, createEventDispatcher } from "svelte";
  import { Field, FieldList } from "../Overlay/Field";
  import { parseTeam } from "./util";

  const { updateFields, updateOnSubmit, toggleOverlay } = getContext("overlay-controls");
  const dispatch = createEventDispatcher();

  let teams = [];

  function refreshTeams() {
    let storageItem = localStorage.getItem("teams");
    if (!storageItem) return;
    const _teams = JSON.parse(storageItem);

    let __teams = [];

    for (let _team of _teams) {
      _team.collapsed = true;
      __teams.push(_team);
    }

    teams = __teams;
  }

  function addTeam() {
    toggleOverlay();
    const fields = [
      new Field("text", "Team Name", { placeholder: "Team 1" }),
      new FieldList(new Field("text", "Players", { placeholder: "Player" })),
    ];
    updateFields(fields);

    function teamAdd(data) {
      let storageItem = localStorage.getItem("teams");
      let teams = storageItem ? JSON.parse(storageItem) : [];
      teams = [...teams, parseTeam(data)];
      localStorage.setItem("teams", JSON.stringify(teams));
      refreshTeams();
      toggleOverlay();
    }
    updateOnSubmit(teamAdd);
  }

  function selectTeam(team) {
    dispatch("showTeam", team);
  }

  function selectPlayer(player) {
    dispatch("showPlayer", player);
  }

  onMount(() => {
    refreshTeams();
  });
</script>

<div class="lol-catalog-main">
  {#each teams as team}
    <div class="lol-catalog-team">
      <p
        on:click={() => {
          team.collapsed = !team.collapsed;
          selectTeam(team);
        }}
      >
        {team.name}
      </p>
      {#if !team.collapsed}
        {#each team.players as player}
          <div class="lol-catalog-team-item" on:click={() => selectPlayer(player)}>
            <span>
              <p>|</p>
              <p>{player.name}</p>
            </span>
          </div>
        {/each}
      {/if}
    </div>
  {/each}
  <div class="lol-catalog-add-team" on:click={() => addTeam()}>+</div>
</div>

<style>
  @import "./web.css";
  @import "./mobile.css";
</style>
