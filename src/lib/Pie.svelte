<script>
    import * as d3 from 'd3';
    let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
    let arc = arcGenerator({
        startAngle: 0,
        endAngle: 2 * Math.PI
    });
    let colors = d3.scaleOrdinal(d3.schemeTableau10);
    export let data = [];
    

    let sliceGenerator = d3.pie().value(d => d.value);
    let arcData = sliceGenerator(data);
    let arcs = arcData.map(d => arcGenerator(d));
</script>
<div class="container">
    <svg viewBox = "-50 -50 100 100">
        {#each arcs as arc, i}
            <path d={arc} fill= { colors(i) } />
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

<style>
    svg {
	max-width: 20em;
	margin-block: 2em;

	/* Do not clip shapes outside the viewBox */
	overflow: visible;
}
</style>