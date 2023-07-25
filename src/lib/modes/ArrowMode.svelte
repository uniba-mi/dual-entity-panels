<script>
  import { onMount } from "svelte";
  import { selectedPath } from "../../stores.js";

  import {
    getLabelForId,
    getPathRelations,
  } from "../../util.js";

  let theSelectedPath;
  selectedPath.subscribe((value) => (theSelectedPath = value));

  let arrowString = "";

  onMount(() => {
    let relations = getPathRelations(theSelectedPath.parsedPath);
    arrowString = "";

    for (let relation of relations) {
      let { subject, predicate, object } = relation;

      if (arrowString === "") {
        arrowString += `${subject} (${getLabelForId(
          subject,
          theSelectedPath.parsedPath
        )}) -${predicate} (${getLabelForId(
          predicate,
          theSelectedPath.parsedPath
        )})\u2192
${object} (${getLabelForId(object, theSelectedPath.parsedPath)})`;
      } else if (arrowString.includes(subject)) {
        arrowString += ` -${predicate} (${getLabelForId(
          predicate,
          theSelectedPath.parsedPath
        )})\u2192
${object} (${getLabelForId(object, theSelectedPath.parsedPath)})`;
      } else {
        arrowString += `
\u2190${predicate} (${getLabelForId(
          predicate,
          theSelectedPath.parsedPath
        )})- ${subject} (${getLabelForId(
          subject,
          theSelectedPath.parsedPath
        )})`;
      }
    }
  });
</script>

<div class="container">
  <div class="row">
    <div class="col mt-3">
      <pre class="fs-6">{arrowString}</pre>
    </div>
  </div>
</div>

<style>
  pre {
    white-space: pre-wrap;
  }
</style>
