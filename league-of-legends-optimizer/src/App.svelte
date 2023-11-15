<script>
  import Catalog from "./lib/Catalog/Catalog.svelte";
  import Overlay from "./lib/Overlay/Overlay.svelte";
  import Player from "./lib/Player/Player.svelte";
  import Menu from "./lib/Menu/Menu.svelte";

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

  let isMenuOpen = false; // Initial state of the menu

  // Set up context to provide to child components
  import { setContext } from "svelte";
  setContext("overlay-controls", {
    updateFields,
    updateOnSubmit,
    toggleOverlay,
  });
</script>

<main>
  <Overlay {active} {fields} {onSubmit} />
  <div class="lol-main">
    <div class="lol-left">
      {#if isMenuOpen}
        <Catalog
          on:showTeam={(event) => setContent("team", event.detail)}
          on:showPlayer={(event) => setContent("player", event.detail)}
        />
      {/if}
      <Menu bind:isOpen={isMenuOpen} />
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
</style>
