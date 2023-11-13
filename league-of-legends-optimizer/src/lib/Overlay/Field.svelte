<script>
    import { onMount } from 'svelte';

    let input;

    export let type;
    export let value;
    export let options = {};
    export let excludeFieldName = false;
    export let listItemIndex;

    onMount(() => {
        input.type = type;
    
        for (const [key, value] of Object.entries(options)) {
            if (key === 'placeholder' && listItemIndex) {
                input.setAttribute(key, value + ' ' + listItemIndex.toString());
            } else {
                input.setAttribute(key, value);
            } 
        }
    });
</script>

<div class="field">
    {#if !excludeFieldName}
        <p>
            {value}: 
        </p>
    {/if}
    <input bind:this={input} id={listItemIndex ? value + listItemIndex.toString() : value}/>
</div>

<style>
.field {
    display: flex;
    align-items: center; /* Vertically align the elements */
  }

  .field > p {
    margin-right: 10px; /* Adjust the spacing between input and paragraph */
    min-width: 100px; /* Set a fixed width for the paragraph element */
    white-space: nowrap; /* Prevent text from wrapping */
    overflow: hidden; /* Hide overflow if the text exceeds the width */
    text-overflow: ellipsis; /* Show ellipsis if the text overflows */
    text-align: left;
  }
</style>