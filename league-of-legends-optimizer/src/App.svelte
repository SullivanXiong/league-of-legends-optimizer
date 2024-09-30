<script>
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
    <div class="lol-top">
      <h1>lolo.gg</h1>
    </div>
    <div class="lol-bottom">
      <span>Sign In</span>
    </div>
    <!-- <div class={`lol-left-${isMenuOpen ? "open" : " closed"}`}>
      <Menu {setContent} bind:isOpen={isMenuOpen} />
    </div>
    <div class={`lol-right-${isMenuOpen ? "open" : " closed"}`}>
      {#if contentType === "team"}
        <!-- <Team /> --!>
        <p>{name}</p>
      {:else if contentType === "player"}
        <Player />
      {/if}
    </div> -->
  </div>
</main>

<style>
  @import "./web.css";
  @import "./mobile.css";
</style>
