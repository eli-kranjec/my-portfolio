<script>
    import * as d3 from 'd3';
    let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
    let arc = arcGenerator({
        startAngle: 0,
        endAngle: 2 * Math.PI
    });
    let colors = d3.scaleOrdinal(d3.schemeTableau10);
    export let data = [];
    export let selectedIndex = -1;

    let sliceGenerator = d3.pie().value(d => d.value);
    let arcData;
    $: arcData = sliceGenerator(data);
    let arcs;
    $: arcs = arcData.map(d => arcGenerator(d));
    function toggleWedge (index, event) {
	    if (!event.key || event.key === "Enter") {
		selectedIndex = index;
	    }
    }
    
    
</script>
<div class="container">
    <svg viewBox = "-50 -50 100 100">
        {#each arcs as arc, i}
            <path d={arc} 
                fill= { colors(i) }
                tabindex="0"
                role="button"
                aria-label="l"
                class:selected={selectedIndex===i} 
                on:click= {e => toggleWedge(i, e)}
                on:keyup={e => toggleWedge(index, e)}
                />
        {/each}
    </svg>
    <ul class="legend">
        {#each data as d, index}
            <li style="--color: { colors(index) }">
                <span class="swatch"></span>
                {d.label} <em>({d.value})</em>
            </li>
        {/each}
    </ul>
</div>

<style lang="scss">
    svg {
        max-width: 20em;
        margin-block: 2em;

        /* Do not clip shapes outside the viewBox */
        overflow: visible;
    }
    svg path:hover ~ path, path:focus-visible {
        opacity: 50%;
    }

    /* Reset opacity when not hovering over any path */
    svg path:not(:hover, :focus-visible) {
        opacity: 100%;
    }

    path {
	    transition: 300ms;
        outline: none;
    }

    .selected {
        --color: oklch(60% 45% 0) !important;

        &:is(path) {
            fill: var(--color);
        }
    }



</style>