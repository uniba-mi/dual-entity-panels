<script>
  import "./app.scss";
  import "bootswatch/dist/zephyr/bootstrap.min.css";

  // has to stay to enable bootstrap js functionality
  import * as bootstrap from "bootstrap";

  import Nav from "./lib/Nav.svelte";
  import Searchbar from "./lib/Searchbar.svelte";
  import Panel from "./lib/Panel.svelte";

  import { paths } from "./stores.js";
  import { loadPathData } from "./util.js";

  // init cytoscape for graph visualizations
  import cytoscape from "cytoscape";
  import dagre from "cytoscape-dagre";
  import popper from "cytoscape-popper";

  cytoscape.use(dagre);
  cytoscape.use(popper);

  // load the path data
  let dataLoaded = false;

  const dataPromise = new Promise((resolve, reject) => {
    resolve(paths.set(loadPathData()));
  });

  dataPromise
    .then(() => (dataLoaded = true))
    .catch(() => window.alert("Path data could not be loaded!"));
</script>

<main>
  <div class="container-fluid">
    <nav>
      <div class="row">
        <Nav />
      </div>
    </nav>
  </div>
  <div class="container-fluid">
    <main>
      {#if dataLoaded}
        <div class="row justify-content-md-center">
          <div class="col-lg-8">
            <Searchbar />
          </div>
        </div>
        <div class="row justify-content-center">
          <div class="fixed">
            <Panel />
          </div>
        </div>
      {:else}
        <div class="row justify-content-md-center">
          <div class="col-lg-8">
            <div class="d-flex justify-content-center">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        </div>
      {/if}
    </main>
  </div>
</main>

<style>
  .fixed {
    width: 550px;
  }
</style>
