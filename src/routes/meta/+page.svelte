<svelte:head>
    <title>Meta</title>
</svelte:head>

<script>
    //fix brushing, come back to lab 7 later
    
    import * as d3 from "d3";
    import { onMount, tick } from "svelte";

    let data = [];
    let commits = [];
    let svg;
    let cursor = { x: 0, y: 0 };
    let hoveredIndex = -1;

    $: hoveredCommit = commits[hoveredIndex] ?? hoveredCommit ?? {};

    let fileLengths = [];
    let averageFileLength = 0;
    let width = 1000, height = 600;
    let xScale, yScale;
    let margin = { top: 10, right: 10, bottom: 30, left: 20 };
    let usableArea = {
        top: margin.top,
        right: width - margin.right,
        bottom: height - margin.bottom,
        left: margin.left
    };

    usableArea.width = usableArea.right - usableArea.left;
    usableArea.height = usableArea.bottom - usableArea.top;
    let xAxis, yAxis;

    $: {
        if (xScale && yScale) {
            d3.select(xAxis).call(d3.axisBottom(xScale));
            d3.select(yAxis).call(d3.axisLeft(yScale).tickFormat(d => String(d % 24).padStart(2, "0") + ":00"));
            d3.select(yAxisGridlines).call(d3.axisLeft(yScale).tickFormat("").tickSize(-usableArea.width));
        }
    }
    let yAxisGridlines;
    onMount(async () => {
        data = await d3.csv("loc.csv", row => ({
            ...row,
            line: Number(row.line),
            depth: Number(row.depth),
            length: Number(row.length),
            date: new Date(row.date + "T00:00" + row.timezone),
            datetime: new Date(row.datetime)
        }));
        
        

        fileLengths = d3.rollups(data, v => d3.max(v, v => v.line), d => d.file);
        averageFileLength = d3.mean(fileLengths, d => d[1]);

        commits = d3.groups(data, d => d.commit).map(([commit, lines]) => {
            let first = lines[0];
            let { author, date, time, timezone, datetime } = first;
            let ret = {
                id: commit,
                url: "https://github.com/vis-society/lab-7/commit/" + commit,
                author, date, time, timezone, datetime,
                hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
                totalLines: lines.length
            };

            Object.defineProperty(ret, "lines", {
                value: lines,
                configurable: true,
                writable: true,
                enumerable: false,
            });

            return ret;
        });

        yScale = d3.scaleLinear().domain([0, 24]).range([height - margin.bottom, margin.top]);
        xScale = d3.scaleTime().domain(d3.extent(commits, d => d.datetime)).range([margin.left, width - margin.right]);
    });

    let brushSelection;

    function brushed(evt) {
        
        brushSelection = evt.selection;
    
    }

    $: {
        if(svg){
            d3.select(svg).call(d3.brush().on("start brush end", brushed));
            console.log(brushSelection);
            d3.select(svg).selectAll(".dots, g ~ *").raise();
        }
    }

    function isCommitSelected(commit) {
        if (!commit) {
            return false;
        }
        if (!brushSelection) {
            return false;
        }
        let corner1 = { x: brushSelection[0][0], y: brushSelection[0][1] };
        let corner2 = { x: brushSelection[1][0], y: brushSelection[1][1] };
        let x = xScale(commit.datetime);
        let y = yScale(commit.hourFrac);
        return x >= corner1.x && x <= corner2.x && y >= corner1.y && y <= corner2.y;
    }
</script>

<style>
    .stat_page { }
    .stats {
        flex: 1;
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
        stroke-opacity: .2;
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
</style>

<body class="stat_page">
    <h1><br><br><br>Summary:</h1>

    <dl class="stats">
        <dt>Total <abbr title="Lines of code">LOC</abbr></dt>
        <dd>{data.length}</dd>

        <dt>Total Commits</dt>
        <dd>{commits.length}</dd>

        <dt>Avg <abbr title="Average Length of File">File Length</abbr></dt>
        <dd>{averageFileLength}</dd>

        <dt>Number of Files</dt>
        <dd>{d3.group(data, d => d.file).size}</dd>
    </dl>

    <dl id="commit-tooltip" class="info tooltip" hidden={hoveredIndex === -1} style="top: {cursor.y}px; left: {cursor.x}px">
        <dt>Commit ID</dt>
        <dd><a href="{hoveredCommit.url}" target="_blank">{hoveredCommit.id}</a></dd>

        <dt>Date</dt>
        <dd>{hoveredCommit.datetime?.toLocaleString("en", { dateStyle: "full" })}</dd>

        <dt>Author</dt>
        <dd>{hoveredCommit.author?.toLocaleString("en")}</dd>

        <dt>Time</dt>
        <dd>{hoveredCommit.time?.toLocaleString("en")}</dd>

        <dt>Lines edited</dt>
        <dd>{hoveredCommit.lines?.length}</dd>
    </dl>

    {#if commits.length > 0}
        <h1>Commits by Time of Day</h1>
        <svg viewBox={`0 0 ${width} ${height}`} bind:this={svg}>
            <g class="dots">
                <g transform={`translate(0, ${height - margin.bottom})`} bind:this={xAxis} />
                <g transform={`translate(${margin.left}, 0)`} bind:this={yAxis} />
                <g class="gridlines" transform="translate({usableArea.left}, 0)" bind:this={yAxisGridlines} />
                {#each commits as commit, index}
                    <circle
                        cx={xScale(commit.datetime)}
                        cy={yScale(commit.hourFrac)}
                        r="5"
                        fill="steelblue"
                        on:mouseenter={evt => { hoveredIndex = index; cursor = { x: evt.x, y: evt.y }; }}
                        on:mouseleave={evt => hoveredIndex = -1}
                        class={isCommitSelected(commit) ? 'selected_commit' : ''}
                    />
                {/each}
            </g>
        </svg>
    {/if}
</body>
