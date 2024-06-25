<script>
export let data = {}
import Project from "$lib/Project.svelte";
import projects from '$lib/projects.json';
export let hLevel = 2;

</script>

{#each projects as p}
    <Project data = {p}></Project>
{/each}

{#if hLevel === 1}
	<h1>{ data.title }</h1>
{:else if hLevel === 2}
	<h2>{ data.title }</h2>
{:else if hLevel === 3}
    <h3>{data.year}</h3>
{/if}

<svelte:element this={"h" + hLevel}>{ data.title }</svelte:element>
<Project data = {p} hLevel = 3/>

<style>

    .project{

        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(15em, 1fr));
        width: 25%;
        
    
    }



    article{

        grid-row: span 3;

    }

    h2{

        margin: 0;
        size: 400%;

    }

    h1, h2, h3, h4, h5, h6{

        line-height: 1.1;
        text-wrap: balance;
    }

    h3{
        font-family: Baskerville;
        font-variant-numeric: oldstyle-nums;
    }

</style>