<script>
  import viteLogo from "/vite.svg";
  import Catalog from "./lib/Catalog/Catalog.svelte";
  import Overlay from "./lib/Overlay/Overlay.svelte";

  let active = false;
  let contentType = null;
  let name;
  let fields = [];

  let onSubmit = (data) => {};

  // Function to update fields
  function updateFields(newFields) {
    fields = newFields;
  }

  function updateOnSubmit(newOnSubmit) {
    onSubmit = newOnSubmit;
  }

  // Function to toggle overlay
  function toggleOverlay() {
    active = !active;
  }

  // Function to set the content type
  function setContent(type, details) {
    contentType = type;
    name = details.name;
  }

  // Set up context to provide to child components
  import { setContext } from "svelte";
  import Player from "./lib/Player/Player.svelte";
  setContext("overlay-controls", { updateFields, updateOnSubmit, toggleOverlay });
</script>

<main>
  <Overlay {active} {fields} {onSubmit} />
  <div class="lol-main">
    <div class="lol-left">
      <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
        <img src={viteLogo} class="lol-logo" alt="Vite Logo" />
      </a>
      <Catalog
        on:showTeam={(event) => setContent("team", event.detail)}
        on:showPlayer={(event) => setContent("player", event.detail)}
      />
    </div>
    <div class="lol-right">
      {#if contentType === "team"}
        <!-- <Team /> -->
        <p>{name}</p>
      {:else if contentType === "player"}
        <p>{name}</p>
        <Player />
      {/if}
    </div>
  </div>
</main>

<style>
  @import "./web.css";
  @import "./mobile.css";

  .lol-logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
  }
  .lol-logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .lol-logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00aa);
  }
</style>
