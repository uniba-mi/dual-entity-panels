<script>
  import { onMount } from "svelte";
  import cytoscape from "cytoscape";

  import { selectedPath } from "../../stores.js";
  import {
    getLabelForId,
    getDescriptionForId,
    getPathEntities,
    getPathRelations,
  } from "../../util.js";

  let theSelectedPath;
  selectedPath.subscribe((value) => (theSelectedPath = value));

  const initGraph = () => {
    const entities = getPathEntities(theSelectedPath.parsedPath);
    const entitiesFormatted = entities.map((entity) => {
      return {
        data: {
          id: entity,
          label: getLabelForId(entity, theSelectedPath.parsedPath),
          color:
            entity === theSelectedPath.entityA ||
            entity === theSelectedPath.entityB
              ? "#3459e6"
              : "#444",
        },
      };
    });

    const relations = getPathRelations(theSelectedPath.parsedPath);
    const relationsFormatted = relations.map((relation, index) => {
      return {
        data: {
          id: relation.predicate + index,
          source: relation.subject,
          target: relation.object,
          label: getLabelForId(relation.predicate, theSelectedPath.parsedPath),
        },
      };
    });

    const cy = cytoscape({
      container: document.getElementById("graph-container"),

      elements: [...entitiesFormatted, ...relationsFormatted],

      style: [
        {
          selector: "node",
          style: {
            "background-color": "data(color)",
            color: "white",
            label: "data(label)",
            "text-valign": "center",
            "text-outline-width": 2,
            "text-outline-color": "data(color)",
          },
        },
        {
          selector: "edge",
          style: {
            "arrow-scale": "2",
            color: "white",
            "curve-style": "straight",
            label: "data(label)",
            "line-color": "#999",
            "target-arrow-color": "#999",
            "target-arrow-shape": "triangle",
            "target-endpoint": "outside-to-node-or-label",
            "text-outline-color": "#999",
            "text-outline-width": 2,
            width: 3,
          },
        },
      ],

      layout: {
        name: "dagre",
        spacingFactor: 1.4,
        nodeDimensionsIncludeLabels: true,
      },

      userZoomingEnabled: false,
      boxSelectionEnabled: false,
    });

    const initTooltips = (element) => {
      element.popper({
        content: () => {
          const div = document.createElement("div");

          div.classList.add("custom-tooltip");

          div.innerHTML = `
            <div class="card" style="width: 300px;">
              <div class="card-body">
                <p class="card-text fs-7"><strong>ID:</strong> ${element.id()}</p>
                <p class="card-text fs-7"><strong>Description:</strong> ${getDescriptionForId(
                  element.id(),
                  theSelectedPath.parsedPath
                )}</p>
              </div>
            </div>
          `;

          document.body.appendChild(div);

          return div;
        },
      });
    };

    // show the tooltips while hovering over nodes
    cy.on("mouseover", "node", (event) => {
      const node = event.target;
      initTooltips(node);
    });

    // remove the tooltips after hovering over nodes
    cy.on("mouseout", "node", () => {
      document
        .querySelectorAll(".custom-tooltip")
        .forEach((element) => element.remove());
    });

    // show the tooltips while hovering over edges
    cy.on("mouseover", "edge", (event) => {
      const edge = event.target;
      initTooltips(edge);
    });

    // remove the tooltips after hovering over edges
    cy.on("mouseout", "edge", () => {
      document
        .querySelectorAll(".custom-tooltip")
        .forEach((element) => element.remove());
    });
  };

  onMount(() => {
    initGraph();
  });
</script>

<div class="container">
  <div class="row">
    <div class="col">
      <div id="graph-container" />
    </div>
  </div>
</div>

<style>
  #graph-container {
    height: 400px;
  }
</style>
