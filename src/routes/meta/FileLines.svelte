<script>
  export let lines;
  export let colors = d3.scaleOrdinal(d3.schemeTableau10);
  import * as d3 from "d3";
  import { onMount, tick } from "svelte";
  import { computePosition, autoPlacement, offset } from "@floating-ui/dom";
  import { scale } from "svelte/transition";
  import { quintOut } from "svelte/easing";
  import { flip as originalFlip } from "svelte/animate";

  let files = [];

  $: {
    files = d3
      .groups(lines, (d) => d.file)
      .map(([name, lines]) => {
        return { name, lines };
      });

    files = d3.sort(files, (d) => -d.lines.length);
  }

  function getFlip() {
    return originalFlip;
  }
  $: flip = getFlip(files);
</script>

<dl class="files">
  {#each files as file (file.name)}
    <div animate:flip={{ duration: 1000 }}>
      <dt>
        <code>{file.name}</code>
      </dt>
      <dd>
        {#each file.lines as line (line.line)}
          <div
            class="line"
            style="background-color: {colors(line.type)}"
            in:scale
          ></div>
        {/each}
      </dd>
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
    display: flex;
    flex-wrap: wrap;
    align-items: start;
    align-content: start;
    gap: 0.15em;
    padding-top: 0.6em;
    margin-left: 0;
  }

  .line {
    display: flex;
    width: 0.5em;
    aspect-ratio: 1;
    border-radius: 50%;
  }
</style>
