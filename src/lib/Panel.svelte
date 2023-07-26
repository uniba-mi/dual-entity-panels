<script>
  import { selectedPath, formats } from "../stores.js";
  import { getLabelForId, getDescriptionForId } from "../util.js";
  import TurtleFormat from "./formats/TurtleFormat.svelte";
  import ArrowFormat from "./formats/ArrowFormat.svelte";
  import GraphCircleFormat from "./formats/GraphCircleFormat.svelte";
  import GraphHierarchyFormat from "./formats/GraphHierarchyFormat.svelte";
  import LlmFormat from "./formats/LlmFormat.svelte";

  let theSelectedPath;
  let theFormats;

  let selectedFormat = "Turtle";

  selectedPath.subscribe((value) => (theSelectedPath = value));
  formats.subscribe((array) => (theFormats = array));

  const handleDropdownClick = (event) => {
    selectedFormat = event.target.textContent;
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
                {selectedFormat}
              </button>
              <ul class="dropdown-menu">
                {#each theFormats as format}
                  <li>
                    <button class="dropdown-item" on:click={handleDropdownClick}
                      >{format}</button
                    >
                  </li>
                {/each}
              </ul>
            </div>
          </div>
        </div>
        <div class="row">
          {#if selectedFormat === "Turtle"}
            <TurtleFormat />
          {:else if selectedFormat === "Arrow"}
            <ArrowFormat />
          {:else if selectedFormat === "Graph: Circle"}
            <GraphCircleFormat />
          {:else if selectedFormat === "Graph: Hierarchy"}
            <GraphHierarchyFormat />
          {:else if selectedFormat === "LLM"}
            <LlmFormat />
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
