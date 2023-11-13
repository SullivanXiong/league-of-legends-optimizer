<script>
  import { getContext, onMount } from "svelte";
  import { Field, FieldList } from "../Overlay/Field";
  import { parseTeam } from "./util";

  const { updateFields, updateOnSubmit, toggleOverlay } = getContext("overlay-controls");
  function addTeam() {
    toggleOverlay();
    const fields = [
      new Field("text", "Team Name", { placeholder: "Team 1" }),
      new FieldList(new Field("text", "Players", { placeholder: "Player" })),
    ];
    updateFields(fields);

    function teamAdd(data) {
      let teams = JSON.parse(localStorage.getItem("teams"));
      teams = teams instanceof Array ? teams : [];
      teams = [...teams, parseTeam(data)];
      localStorage.setItem("teams", JSON.stringify(teams));
    }
    updateOnSubmit(teamAdd);
  }

  let teams = [];

  const testTeams = [
    {
      name: "T1",
      players: ["T1 Zeus", "T1 Oner", "T1 Faker", "T1 Gumayushi", "T1 Keria"],
    },
    {
      name: "JDG",
      players: ["JDG 369", "JDG Kanavi", "JDG Knight", "JDG Ruler", "JDG MISSING"],
    },
  ];

  function getPlayerInfo() {
    return;
  }

  onMount(() => {
    const _teams = JSON.parse(localStorage.getItem("teams"));

    for (let _team of _teams) {
      _team.collapsed = true;
      teams = [...teams, _team];
    }
  });

  $: {
  }
</script>

<div class="lol-catalog-main">
  {#each teams as team}
    <div class="lol-catalog-team">
      <p
        on:click={() => {
          team.collapsed = !team.collapsed;
        }}
      >
        {team.name}
      </p>
      {#if !team.collapsed}
        {#each team.players as player}
          <div class="lol-catalog-team-item" on:click={() => getPlayerInfo()}>
            <span>
              <p>|</p>
              <p>{player}</p>
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
