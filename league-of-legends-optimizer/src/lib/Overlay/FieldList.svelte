<script>
  import Field from "./Field.Svelte";

  export let field;
  let additionalFields = [];
  function addField() {
    additionalFields = [...additionalFields, additionalFields.length + 1];
  }
</script>

<div class="field-list-main">
  <label for={field.value}>
    {field.value}:
  </label>
  <div class="field-list">
    <Field type={field.type} value={field.value} options={field.options} excludeFieldName={true} listItemIndex={1} />
    {#each additionalFields as _, i}
      <Field
        type={field.type}
        value={field.value}
        options={field.options}
        excludeFieldName={true}
        listItemIndex={i + 2}
      />
    {/each}
  </div>
  <button type="button" class="overlay-add-field-item" on:click={addField}> + </button>
</div>

<style>
  .field-list-main > label {
    margin-right: 10px; /* Adjust the spacing between input and paragraph */
    white-space: nowrap; /* Prevent text from wrapping */
    overflow: hidden; /* Hide overflow if the text exceeds the width */
    text-overflow: ellipsis; /* Show ellipsis if the text overflows */
    min-width: 100px; /* Set a minimum width for the paragraph element */
    text-align: left;
  }

  .field-list {
    display: flex;
    align-items: center; /* Vertically align the elements */
    flex-direction: column;
    margin-top: 0.5rem;
    gap: 0.5rem;
  }

  .overlay-add-field-item {
    border: 1px dashed white;
    width: 5rem;
    padding: 0.5rem;
    margin: auto;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .overlay-add-field-item:hover {
    cursor: pointer;
    background: rgba(255, 255, 255, 0.2);
  }
</style>
