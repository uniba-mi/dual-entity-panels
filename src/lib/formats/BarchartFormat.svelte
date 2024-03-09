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
    const relations = getPathRelations(theSelectedPath.parsedPath);

    const entities = getPathEntities(theSelectedPath.parsedPath);

    const entityLables = entities.map((entity) => {
      return getLabelForId(entity, theSelectedPath.parsedPath);
    });

    const relationInformation = getRelationInformation(
      relations,
      theSelectedPath.parsedPath
    );

    const data = relationInformation.map((relation, index) => {
      let source = relation.subject;
      let target = relation.object;
      let sourceLabel = getLabelForId(source, theSelectedPath.parsedPath);
      let targetLabel = getLabelForId(target, theSelectedPath.parsedPath);

      return {
        id: relation.predicate + index,
        source: source,
        sourceLabel: sourceLabel,
        sourceDescription: getDescriptionForId(
          source,
          theSelectedPath.parsedPath
        ),
        target: target,
        targetLabel: targetLabel,
        targetDescription: getDescriptionForId(
          target,
          theSelectedPath.parsedPath
        ),
        distance: parseInt(relation.semanticDistance),
        interpretation: relation.interpretation,
        label: getLabelForId(relation.predicate, theSelectedPath.parsedPath),
      };
    });

    const margin = { top: 150, right: 30, bottom: 150, left: 30 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const sectionWidth = width / data.length;

    const stackData = [];
    let currentX = 0;

    const totalDistance = data.reduce((acc, val) => acc + val.distance, 0);

    // Calculate section widths (proportional and within 25% deviation)
    const minFactor = 0.75; // minimum deviation factor
    const maxFactor = 1.25; // maximum deviation factor
    let calculatedWidths = data.map((d) => {
      let proportionalWidth = (d.distance / totalDistance) * width;
      let minWidth = sectionWidth * minFactor;
      let maxWidth = sectionWidth * maxFactor;
      return Math.max(minWidth, Math.min(proportionalWidth, maxWidth));
    });

    // Normalize the widths so that their sum equals the total width
    let sumCalculatedWidths = calculatedWidths.reduce(
      (acc, val) => acc + val,
      0
    );
    let normalizedWidths = calculatedWidths.map(
      (w) => (w / sumCalculatedWidths) * width
    );

    let roundedWidths = normalizedWidths.map((w) => Math.round(w));
    roundedWidths[roundedWidths.length - 1] =
      width - roundedWidths.slice(0, -1).reduce((acc, val) => acc + val, 0);

    // add widths to stack data
    roundedWidths.forEach((width, index) => {
      stackData.push({
        ...data[index],
        x0: currentX,
        x1: (currentX += width),
      });
    });

    function toggleSemanticBar() {
      const isVisible =
        d3.select("#semanticGradient").style("display") !== "none";

      d3.selectAll(
        "#semanticGradient, .semanticBarLabel, .semanticBarBox"
      ).style("display", isVisible ? "none" : "block");
    }

    d3.selectAll("#semanticGradient, .semanticBarLabel, .semanticBarBox").style(
      "display",
      "none"
    );

    // function to wrap text for relation labels returns wrapped text and adds amoint of line numbers to relation label for vertical allignment
    function wrap(text, width) {
      text.each(function () {
        var text = d3.select(this),
          words = text
            .text()
            .split(/(?=[ \t\n])/)
            .reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.1, // ems
          y = text.attr("y"),
          dy = parseFloat(text.attr("dy")),
          tspan = text
            .text(null)
            .append("tspan")
            .attr("x", text.attr("x"))
            .attr("y", y)
            .attr("dy", dy + "em");

        while ((word = words.pop())) {
          line.push(word);
          tspan.text(line.join(""));
          if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(""));
            line = [word];
            tspan = text
              .append("tspan")
              .attr("x", text.attr("x"))
              .attr("y", y)
              .attr("dy", ++lineNumber * lineHeight + dy + "em")
              .text(word);
          }
        }
        text.property("lineNumber", lineNumber + 1);
      });
    }

    const svg = d3
      .select("#graph-container")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    //Create axes
    const x = d3.scaleLinear().domain([0, currentX]).range([0, width]);

    const y = d3.scaleBand().range([height, 0]).domain(["Stack"]).padding(0.1);

    // color scale
    const myColor = d3
      .scaleLinear()
      .domain([0, 500, 1000])
      // @ts-ignore
      .range(["#133e13", "#cbf1d2", "#f50f0f"]);

    //Draw the realtions as Polygons

    const triangleWidth = 20;
    const bars = svg
      .selectAll(".bar")
      .data(stackData)
      .enter()
      .insert("polygon", ":first-child")
      .attr("class", "bar")
      .attr("points", (d, i) => {
        const x0 = d.x0; // X-position for the start of the bar
        const x1 = d.x1; // X-position for the end of the rectangle part
        const x2 = x1 + triangleWidth; // X-position for the end of the triangle part
        const y0 = y("Stack"); // Y-position for the top of the bar
        const y1 = y0 + y.bandwidth();

        if (i === stackData.length - 1) {
          return `${x0},${y0} ${x0},${y1} ${x2 - triangleWidth},${y1} ${
            x2 - triangleWidth
          },${y0} ${x0},${y0}`;
        } else {
          return `${x0},${y0} ${x0},${y1} ${x1},${y1} ${x2},${
            (y0 + y1) / 2
          } ${x1},${y0} ${x0},${y0}`;
        }
      })
      .style("fill", (d) => myColor(d.distance))
      .style("stroke", "black")
      .style("stroke-width", "3px")
      .each(function (d, i) {
        d3.select(this).style("z-index", stackData.length - i);
      });

    //add relation labels to bars
    const labels = svg
      .selectAll(".bar-label")
      .data(stackData)
      .enter()
      .append("text")
      .attr("class", "bar-label")
      .attr("x", (d, i) => {
        const barCenter = d.x0 + (d.x1 - d.x0) / 2;
        if (i === 0) {
          return barCenter + 5;
        } else if (i === stackData.length - 1) {
          return barCenter + 10;
        } else {
          return barCenter + 15;
        }
      })
      .attr("y", () => y("Stack") + y.bandwidth() / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .text((d) => d.label)
      .style("fill", "black")
      .style("font-size", "12px")
      .style("pointer-events", "none");

    //wrap labels with wrap() call
    labels
      .each(function (d, i) {
        const barWidth = d.x1 - d.x0;

        let maxWidth;
        if (i === 0) {
          maxWidth = barWidth - 5;
        } else if (i === stackData.length - 1) {
          maxWidth = barWidth - 20;
        } else {
          maxWidth = barWidth - 10;
        }
        wrap(d3.select(this), maxWidth);
      })
      .each(function () {
        const textElement = d3.select(this);
        const lineNumber = textElement.property("lineNumber");
        const lineHeight = 12;
        let newY =
          parseFloat(textElement.attr("y")) -
          ((lineNumber - 1) / 2) * lineHeight;
        textElement.attr("y", newY);
        textElement.selectAll("tspan").attr("y", newY);
      });

    //Add Tooltip and hoverfunctionality for individual bars
    const tooltip = d3
      .select("#graph-container")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("font-size", "12px")
      .style("border", "1px solid #ccc")
      .style("padding", "5px")
      .style("max-width", width)
      .style("word-wrap", "break-word")
      .style(
        "box-shadow",
        "5px -4px 4px 0 rgba(0, 0, 0, 0.05), 5px -6px 10px 0 rgba(255, 255, 0, 0.5)"
      );

    // add hover functionality
    bars
      .on("mouseover", (event, d) => {
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip
          .html(
            `<b>${d.sourceLabel}:</b> ${d.sourceDescription}<br><b> ${d.targetLabel}:</b> ${d.targetDescription}<b><br>Interpretation:</b> ${d.interpretation}<br><b>Semantic Distance:</b> ${d.distance}<br>`
          )
          .style("left", `${x(d.x0) + (x(d.x1) - x(d.x0)) / 2 + margin.left}px`)
          .style("top", `${y("Stack") + margin.top}px`)
          .style("transform", "translate(0px,-80px)");

        d3.select(event.currentTarget).attr("filter", "url(#drop-shadow)");
      })
      .on("mouseout", (event, d) => {
        tooltip.transition().duration(500).style("opacity", 0);

        d3.select(event.currentTarget).attr("filter", null);
      });

    // add entity labels
    stackData.forEach((d, i) => {
      svg
        .append("text")
        .attr("x", d.x0)
        .attr("y", height + 20 + (i % 2) * 20)
        .attr("dy", ".35em")
        .attr("text-anchor", i === 0 ? "start" : "middle")
        .style("font-size", "12px")
        .text(entityLables[i]);
    });

    //Add last label
    svg
      .append("text")
      .attr("x", stackData.length * sectionWidth)
      .attr("y", height + 20 + (stackData.length % 2) * 20)
      .attr("dy", ".35em")
      .attr("text-anchor", "end")
      .style("font-size", "12px")
      .text(entityLables[entityLables.length - 1]);

    // add lines to connect label with sections at the start of each section
    stackData.forEach((d, i) => {
      svg
        .append("line")
        .style("stroke", "black")
        .style("stroke-width", "3px")
        .attr("x1", d.x0)
        .attr("y1", y.bandwidth() + 10)
        .attr("x2", d.x0)
        .attr("y2", y("Stack") + y.bandwidth() + 15 + (i % 2) * 20);

      // add line for last section
      if (i === stackData.length - 1) {
        svg
          .append("line")
          .style("stroke", "black")
          .style("stroke-width", "3px")
          .attr("x1", (i + 1) * sectionWidth)
          .attr("y1", y.bandwidth() + 10)
          .attr("x2", (i + 1) * sectionWidth)
          .attr("y2", y("Stack") + y.bandwidth() + 15 + ((i + 1) % 2) * 20);
      }
    });

    // definitions
    const defs = svg.append("defs");

    // gradient definition for semantic bar
    const gradient = defs
      .append("linearGradient")
      .attr("id", "semanticGradient")
      .attr("x1", "0%")
      .attr("x2", "100%")
      .attr("y1", "0%")
      .attr("y2", "0%")
      .style("display", "none");

    gradient.append("stop").attr("offset", "0%").attr("stop-color", myColor(0)); // Color for closely related

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

    // Draw box for semantic bar
    svg
      .append("rect")
      .attr("x", 0)
      .attr("y", -100)
      .attr("width", width)
      .attr("height", 80)
      .attr("fill", "white")
      .attr("stroke", "black")
      .attr("class", "semanticBarBox");

    // Draw the semantic distance bar
    const semanticBarHeight = 20;
    svg
      .append("rect")
      .attr("x", 10)
      .attr("y", -semanticBarHeight - 60)
      .attr("width", width - 20)
      .attr("height", semanticBarHeight)
      .style("fill", "url(#semanticGradient)");

    // Add text labels for the semantic distance bar and description
    svg
      .append("text")
      .attr("x", 10)
      .attr("y", -semanticBarHeight - 70)
      .attr("dy", ".35em")
      .attr("class", "semanticBarLabel")
      .style("font-size", "12px")
      .text("Closely related");

    svg
      .append("text")
      .attr("x", width - 10)
      .attr("y", -semanticBarHeight - 70)
      .attr("dy", ".35em")
      .attr("text-anchor", "end")
      .attr("class", "semanticBarLabel")
      .style("font-size", "12px")
      .text("Not related");

    svg
      .append("text")
      .attr("x", 10)
      .attr("y", -semanticBarHeight - 30)
      .attr("dy", ".35em")
      .attr("class", "semanticBarLabel")
      .style("font-size", "12px")
      .text("0");

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", -semanticBarHeight - 30)
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .attr("class", "semanticBarLabel")
      .style("font-size", "12px")
      .text("500");

    svg
      .append("text")
      .attr("x", width - 10)
      .attr("y", -semanticBarHeight - 30)
      .attr("dy", ".35em")
      .attr("text-anchor", "end")
      .attr("class", "semanticBarLabel")
      .style("font-size", "12px")
      .text("1000");

    svg
      .append("text")
      .attr("x", 10)
      .attr("y", -semanticBarHeight - 10)
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
      .attr("x", width + 5)
      .attr("y", 0)
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
    height: 450px;
  }
</style>
