<script>
  //fix brushing, come back to lab 7 later

  import * as d3 from "d3";
  import { onMount, tick } from "svelte";
  import Pie from "$lib/Pie.svelte";
  import { computePosition, autoPlacement, offset } from "@floating-ui/dom";

  let data = [];
  let commits = [];
  let svg;
  let cursor = { x: 0, y: 0 };
  let hoveredIndex = -1;
  let selectedCommits = [];
  let commitTooltip;
  let tooltipPosition = { x: 0, y: 0 };
  let commitProgress = 100;
  let commitMaxTime;
  let filteredCommits;
  let filteredLines;

  $: {
    if (commits) {
      filteredCommits = commits.filter(
        (commit) => commit.datetime <= commitMaxTime
      );
    }
  }

  $: {
    if (data) {
      filteredLines = data.filter((line) => line.datetime <= commitMaxTime);
    }
  }

  $: timeScale = d3
    .scaleTime()
    .domain([0, 100])
    .range(d3.extent(commits, (d) => d.datetime));
  $: {
    commitMaxTime = timeScale(commitProgress);
  }

  //.range(d3.extent(d3.rollup(commits, (d) => d.time)))

  $: hoveredCommit = filteredCommits[hoveredIndex] ?? hoveredCommit ?? {};

  let fileLengths = [];
  let averageFileLength = 0;
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
  onMount(async () => {
    data = await d3.csv("loc.csv", (row) => ({
      ...row,
      line: Number(row.line),
      depth: Number(row.depth),
      length: Number(row.length),
      date: new Date(row.date + "T00:00" + row.timezone),
      datetime: new Date(row.datetime),
    }));

    fileLengths = d3.rollups(
      filteredLines,
      (v) => d3.max(v, (v) => v.line),
      (d) => d.file
    );
    averageFileLength = d3.mean(fileLengths, (d) => d[1]);

    commits = d3
      .groups(data, (d) => d.commit)
      .map(([commit, lines]) => {
        let first = lines[0];
        let { author, date, time, timezone, datetime } = first;
        let ret = {
          id: commit,
          url: "https://github.com/vis-society/lab-7/commit/" + commit,
          author,
          date,
          time,
          timezone,
          datetime,
          hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
          totalLines: lines.length,
        };

        d3.rollup(commits, (d) => d.time);

        Object.defineProperty(ret, "lines", {
          value: lines,
          configurable: true,
          writable: true,
          enumerable: false,
        });

        return ret;
      });
  });

  $: {
    yScale = d3
      .scaleLinear()
      .domain([0, 24])
      .range([height - margin.bottom, margin.top]);
    xScale = d3
      .scaleTime()
      .domain(d3.extent(filteredCommits, (d) => d.datetime))
      .range([margin.left, width - margin.right]);
  }

  let brushSelection;

  function brushed(evt) {
    let brushSelection = evt.selection;
    selectedCommits = !brushSelection
      ? []
      : filteredCommits.filter((commit) => {
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

  $: {
    if (svg) {
      d3.select(svg).call(d3.brush().on("start brush end", brushed));
      d3.select(svg).selectAll(".dots, .overlay ~ *").raise();
      console.log(d3.select(svg).selectAll(".dots ~ *"));
    }
  }

  function isCommitSelected(commit) {
    return selectedCommits.includes(commit);
  }

  $: hasSelection = selectedCommits.length > 0;
  $: selectedLines = (hasSelection ? selectedCommits : commits).flatMap(
    (d) => d.lines
  );
  let languageBreakdown;
  $: {
    languageBreakdown = d3
      .flatRollup(
        selectedLines,
        (v) => v.length,
        (d) => d.type
      )
      .map(([type, length]) => ({ type, length }));
  }

  function transformArray(inp) {
    let list = [];

    inp.forEach((element) => {
      list.push({
        label: element.type,
        value: element.length,
      });
    });

    return list;
  }
</script>

<svelte:head>
  <title>Meta</title>
</svelte:head>

<h1><br /><br /><br />Summary:</h1>

<dl class="stats">
  <dt>Total <abbr title="Lines of code">LOC</abbr></dt>
  <dd>{filteredLines.length}</dd>

  <dt>Total Commits</dt>
  <dd>{filteredCommits.length}</dd>

  <dt>Avg <abbr title="Average Length of File">File Length</abbr></dt>
  <dd>{averageFileLength}</dd>

  <dt>Number of Files</dt>
  <dd>{d3.group(filteredLines, (d) => d.file).size}</dd>
</dl>

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

<label>
  Show commits until:
  <input max="100" bind:value={commitProgress} type="range" />
  <time>{commitMaxTime?.toLocaleString("en")}</time>
</label>

{#if commits.length > 0}
  <h1>Commits by Time of Day</h1>
  <svg viewBox={`0 0 ${width} ${height}`} bind:this={svg}>
    <g
      transform={`translate(0, ${height - margin.bottom})`}
      bind:this={xAxis}
    />
    <g transform={`translate(${margin.left}, 0)`} bind:this={yAxis} />
    <g
      class="gridlines"
      transform="translate({usableArea.left}, 0)"
      bind:this={yAxisGridlines}
    />
    {#each filteredCommits as commit, index}
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
  <p>{hasSelection ? selectedCommits.length : "No"} commits selected</p>
  <div class="container">
    {#each languageBreakdown as obj}
      <div class="langB">
        <h4>{obj.type}</h4>
        <p>
          {obj.length} lines ({(obj.length / selectedLines.length).toFixed(3) *
            100}%)
        </p>
      </div>
    {/each}
  </div>
  {#key languageBreakdown}
    <Pie data={transformArray(languageBreakdown)} />
  {/key}
{/if}

<style>
  svg {
    /* let margin = { top: 10, right: 10, bottom: 30, left: 20 }; */

    margin-top: 10;
    margin-right: 10;
    margin-bottom: 30;
    margin-left: 20;
  }
  label {
    display: flexbox;
    flex: 1;
  }
  .stat_page {
  }
  .stats {
    display: flex;
    flex: wrap;
    text-align: center;
  }
  dt {
    font-size: 25px;
  }
  dd {
    color: blue;
    font-size: 15px;
  }
  svg {
    overflow: visible;
  }

  .gridlines {
    stroke-opacity: 0.2;
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

  .container {
    display: flex;
    flex-wrap: wrap;
  }

  .langB {
    margin: 10px;
  }
</style>
