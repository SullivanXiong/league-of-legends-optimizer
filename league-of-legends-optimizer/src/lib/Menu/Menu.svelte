<script>
  import viteLogo from "/vite.svg";
  let hamburgerStack =
    "https://upload.wikimedia.org/wikipedia/commons/b/b2/Hamburger_icon.svg";
  export let isOpen;

  function toggleMenu() {
    isOpen = !isOpen;
  }
</script>

<div class="menu-container" class:open={isOpen}>
  <img src={hamburgerStack} alt="hamburger stack" />
  <button on:click={toggleMenu}>Toggle Menu</button>
  {#if isOpen}
    <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
      <img src={viteLogo} class="lol-logo" alt="Vite Logo" />
    </a>
    <button class="close-button top-right" on:click={toggleMenu}>Close</button>
  {/if}
</div>

<style>
  @import "./web.css";
</style>
