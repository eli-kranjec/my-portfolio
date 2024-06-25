<svelte:head>
    <title>Meta</title>
</svelte:head>

<script>
    import * as d3 from "d3";
    import { onMount } from "svelte";

    let data = [];

    let commits = [];

    $: fileLengths = d3.rollups(data, v => d3.max(v, v => v.line), d => d.file);
    $: averageFileLength = d3.mean(fileLengths, d => d[1]);

    let width = 1000, height = 600;
    

    onMount(async () => {
        data = await d3.csv("loc.csv", row => ({
        ...row,
        line: Number(row.line), // or just +row.line
        depth: Number(row.depth),
        length: Number(row.length),
        date: new Date(row.date + "T00:00" + row.timezone),
        datetime: new Date(row.datetime)
        }));

        commits = commits = d3.groups(data, d => d.commit).map(([commit, lines]) => {
            let first = lines[0];
            let {author, date, time, timezone, datetime} = first;
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


    });

    



</script>
<style>
    .stat_page{
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis; /* Optional: Adds ellipsis for overflow text */
            width: 100%; /* Set a width to see the effect */
            border: 1px solid #ccc;
            padding: 10px;
            margin: 5px;
            box-sizing: border-box; 
            text-align: center;
            box-align: center;
            display: flex;
    }
    .stats{
        flex: 1;
        
    }
    dt{
        font-size: 25px;
    }
    dd{
        color: blue;
        font-size: 15px;
    }

    svg {

        overflow:visible;
    }

</style>
<body class = "stat_page">
    <h1><br><br><br>Summary:</h1>
    
    <dl class="stats">
        <dt>Total <abbr title="Lines of code">LOC</abbr></dt>
        <dd>{data.length}</dd>

        <dt>Total Commits</dt>
        <dd>{commits.length}</dd>

        <dt>Avg <abbr tile="Average Length of File">File Length</abbr></dt>
        <dd>{averageFileLength}</dd>

        <dt>Number of Files</dt>
        <dd>{d3.group(data, d => d.file).size}</dd>
    </dl>

    <svg viewBox="0 0 {width} {height}">
        <!-- scatterplot will go here -->
    </svg>
    
    
    

</body>