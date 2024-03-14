<script>
  import { onMount } from "svelte";
  import * as d3 from "d3";

  import { selectedPath } from "../../stores.js";
  import {
    getLabelForId,
    getDescriptionForId,
    getPathEntities,
    getPathRelations,
    getRelationInformation,
  } from "../../util.js";

  let theSelectedPath;
  selectedPath.subscribe((value) => (theSelectedPath = value));

  const initGraph = () => {
    const entities = getPathEntities(theSelectedPath.parsedPath);

    const relations = getPathRelations(theSelectedPath.parsedPath);

    const relationInformation = getRelationInformation(
      relations,
      theSelectedPath.parsedPath
    );

    const relationsFormatted = relationInformation.map((relation, index) => {
      let source = relation.subject;
      let target = relation.object;
      let sourceLabel = getLabelForId(source, theSelectedPath.parsedPath);
      let targetLabel = getLabelForId(target, theSelectedPath.parsedPath);
      let sourceDescription = getDescriptionForId(
        source,
        theSelectedPath.parsedPath
      );
      let targetDescription = getDescriptionForId(
        relation.object,
        theSelectedPath.parsedPath
      );
      let label = getLabelForId(relation.predicate, theSelectedPath.parsedPath);

      return {
        data: {
          id: relation.predicate + index,
          source: source,
          sourceLabel: sourceLabel,
          sourceDescription: sourceDescription,
          target: relation.object,
          targetLabel: targetLabel,
          targetDescription: targetDescription,
          distance: parseInt(relation.semanticDistance),
          interpretion: relation.interpretation,
          label: label,
        },
      };
    });

    const entityLables = entities.map((entity) => {
      return getLabelForId(entity, theSelectedPath.parsedPath);
    });

    let data = create2DMapping(entityLables, relationsFormatted);

    function toggleSemanticBar() {
      const isVisible =
        d3.select("#semanticGradient").style("display") !== "none";

      d3.selectAll(
        "#semanticGradient, .semanticBarLabel, .semanticBarBox"
      ).style("display", isVisible ? "none" : "block");
    }

    const margin = { top: 20, right: 100, bottom: 30, left: 20 };
    const width = 600 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3
      .select("#graph-container")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // build axes
    const x = d3
      .scaleBand()
      .range([0, width])
      .domain(data.map((d) => d.column));

    const xAxis = svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    xAxis
      .selectAll(".tick text")
      .attr("transform", (d, i) => `translate(0, ${(i % 2) * 12})`)
      .style("text-anchor", "middle");

    const y = d3
      .scaleBand()
      .range([height, 0])
      .domain(data.map((d) => d.row));
    svg
      .append("g")
      .attr("transform", `translate(${width},0)`)
      .call(d3.axisRight(y));

    // Build color scale
    const myColor = d3
      .scaleLinear()
      .domain([0, 500, 1000, 2000])
      // @ts-ignore
      .range(["#133e13", "#cbf1d2", "#f50f0f", "rgba(255, 255, 255, 0)"]);

    // definitions
    const defs = svg.append("defs");

    // gradient definition for semantic bar
    const gradient = defs
      .append("linearGradient")
      .attr("id", "semanticGradient")
      .attr("x1", "0%")
      .attr("x2", "100%")
      .attr("y1", "0%")
      .attr("y2", "0%");

    gradient.append("stop").attr("offset", "0%").attr("stop-color", myColor(0));

    gradient
      .append("stop")
      .attr("offset", "50%")
      .attr("stop-color", myColor(500));

    gradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", myColor(1000));

    // Dropshadow filter
    const dropShadowFilter = defs
      .append("filter")
      .attr("id", "drop-shadow")
      .attr("height", "130%");

    dropShadowFilter
      .append("feGaussianBlur")
      .attr("in", "SourceAlpha")
      .attr("stdDeviation", 3);

    dropShadowFilter
      .append("feOffset")
      .attr("dx", -2)
      .attr("dy", -2)
      .attr("result", "offsetblur");

    dropShadowFilter
      .append("feFlood")
      .attr("flood-color", "yellow")
      .attr("flood-opacity", "0.8")
      .attr("result", "color");

    dropShadowFilter
      .append("feComposite")
      .attr("in", "color")
      .attr("in2", "offsetblur")
      .attr("operator", "in")
      .attr("result", "shadow");

    const feComponentTransfer = dropShadowFilter.append("feComponentTransfer");
    feComponentTransfer
      .append("feFuncA")
      .attr("type", "linear")
      .attr("slope", 0.5);

    const feMerge = dropShadowFilter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "shadow");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    //arrow line
    svg
      .append("defs")
      .append("marker")
      .attr("id", "arrowhead")
      .attr("markerWidth", 10)
      .attr("markerHeight", 7)
      .attr("refX", 10)
      .attr("refY", 3.5)
      .attr("orient", "auto")
      .append("polygon")
      .attr("points", "0 0, 10 3.5, 0 7")
      .attr("fill", "black");

    //arrow head
    svg
      .append("line")
      .attr("x1", 0 + x.bandwidth() / 2)
      .attr("y1", height)
      .attr("x2", width)
      .attr("y2", 0 + y.bandwidth() / 2)
      .attr("stroke", "black")
      .attr("stroke", "black")
      .attr("stroke", "black")
      .attr("stroke-width", 2)
      .attr("marker-end", "url(#arrowhead)");

    // relation squares
    svg
      .selectAll(".square")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.column))
      .attr("y", (d) => y(d.row))
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .attr("fill", (d) => myColor(d.distance))
      .attr("stroke-width", 2)
      .on("mouseover", (event, d) => {
        if (d.distance !== 2000) {
          tooltip.transition().duration(200).style("opacity", 0.8);
          tooltip
            .html(
              `<b>${d.row}:</b> ${d.sourceDescription}<br><b> ${d.col}:</b> ${d.targetDescription}<br><b>Interpretation:</b> ${d.interpretation}<br><b>Semantic Distance:</b> ${d.distance}`
            )
            .style("left", `${x(d.column) + x.bandwidth() / 2 + margin.left}px`)
            .style("top", `${y(d.row) + y.bandwidth() / 2 + margin.top}px`)
            .style("transform", "translate(0px, -390px");
        }

        d3.select(event.currentTarget).attr("filter", "url(#drop-shadow)");
      })
      .on("mouseout", (event, d) => {
        tooltip.transition().duration(1000).style("opacity", 0);
        d3.select(event.currentTarget).attr("filter", null);
      });

    // tooltip
    const tooltip = d3
      .select("#graph-container")
      .append("div")
      .attr("class", "tooltip")
      .style("background", "white")
      .style("opacity", 0)
      .style("font-size", "12px")
      .style("border", "1px solid #ccc")
      .style("padding", "5px")
      .style("max-width", "200px")
      .style("word-wrap", "break-word");

    // Draw the semantic distance bar
    svg
      .append("rect")
      .attr("x", -10)
      .attr("y", 0)
      .attr("width", width - 80)
      .attr("height", 80)
      .attr("fill", "white")
      .attr("stroke", "black")
      .attr("class", "semanticBarBox");

    const semanticBarHeight = 20;
    svg
      .append("rect")
      .attr("x", 0)
      .attr("y", 20)
      .attr("width", width - 100)
      .attr("height", semanticBarHeight)
      .style("fill", "url(#semanticGradient)");

    // Add text labels for the semantic distance bar and description
    svg
      .append("text")
      .attr("x", 0)
      .attr("y", semanticBarHeight - 10)
      .attr("dy", ".35em")
      .attr("class", "semanticBarLabel")
      .style("font-size", "12px")
      .text("Closely related");

    svg
      .append("text")
      .attr("x", width - 100)
      .attr("y", semanticBarHeight - 10)
      .attr("dy", ".35em")
      .attr("text-anchor", "end")
      .attr("class", "semanticBarLabel")
      .style("font-size", "12px")
      .text("Not related");

    svg
      .append("text")
      .attr("x", 0)
      .attr("y", semanticBarHeight + 30)
      .attr("dy", ".35em")
      .attr("class", "semanticBarLabel")
      .style("font-size", "12px")
      .text("0");

    svg
      .append("text")
      .attr("x", (width - 80) / 2 - 10)
      .attr("y", semanticBarHeight + 30)
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .attr("class", "semanticBarLabel")
      .style("font-size", "12px")
      .text("500");

    svg
      .append("text")
      .attr("x", width - 100)
      .attr("y", semanticBarHeight + 30)
      .attr("dy", ".35em")
      .attr("text-anchor", "end")
      .attr("class", "semanticBarLabel")
      .style("font-size", "12px")
      .text("1000");

    svg
      .append("text")
      .attr("x", 0)
      .attr("y", semanticBarHeight + 50)
      .attr("dy", ".35em")
      .attr("text-anchor", "start")
      .attr("class", "semanticBarLabel")
      .attr("font-weight", 700)
      .style("font-size", "10px")
      .text(
        "The semantic distance of two entities quantifies how closely they are related."
      );

    //Infobutton
    svg
      .append("text")
      .attr("x", width - 10)
      .attr("y", 20)
      .attr("text-anchor", "end")
      .style("font-size", "25px")
      .style("cursor", "pointer")
      .text("🛈")
      .on("click", toggleSemanticBar);

    // Hide semanticbar at start
    d3.selectAll("#semanticGradient, .semanticBarLabel, .semanticBarBox").style(
      "display",
      "none"
    );
  };

  function create2DMapping(allLabels, dataArray) {
    const data = [];
    const distanceMap = {}; // Mapping for source-target pairs to distance
    const interpretationMap = {}; // Mapping for source-target pairs to interpretation
    const descriptionMap = {}; // Mapping for the descritptions of entities of a relation

    // Precompute labels, distance, and interpretation mapping
    dataArray.forEach((link) => {
      const sourceLabel = getLabelForId(
        link.data.source,
        theSelectedPath.parsedPath
      );
      const targetLabel = getLabelForId(
        link.data.target,
        theSelectedPath.parsedPath
      );
      const sortedLabels = [sourceLabel, targetLabel].sort().join(); // Sorting ensures one-way mapping for two labels
      distanceMap[sortedLabels] = parseInt(link.data.distance, 10);
      interpretationMap[sortedLabels] = link.data.interpretion;

      descriptionMap[sortedLabels] = [
        link.data.sourceDescription,
        link.data.targetDescription,
      ];
    });

    const uniqueRows = [...new Set(allLabels)];
    const uniqueColumns = [...new Set(allLabels)];

    uniqueRows.forEach((rowItem, rowIndex) => {
      uniqueColumns.forEach((colItem, colIndex) => {
        if (rowItem === colItem) {
          // Set value for diagonal cells
          data.push({
            row: rowItem,
            column: colItem,
            distance: 2000,
            interpretation: "",
          });
        } else if (rowIndex < colIndex) {
          // Only fill data below the diagonal
          const sortedLabels = [rowItem, colItem].sort().join();
          const val =
            distanceMap[sortedLabels] !== undefined
              ? distanceMap[sortedLabels]
              : undefined;
          const interpretation = interpretationMap[sortedLabels] || "";

          if (val !== undefined) {
            // Only push the data if val is not undefined
            data.push({
              row: rowItem,
              column: colItem,
              distance: val,
              interpretation: interpretation,
              sourceDescription: descriptionMap[sortedLabels][0],
              targetDescription: descriptionMap[sortedLabels][1],
            });
          }
        }
      });
    });

    return data;
  }

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
    height: 500px;
  }
</style>
