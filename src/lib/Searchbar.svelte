<script>
  import "boxicons";
  import { paths, selectedPath } from "../stores.js";

  let thePaths;
  let selectedEntityA;
  let selectedEntityB;

  paths.subscribe((value) => {
    thePaths = value;
  });

  $: eligibleEntitiesA = thePaths.map((element) => {
    return element.entityA;
  });

  $: eligibleEntitiesB = thePaths
    .filter((element) => {
      return element.entityA === selectedEntityA;
    })
    .map((element) => {
      return element.entityB;
    });

  const handleButtonClick = () => {
    const desiredPath = thePaths
      .filter((element) => {
        return (
          element.entityA === selectedEntityA &&
          element.entityB === selectedEntityB
        );
      })
      .at(0);
    selectedPath.set(desiredPath);
  };

  const handleValueChange = () => {
    selectedPath.set({});
  };
</script>

<div class="input-group mb-3">
  <select
    on:change={handleValueChange}
    bind:value={selectedEntityA}
    class="form-select"
    id="inputGroupSelect1"
  >
    <option>Select a first entity</option>
    {#each eligibleEntitiesA as entityA}
      <option>{entityA}</option>
    {/each}
  </select>

  <!-- only when a first entity is selected, the dropdown for the second is active -->
  {#if selectedEntityA === "Select a first entity"}
    <select class="form-select" id="inputGroupSelect1" disabled>
      <option selected>Select a second entity</option>
    </select>
  {:else}
    <select
      on:change={handleValueChange}
      bind:value={selectedEntityB}
      class="form-select"
      id="inputGroupSelect2"
    >
      <option selected>Select a second entity</option>
      {#each eligibleEntitiesB as entityB}
        <option>{entityB}</option>
      {/each}
    </select>
  {/if}

  <!-- only when both entities are selected, the button is active -->
  <button
    class="btn btn-primary {selectedEntityA === 'Select a first entity' ||
    selectedEntityB === 'Select a second entity'
      ? 'disabled'
      : ''} p-2"
    on:click={handleButtonClick}
  >
    <div class="container">
      <div class="row">
        <div class="col-10 ps-1 pe-0 d-flex align-items-center">
          <p class="m-0">Generate Knowledge Panel</p>
        </div>
        <div class="col-2 px-2 d-flex align-items-center">
          <box-icon name="rocket" type="solid" color="#ffffff" />
        </div>
      </div>
    </div>
  </button>
</div>
