<script>
  import { onMount } from "svelte";
  import ChampionSelector from "../../../../league-of-legends-draftimizer/src/lib/ChampionSelector/ChampionSelector.svelte";
  import Champion from "../../../../league-of-legends-draftimizer/src/lib/Champion/Champion.svelte";
  import NewChampion from "../../../../league-of-legends-draftimizer/src/lib/Champion/NewChampion.svelte";
  let championPool = {
    top: [],
    jungle: [],
    mid: [],
    adc: [],
    support: [],
  };
  let champions = [];
  let filteredChampions = [];
  let filterString = "";
  let addNewChampion = false;

  onMount(async () => {
    champions = [
      "Aatrox",
      "Ahri",
      "Akali",
      "Akshan",
      "Alistar",
      "Amumu",
      "Anivia",
      "Annie",
      "Aphelios",
      "Ashe",
      "AurelionSol",
      "Azir",
      "Bard",
      "Belveth",
      "Blitzcrank",
      "Brand",
      "Braum",
      "Briar",
      "Caitlyn",
      "Camille",
      "Cassiopeia",
      "Chogath",
      "Corki",
      "Darius",
      "Diana",
      "Draven",
      "DrMundo",
      "Ekko",
      "Elise",
      "Evelynn",
      "Ezreal",
      "Fiddlesticks",
      "Fiora",
      "Fizz",
      "Galio",
      "Gangplank",
      "Garen",
      "Gnar",
      "Gragas",
      "Graves",
      "Gwen",
      "Hecarim",
      "Heimerdinger",
      "Hwei",
      "Illaoi",
      "Irelia",
      "Ivern",
      "Janna",
      "JarvanIV",
      "Jax",
      "Jayce",
      "Jhin",
      "Jinx",
      "Kaisa",
      "Kalista",
      "Karma",
      "Karthus",
      "Kassadin",
      "Katarina",
      "Kayle",
      "Kayn",
      "Kennen",
      "Khazix",
      "Kindred",
      "Kled",
      "KogMaw",
      "KSante",
      "Leblanc",
      "LeeSin",
      "Leona",
      "Lillia",
      "Lissandra",
      "Lucian",
      "Lulu",
      "Lux",
      "Malphite",
      "Malzahar",
      "Maokai",
      "MasterYi",
      "Milio",
      "MissFortune",
      "MonkeyKing",
      "Mordekaiser",
      "Morgana",
      "Naafiri",
      "Nami",
      "Nasus",
      "Nautilus",
      "Neeko",
      "Nidalee",
      "Nilah",
      "Nocturne",
      "Nunu",
      "Olaf",
      "Orianna",
      "Ornn",
      "Pantheon",
      "Poppy",
      "Pyke",
      "Qiyana",
      "Quinn",
      "Rakan",
      "Rammus",
      "RekSai",
      "Rell",
      "Renata",
      "Renekton",
      "Rengar",
      "Riven",
      "Rumble",
      "Ryze",
      "Samira",
      "Sejuani",
      "Senna",
      "Seraphine",
      "Sett",
      "Shaco",
      "Shen",
      "Shyvana",
      "Singed",
      "Sion",
      "Sivir",
      "Skarner",
      "Sona",
      "Soraka",
      "Swain",
      "Sylas",
      "Syndra",
      "TahmKench",
      "Taliyah",
      "Talon",
      "Taric",
      "Teemo",
      "Thresh",
      "Tristana",
      "Trundle",
      "Tryndamere",
      "TwistedFate",
      "Twitch",
      "Udyr",
      "Urgot",
      "Varus",
      "Vayne",
      "Veigar",
      "Velkoz",
      "Vex",
      "Vi",
      "Viego",
      "Viktor",
      "Vladimir",
      "Volibear",
      "Warwick",
      "Xayah",
      "Xerath",
      "XinZhao",
      "Yasuo",
      "Yone",
      "Yorick",
      "Yuumi",
      "Zac",
      "Zed",
      "Zeri",
      "Ziggs",
      "Zilean",
      "Zoe",
      "Zyra",
    ];
    // champions = await fetch("http://localhost:3000/draftimizer/meta/champions");
  });

  $: {
    if (filterString) {
      filteredChampions = champions.filter((champion) => {
        return champion.toLowerCase().includes(filterString.toLowerCase());
      });
    } else {
      filteredChampions = champions;
    }
  }

  function onSelectChampion(champion) {
    if (!(champion in championPool["adc"])) {
      localStorage.setItem();
    }
  }
</script>

<div class="player-main">
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="player-add-new-champion"
    on:click={() => {
      addNewChampion = !addNewChampion;
    }}
  >
    <NewChampion />
  </div>
  {#each championPool["adc"] as champion}
    <Champion {champion} />
  {/each}
  {#if addNewChampion}
    <div class="player-select-champion">
      <input
        bind:value={filterString}
        class="player-champion-search"
        type="text"
      />
      <ChampionSelector {onSelectChampion} champions={filteredChampions}
      ></ChampionSelector>
    </div>
  {/if}
</div>

<style>
  @import "./web.css";
  @import "./mobile.css";
</style>
