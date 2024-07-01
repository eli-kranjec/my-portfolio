<script>
  //fix brushing, come back to lab 7 later

  import * as d3 from "d3";
  import { onMount, tick } from "svelte";
  import Pie from "$lib/Pie.svelte";
  import { computePosition, autoPlacement, offset } from "@floating-ui/dom";
  import Scatterplot from "./Scatterplot.svelte";
  import FileLines from "./FileLines.svelte";

  let data = [];
  let commits = [];

  let commitProgress = 100;
  let commitMaxTime;
  let filteredCommits;
  let filteredLines;
  let selectedCommits = [];

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

  let fileLengths = [];
  let averageFileLength = 0;

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

  $: hasSelection = selectedCommits?.length > 0;

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

<label>
  Show commits until:
  <input max="100" bind:value={commitProgress} type="range" />
  <time>{commitMaxTime?.toLocaleString("en")}</time>
</label>
<FileLines lines={filteredLines} />
<p>{hasSelection ? selectedCommits?.length : "No"} commits selected</p>
<Scatterplot commits={filteredCommits} bind:selectedCommits />
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

<style>
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

  .container {
    display: flex;
    flex-wrap: wrap;
  }

  .langB {
    margin: 10px;
  }

  input {
    accent-color: blue;
  }
</style>
