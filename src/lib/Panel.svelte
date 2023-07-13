<script>
  import { selectedPath, modes } from "../stores.js";
  import { getLabelForId, getDescriptionForId } from "../util.js";
  import TurtleMode from "./modes/TurtleMode.svelte";
  import ArrowMode from "./modes/ArrowMode.svelte";
  import GraphCircleMode from "./modes/GraphCircleMode.svelte";
  import GraphHierarchyMode from "./modes/GraphHierarchyMode.svelte";
  import LlmMode from "./modes/LlmMode.svelte";

  let theSelectedPath;
  let theModes;

  let selectedMode = "Turtle";

  selectedPath.subscribe((value) => (theSelectedPath = value));
  modes.subscribe((array) => (theModes = array));

  const handleDropdownClick = (event) => {
    selectedMode = event.target.textContent;
  };
</script>

{#if Object.keys(theSelectedPath).length === 0}
  <div class="card">
    <div class="card-title m-2">
      <div class="container text-center">
        <div class="row">
          <div class="col mt-2">
            <h4>Select two entities and click the button!</h4>
          </div>
        </div>
      </div>
    </div>
  </div>
{:else}
  <div class="card mb-5">
    <div class="card-title m-2">
      <div class="container">
        <div class="row">
          <div class="col text-start">
            <h4>
              {getLabelForId(
                theSelectedPath.entityA,
                theSelectedPath.parsedPath
              )}
            </h4>
          </div>
          <div class="col-auto">
            <div class="d-flex justify-content-center">
              <div class="vr" />
            </div>
          </div>
          <div class="col text-end">
            <h4>
              {getLabelForId(
                theSelectedPath.entityB,
                theSelectedPath.parsedPath
              )}
            </h4>
          </div>
        </div>
        <div class="row">
          <div class="col text-start">
            <p class="fs-8">
              {theSelectedPath.entityA}
            </p>
          </div>
          <div class="col-auto">
            <div class="d-flex justify-content-center">
              <div class="vr" />
            </div>
          </div>
          <div class="col text-end">
            <p class="fs-8">
              {theSelectedPath.entityB}
            </p>
          </div>
        </div>
        <div class="row">
          <div class="col text-start">
            <p class="fs-8">
              {getDescriptionForId(
                theSelectedPath.entityA,
                theSelectedPath.parsedPath
              )}
            </p>
          </div>
          <div class="col-auto">
            <div class="d-flex justify-content-center">
              <div class="vr" />
            </div>
          </div>
          <div class="col text-end">
            <p class="fs-8">
              {getDescriptionForId(
                theSelectedPath.entityB,
                theSelectedPath.parsedPath
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="card-body px-3 pt-0">
      <div class="container-fluid p-0">
        <div class="row justify-content-center">
          <div class="col-6">
            <div class="dropdown d-grid">
              <button
                class="btn btn-primary dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {selectedMode}
              </button>
              <ul class="dropdown-menu">
                {#each theModes as mode}
                  <li>
                    <button class="dropdown-item" on:click={handleDropdownClick}
                      >{mode}</button
                    >
                  </li>
                {/each}
              </ul>
            </div>
          </div>
        </div>
        <div class="row">
          {#if selectedMode === "Turtle"}
            <TurtleMode />
          {:else if selectedMode === "Arrow"}
            <ArrowMode />
          {:else if selectedMode === "Graph: Circle"}
            <GraphCircleMode />
          {:else if selectedMode === "Graph: Hierarchy"}
            <GraphHierarchyMode />
          {:else if selectedMode === "LLM"}
            <LlmMode />
          {/if}
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .d-flex {
    height: 100%;
  }
</style>
