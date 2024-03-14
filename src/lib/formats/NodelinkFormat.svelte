<script>
  import { onMount } from "svelte";
  import * as d3 from "d3";

  import { selectedPath } from "../../stores.js";
  import {
    getDescriptionForId,
    getLabelForId,
    getPathEntities,
    getPathRelations,
    getRelationInformation,
  } from "../../util.js";

  let theSelectedPath;
  selectedPath.subscribe((value) => (theSelectedPath = value));

  const initGraph = () => {
    const relations = getPathRelations(theSelectedPath.parsedPath);

    const relationInformation = getRelationInformation(
      relations,
      theSelectedPath.parsedPath
    );

    // switch target and source in case the path siwtches "direction" for consistency of data structure
    let previousTarget;
    const data = relationInformation.map((relation, index) => {
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

      if (index > 0 && previousTarget !== source) {
        [source, target] = [target, source];
        [sourceLabel, targetLabel] = [targetLabel, sourceLabel];
      }

      previousTarget = target;

      return {
        id: relation.predicate + index,
        source: source,
        sourceLabel: sourceLabel,
        sourceDescription: sourceDescription,
        target: target,
        targetLabel: targetLabel,
        targetDescription: targetDescription,
        distance: parseInt(relation.semanticDistance),
        interpretation: relation.interpretation,
        label: label,
      };
    });

    //wrap text with specified line width

    function wrap(text, width) {
      text.each(function () {
        var text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.1,
          y = text.attr("y"),
          dy = 0,
          tspan = text
            .text(null)
            .append("tspan")
            .attr("x", text.attr("x"))
            .attr("y", y)
            .attr("dy", dy + "em");

        while ((word = words.pop())) {
          line.push(word);
          tspan.text(line.join(" "));
          if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text
              .append("tspan")
              .attr("x", text.attr("x"))
              .attr("y", y)
              .attr("dy", ++lineNumber * lineHeight + "em")
              .text(word);
          }
        }

        const numLines = lineNumber + 1;
        text
          .selectAll("tspan")
          .attr(
            "dy",
            (_, i) =>
              `${
                (-lineHeight * numLines) / 2 + lineHeight / 2 + i * lineHeight
              }em`
          );
      });
    }

    //defintions
    const margin = { top: 150, right: 5, bottom: 150, left: 5 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const circleRadius = 40;
    const circleDiameter = circleRadius * 2;
    const minGap = 10;
    const totalCirclesWidth = (data.length + 1) * circleDiameter;
    const totalDistance = data.reduce((acc, d) => acc + d.distance, 0);

    const totalAvailableWidthForGaps = width - totalCirclesWidth;

    // proportinal distance for each relation
    let proportionalDistances = data.map(
      (d) => (d.distance / totalDistance) * totalAvailableWidthForGaps
    );

    let totalProportionalDistance = proportionalDistances.reduce(
      (acc, d) => acc + Math.max(d, minGap),
      0
    );
    // adjustment factor to scale total width of gaps
    let adjustmentFactor =
      totalAvailableWidthForGaps / totalProportionalDistance;
    let gapWidths = proportionalDistances.map(
      (d) => Math.max(d, minGap) * adjustmentFactor
    );

    // add distances to relation objects
    let accumulatedWidth = 0;
    const nodes = [];
    data.forEach((d, i) => {
      nodes.push({
        id: d.source,
        label: d.sourceLabel,
        x: accumulatedWidth + circleRadius,
        y: height / 2,
      });

      if (i === data.length - 1) {
        nodes.push({
          id: d.target,
          label: d.targetLabel,
          x:
            accumulatedWidth +
            circleRadius +
            (gapWidths[i] ? gapWidths[i] + circleDiameter : 0),
          y: height / 2,
        });
      }

      if (i < gapWidths.length) {
        accumulatedWidth += gapWidths[i] + circleDiameter;
      }
    });

    function toggleSemanticBar() {
      const isVisible =
        d3.select("#semanticGradient").style("display") !== "none";

      d3.selectAll(
        "#semanticGradient, .semanticBarLabel, .semanticBarBox"
      ).style("display", isVisible ? "none" : "block");
    }

    //mouseover and out event which can be reused for multple elements

    function handleMouseOver(event, d) {
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip
        .html(
          `<b>${d.sourceLabel}:</b> ${d.sourceDescription}<br><b> ${d.targetLabel}:</b> ${d.targetDescription}<br><b>Interpretation:</b> ${d.interpretation}<br><b>Semantic Distance:</b> ${d.distance}`
        )
        .style("left", `${event.pageX}px`)
        .style("top", `${event.pageY}px`)
        .style("transform", "translate(0px,-80px)");

      d3.select(event.currentTarget).attr("filter", "url(#drop-shadow)");
    }

    function handleMouseOut(event, d) {
      tooltip.transition().duration(500).style("opacity", 0);
      d3.select(event.currentTarget).attr("filter", null);
    }

    const myColor = d3
      .scaleLinear()
      .domain([0, 500, 1000, 2000])
      // @ts-ignore
      .range(["#133e13", "#cbf1d2", "#f50f0f"]);

    const svg = d3
      .select("#graph-container")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

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

    const padding = { left: 4, right: 4, top: 2, bottom: 2 };
    const verticalOffset = 20;
    const maxWidth = 90;
    const minHeight = 10; // Minimum height of the rectangle
    const maxHeight = 70; // Maximum height of the rectangle

    //create realtions rectangles, dotted lines and textual description
    const lineLabels = svg
      .selectAll(".line-label")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "line-label-group")
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut)
      .each(function (d, i) {
        const group = d3.select(this);

        // Create a scale for rectangle height (inversely proportional to distance)
        const heightScale = d3
          .scaleLinear()
          // @ts-ignore
          .domain([
            d3.min(data, (d) => d.distance),
            d3.max(data, (d) => d.distance),
          ])
          .range([maxHeight, minHeight]);

        const rectHeight = heightScale(d.distance);
        const rectWidth = gapWidths[i] + circleDiameter;
        const rectX = nodes.find((node) => node.id === d.source).x;
        const rectY = height / 2 - rectHeight / 2;

        // add relation rectangle
        group
          .append("rect")
          .attr("class", "connection-rect")
          .attr("x", rectX)
          .attr("y", rectY)
          .attr("width", rectWidth)
          .attr("height", rectHeight)
          .attr("fill", myColor(d.distance));

        // Draw dotted line

        const lineMiddleX =
          (nodes.find((node) => node.id === d.source).x +
            nodes.find((node) => node.id === d.target).x) /
          2;
        const lineMiddleY =
          (nodes.find((node) => node.id === d.source).y +
            nodes.find((node) => node.id === d.target).y) /
          2;
        const dottedLine = group
          .append("line")
          .attr("class", "dotted-line")
          .attr("x1", lineMiddleX)
          .attr("y1", lineMiddleY)
          .attr("x2", lineMiddleX) // Temporary x2, y2, will be adjusted after creating the label box
          .attr("y2", lineMiddleY)
          .attr("stroke", myColor(d.distance))
          .attr("stroke-width", 5)
          .attr("stroke-dasharray", "5, 5");

        // Add text to the label groups
        const label = group
          .append("text")
          .attr("class", "line-label")
          .attr("x", lineMiddleX)
          .attr(
            "y",
            nodes.find((node) => node.id === d.target).y +
              circleRadius +
              verticalOffset +
              20
          ) // Adjusted to be under the circles
          .attr("text-anchor", "middle")
          .style("font-size", "12px")
          .text((d) => d.label)
          .call(wrap, maxWidth);

        // Get the bounding box of the text element
        const bbox = label.node().getBBox();
        const paddingX = padding.left + padding.right;
        const paddingY = padding.top + padding.bottom;

        // Create rectangles for the label boxes
        group
          .insert("rect", "text")
          .attr("class", "line-label-box")
          .attr("x", bbox.x - padding.left)
          .attr("y", bbox.y - padding.top)
          .attr("width", bbox.width + paddingX)
          .attr("height", bbox.height + paddingY)
          .attr("fill", "white")
          .attr("stroke", "black")
          .attr("opacity", 1);

        dottedLine
          .attr("x2", bbox.x - padding.left + (bbox.width + paddingX) / 2)
          .attr("y2", bbox.y - padding.top + bbox.height + paddingY / 2);
      });

    //create tooltip
    const tooltip = d3
      .select("#graph-container")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("font-size", "12px")
      .style("border", "1px solid #ccc")
      .style("padding", "5px")
      .style("max-width", width + "px")
      .style("word-wrap", "break-word");

    svg
      .selectAll(".node")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("class", "node")
      .attr("r", 40)
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .style("fill", "white")
      .style("stroke", "black")
      .style("stroke-width", "3px");

    const labels = svg
      .selectAll(".label")
      .data(nodes)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("text-anchor", "middle")
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y)
      .text((d) => d.label)
      .style("font-size", "12px")
      .call(wrap, circleRadius * 2 - 10);

    // Draw the semantic distance bar
    svg
      .append("rect")
      .attr("x", 0)
      .attr("y", -100)
      .attr("width", width)
      .attr("height", 80)
      .attr("fill", "white")
      .attr("stroke", "black")
      .attr("class", "semanticBarBox");

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
      .attr("x", width)
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
