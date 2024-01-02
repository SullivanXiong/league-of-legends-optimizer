<script>
  import Champion from "../Champion/Champion.svelte";

  export let champions = [];
</script>

<div class="champion-selector-main">
  {#each champions as champion}
    <div>
      <!-- <img
        class="champion-selector-image"
        src={`https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/${champion}.png`}
        alt={champion}
      /> -->
      <Champion {champion} />
    </div>
  {/each}
</div>

<style>
  @import "./web.css";
  @import "./mobile.css";
</style>
