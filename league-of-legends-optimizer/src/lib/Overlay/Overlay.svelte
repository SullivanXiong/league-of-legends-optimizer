<script>
  import { Field as FieldClass, FieldList as FieldListClass } from "./Field";
  import Field from "./Field.Svelte";
  import FieldList from "./FieldList.svelte";

  export let active = false;
  export let fields = [];
  export let onSubmit = (data) => {};
  function _onSubmit(event) {
    // Prevent the default form submission
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    onSubmit(data);
    // Process the form data as needed
  }
</script>

{#if active}
  <!-- Overlay Container -->
  <div class="overlay">
    <!-- Your Form -->
    <form on:submit={(e) => _onSubmit(e)} class="overlay-form">
      {#each fields as field}
        {#if field instanceof FieldClass}
          <Field type={field.type} value={field.value} options={field.options} />
        {:else if field instanceof FieldListClass}
          <FieldList field={field.field} />
        {/if}
      {/each}
      <!-- More inputs and buttons as needed -->
      <button type="submit">Submit</button>
    </form>
  </div>
{/if}

<style>
  @import "./web.css";
</style>
