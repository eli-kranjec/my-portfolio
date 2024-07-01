<script>
  import * as d3 from "d3";
  import { onMount, tick } from "svelte";
  import Pie from "$lib/Pie.svelte";
  import { computePosition, autoPlacement, offset } from "@floating-ui/dom";
  export let commits = [];
  export let selectedCommits = [];
  let cursor = { x: 0, y: 0 };
  let hoveredIndex = -1;
  let commitTooltip;
  let tooltipPosition = { x: 0, y: 0 };
  let svg;

  $: {
    yScale = d3
      .scaleLinear()
      .domain([0, 24])
      .range([height - margin.bottom, margin.top]);
    xScale = d3
      .scaleTime()
      .domain(d3.extent(commits, (d) => d.datetime))
      .range([margin.left, width - margin.right]);
  }

  let width = 1000,
    height = 600;
  let xScale, yScale;
  let margin = { top: 10, right: 10, bottom: 30, left: 20 };
  let usableArea = {
    top: margin.top,
    right: width - margin.right,
    bottom: height - margin.bottom,
    left: margin.left,
  };

  usableArea.width = usableArea.right - usableArea.left;
  usableArea.height = usableArea.bottom - usableArea.top;
  let xAxis, yAxis;

  function dotInteraction(index, evt) {
    if (evt.type === "mouseenter" || evt.type === "focus") {
      hoveredIndex = index;
      cursor = { x: evt.x, y: evt.y };
    } else if (evt.type === "mouseleave" || evt.type === "blur") {
      hoveredIndex = -1;
    } else if (
      evt.type === "click" ||
      (evt.type === "keyup" && evt.key === "Enter")
    ) {
      selectedCommits = [commits[index]];
      console.log("click detected");
    }
    console.log(evt.type);
  }

  $: {
    if (xScale && yScale) {
      d3.select(xAxis).call(d3.axisBottom(xScale));
      d3.select(yAxis).call(
        d3
          .axisLeft(yScale)
          .tickFormat((d) => String(d % 24).padStart(2, "0") + ":00")
      );
      d3.select(yAxisGridlines).call(
        d3.axisLeft(yScale).tickFormat("").tickSize(-usableArea.width)
      );
    }
  }
  let yAxisGridlines;
  function brushed(evt) {
    let brushSelection = evt.selection;
    selectedCommits = !brushSelection
      ? []
      : commits.filter((commit) => {
          let min = { x: brushSelection[0][0], y: brushSelection[0][1] };
          let max = { x: brushSelection[1][0], y: brushSelection[1][1] };
          let x = xScale(commit.date);
          let y = yScale(commit.hourFrac);

          // console.log(x, y, min.x, min.y);
          // console.log(x >= min.x && x <= max.x && y >= min.y && y <= max.y);
          // console.log(d3.extent(commits, (d) => d.datetime));
          return x >= min.x && x <= max.x && y >= min.y && y <= max.y;
        });
  }

  let brushSelection;

  function isCommitSelected(commit) {
    return selectedCommits.includes(commit);
  }

  $: {
    if (svg) {
      d3.select(svg).call(d3.brush().on("start brush end", brushed));
      // d3.select(svg).selectAll(".dots, .overlay ~ *").raise();
      console.log(d3.select(svg).selectAll(".dots ~ *"));
    }
  }

  $: hoveredCommit = commits[hoveredIndex] ?? hoveredCommit ?? {};
</script>

<dl
  id="commit-tooltip"
  class="info tooltip"
  hidden={hoveredIndex === -1}
  style="top: {cursor.y}px; left: {cursor.x}px"
  bind:this={commitTooltip}
>
  <dt>Commit ID</dt>
  <dd><a href={hoveredCommit.url} target="_blank">{hoveredCommit.id}</a></dd>

  <dt>Date</dt>
  <dd>{hoveredCommit.datetime?.toLocaleString("en", { dateStyle: "full" })}</dd>

  <dt>Author</dt>
  <dd>{hoveredCommit.author?.toLocaleString("en")}</dd>

  <dt>Time</dt>
  <dd>{hoveredCommit.time?.toLocaleString("en")}</dd>

  <dt>Lines edited</dt>
  <dd>{hoveredCommit.lines?.length}</dd>
</dl>

<h1>Commits by Time of Day</h1>
<svg viewBox={`0 0 ${width} ${height}`} bind:this={svg}>
  <g transform={`translate(0, ${height - margin.bottom})`} bind:this={xAxis} />
  <g transform={`translate(${margin.left}, 0)`} bind:this={yAxis} />
  <g
    class="gridlines"
    transform="translate({usableArea.left}, 0)"
    bind:this={yAxisGridlines}
  />
  {#each commits as commit, index (commit.id)}
    <g class="dots">
      <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
      <!-- svelte-ignore a11y_role_supports_aria_props -->
      <circle
        cx={xScale(commit.datetime)}
        cy={yScale(commit.hourFrac)}
        onmouseenter={(evt) => dotInteraction(index, evt)}
        onmouseleave={(evt) => dotInteraction(index, evt)}
        tabindex="0"
        aria-describedby="commit-tooltip"
        role="tooltip"
        aria-haspopup="true"
        onfocus={(evt) => dotInteraction(index, evt)}
        onblur={(evt) => dotInteraction(index, evt)}
        onclick={(evt) => dotInteraction(index, evt)}
        r="5"
        fill="steelblue"
        class={isCommitSelected(commit) ? "selected_commit" : ""}
      />
    </g>
  {/each}
</svg>

<style>
  svg {
    /* let margin = { top: 10, right: 10, bottom: 30, left: 20 }; */

    margin-top: 10;
    margin-right: 10;
    margin-bottom: 30;
    margin-left: 20;
  }

  dl.info {
    margin: 4em;
    display: grid;
    font-size: 15px;
    transition-duration: 500ms;
    transition-property: opacity, visibility;
    &[hidden]:not(:hover, :focus-within) {
      opacity: 0;
      visibility: hidden;
    }
  }

  .tooltip {
    position: fixed;
    background-color: oklch(100% 0% 0 / 80%);
    box-shadow: 10px white;
    border-radius: 10px;
    padding: 20px;
  }

  circle {
    transition: 200ms;
    transform-origin: center;
    transform-box: fill-box;
    &:hover {
      transform: scale(1.5);
    }

    @starting-style {
      r: 0;
    }
  }

  @keyframes marching-ants {
    to {
      stroke-dashoffset: -8; /* 5 + 3 */
    }
  }

  svg :global(.selection) {
    fill-opacity: 10%;
    stroke: grey;
    stroke-opacity: 70%;
    stroke-dasharray: 5 3;
    animation: marching-ants 2s linear infinite;
  }

  .selected_commit {
    fill: red;
  }

  input {
    accent-color: blue;
  }
</style>
