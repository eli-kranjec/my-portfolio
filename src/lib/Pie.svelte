<script>
  import * as d3 from "d3";
  let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
  let colors = d3.scaleOrdinal(d3.schemeTableau10);
  export let data = [];
  export let selectedIndex = -1;
  let pieData;
  let wedges = {};
  let oldData = [];
  let transitionDuration = 3000;

  function getEmptyArc(label, data = pieData) {
    // Union of old and new labels in the order they appear
    let labels = d3.sort(new Set([...oldData, ...pieData].map((d) => d.label)));
    let labelIndex = labels.indexOf(label);
    let sibling;
    for (let i = labelIndex - 1; i >= 0; i--) {
      sibling = data.find((d) => d.label === labels[i]);
      if (sibling) {
        break;
      }
    }

    let angle = sibling?.endAngle ?? 0;
    return { startAngle: angle, endAngle: angle };
  }
  function sameArc(arc1, arc2) {
    return (arc1.startAngle == arc2.startAngle &&
      arc2.endAngle === arc2.endAngle) ||
      (arc1 == null && arc2 == null)
      ? true
      : false;
  }

  function arc(wedge) {
    let dec = transitionArc(wedge, Object.keys(wedges));
    dec += "d: ";

    return {
      duration: transitionDuration,
      css: (t, u) => {
        // t is a number between 0 and 1 that represents the transition progress; u is 1 - t
        dec;
        easing: d3.easeCubic;
      },
    };
  }
  function transitionArc(wedge, label) {
    label ??= Object.entries(wedges).find(([label, w]) => w === wedge)[0];
    // Calculations that will only be done once per element go here

    // label = Object.keys(wedges)[index];
    let d = pieData.find((d) => d.label === label);
    let d_old = oldData.find((d) => d.label === label);

    if (sameArc(d_old, d)) {
      return null;
    }

    let from = d_old ? { ...d_old } : getEmptyArc(label, oldData);
    let to = d ? { ...d } : getEmptyArc(label, pieData);

    let angleInterpolator = d3.interpolate(from, to);
    let type = d ? (d_old ? "update" : "in") : "out";

    let interpolator = (t) => `path("${arcGenerator(angleInterpolator(t))}")`;

    // t is a number between 0 and 1 that represents the transition progress
    // TODO Interpolate the angles and return the path string that corresponds to t
    return interpolator;
  }

  let arcs;
  $: {
    let arcData;
    // pieData = data.map(d => ({...d}));
    // pieData = pieData.map((d, i) => ({...d, ...arcData[i], arc: arcs[i]}));
    oldData = pieData;
    pieData = d3.sort(data, (d) => d.label);
    arcData = sliceGenerator(data);
    arcs = arcData.map((d) => arcGenerator(d));
    pieData = pieData.map((d, i) => ({ ...d, ...arcData[i], arc: arcs[i] }));

    transitionArcs();
  }

  function transitionArcs() {
    let wedgeElements = Object.values(wedges);

    d3.selectAll(wedgeElements)
      .transition("arc")
      .duration(transitionDuration)
      .styleTween("d", function (_, index) {
        let wedge = this;
        let label = Object.keys(wedges)[index];
        let transition = transitionArc(wedge, label);
        return transition?.interpolator;
      });
  }

  let sliceGenerator = d3
    .pie()
    .value((d) => d.value)
    .sort(null);

  function toggleWedge(index, event) {
    if (!event.key || event.key === "Enter") {
      selectedIndex = index;
    }
  }
</script>

<div class="container">
  <svg viewBox="-50 -50 100 100">
    {#each pieData as d, i (d.label)}
      <path
        bind:this={wedges[d.label]}
        d={arcs[i]}
        fill={colors(d.id ?? d.label)}
        tabindex="0"
        role="button"
        aria-label="l"
        class:selected={selectedIndex === i}
        on:click={(e) => toggleWedge(i, e)}
        on:keyup={(e) => toggleWedge(i, e)}
      />
    {/each}
  </svg>
  <ul class="legend">
    {#each pieData as d, index}
      <li style="--color: {colors(index)}">
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
  svg path:hover ~ path,
  path:focus-visible {
    opacity: 50%;
  }

  /* Reset opacity when not hovering over any path */
  svg path:not(:hover, :focus-visible) {
    opacity: 100%;
  }

  path {
    transition: 300ms;
    outline: none;
    transition-property: transform, opacity, fill;
  }

  .selected {
    --color: oklch(60% 45% 0) !important;

    &:is(path) {
      fill: var(--color);
    }
  }
</style>
