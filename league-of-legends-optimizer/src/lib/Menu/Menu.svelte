<script>
  import Catalog from "../Catalog/Catalog.svelte";
  import stellarNexusLogo from "/stellarNexusLogo.png";
  let hamburgerStack = "https://upload.wikimedia.org/wikipedia/commons/b/b2/Hamburger_icon.svg";
  export let setContent;
  export let isOpen;

  function toggleMenu() {
    isOpen = !isOpen;
  }
</script>

<div class={`menu-container${isOpen ? " open" : ""}`} class:open={isOpen}>
  <div class="menu-button">
    <img on:click={toggleMenu} class="menu-img" src={hamburgerStack} alt="hamburger stack" />
    {#if isOpen}
      <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
        <img src={stellarNexusLogo} class="menu-logo" alt="Vite Logo" />
      </a>
    {/if}
  </div>
  {#if isOpen}
    <Catalog
      on:showTeam={(event) => setContent("team", event.detail)}
      on:showPlayer={(event) => setContent("player", event.detail)}
    />
  {/if}
</div>

<style>
  @import "./web.css";
</style>
