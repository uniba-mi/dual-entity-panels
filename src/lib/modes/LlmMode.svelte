<script>
  import { selectedPath } from "../../stores.js";

  let theSelectedPath;

  selectedPath.subscribe((value) => (theSelectedPath = value));
</script>

<div class="container">
  <div class="row">
    <div class="col mt-3">
      <p class="fs-7">{theSelectedPath.textual}</p>
    </div>
  </div>
</div>
