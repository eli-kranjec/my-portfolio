<script>
  export let lines;
  import * as d3 from "d3";
  import { onMount, tick } from "svelte";
  import { computePosition, autoPlacement, offset } from "@floating-ui/dom";

  let files = [];
  $: {
    files = d3
      .groups(lines, (d) => d.file)
      .map(([name, lines]) => {
        return { name, lines };
      });
  }
</script>

<dl class="files">
  {#each files as file (file.name)}
    <div>
      <dt>
        <code>{file.name}</code>
      </dt>
      <dd>{file.lines.length} lines</dd>
    </div>
  {/each}
</dl>

<style>
  dl {
    & > div {
      grid-column: 1 / -1;
      display: grid;
      grid-template-columns: subgrid;
    }
  }

  dd {
    grid-column: 1;
  }
</style>
