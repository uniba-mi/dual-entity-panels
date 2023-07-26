<script>
  import { selectedPath } from "../../stores.js";

  let theSelectedPath;

  selectedPath.subscribe((value) => (theSelectedPath = value));
</script>

<div class="container">
  <div class="row">
    <div class="col mt-3">
      <pre class="fs-7">{theSelectedPath.rawPath}</pre>
    </div>
  </div>
</div>

<style>
  pre {
    white-space: pre-wrap;
  }
</style>
