<script>
  import projects from "$lib/projects.json";
  import Pie from "$lib/Pie.svelte";
  import * as d3 from "d3";
  let filteredProjects;
  let query = "";
  let selectedYearIndex = -1;

  let selectedYear;
  $: selectedYear =
    selectedYearIndex > -1 ? pieData[selectedYearIndex].label : null;

  $: filteredProjects = projects.filter((project) => {
    let values = Object.values(project).join("\n").toLowerCase();
    return values.includes(query.toLowerCase());
  });

  let pieData;
  let rolledData;

  $: {
    pieData = {}; //must make object empty first

    rolledData = d3.rollups(
      filteredProjects,
      (v) => v.length,
      (d) => d.year
    );

    pieData = rolledData.map(([year, count]) => {
      return { value: count, label: year };
    });
  }
</script>

<svelte:head>
  <title>Projects Page</title>
</svelte:head>
<h1>{projects.length} So Far</h1>
<Pie data={pieData} bind:selectedIndex={selectedYearIndex} />
<input
  type="search"
  bind:value={query}
  aria-label="Search projects"
  placeholder="🔍 Search projects…"
/>
<div class="projects">
  {#each filteredProjects as p}
    <article>
      <h2>{p.title}</h2>
      <img src={p.image} alt="" />
      <p>{p.description}</p>
    </article>
  {/each}
</div>

<style>
  .projects {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(15em, 1fr));
    width: 100%;
  }

  .projects h2 {
    font-size: 100%;
  }
</style>
