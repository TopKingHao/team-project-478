function DrawPieChart(targetElem, width, height, margin, data, options = {}) {
    const clickCallback = options.clickCallback
    const mouseMoveCallback = options.mouseMoveCallback
    const mouseOutCallback = options.mouseOutCallback
    const mouseOverCallback = options.mouseOverCallback

    const svg = d3.select(targetElem, width, height, margin)
        .attr("width", width)
        .attr("height", height);


    svg.selectAll("*").remove();

    // Radius for pie chart
    const radius = Math.min(width, height) / 2;
    const innerRadius = radius - 50;
    const outerRadius = radius - 10;

    // Create pie generator
    const pie = d3.pie()
        .value(d => d.value);

    // Create arc generator
    const arc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);


    // Color scale
    const color = d3.scaleOrdinal(d3.schemeSet3);

    const txt = svg.append("text")
        .attr("transform", `translate(${width / 2}, ${height / 2})`)
        .attr("text-anchor", "middle")
        .text("");


    // Draw arcs
    const arcs = svg.selectAll("arc")
        .data(pie(data))
        .enter()
        .append("path")
        .attr("d", arc)
        .attr("fill", (d, i) => color(i))
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .attr("transform", `translate(${width / 2}, ${height / 2})`);


    // Add mouse event handlers

    arcs.on("click", (d, i) => {
        if (clickCallback) {
            clickCallback(d, i.data)
        }
    })

    let selectedTarget = null;
    arcs.on("mouseover", (d, i) => {
        console.log(i.data)
        const key = i.data.key;
        const count = i.data.value;
        const label = `${key}: ${count}`;
        selectedTarget = d.currentTarget;
        d3.select(d.currentTarget)
            .transition()
            .duration(300)
            .attr("stroke-width", 4);
        txt.text(label);
        if (mouseOverCallback) {
            mouseOverCallback(d, i)
        }

    });

    arcs.on("mousemove", (d, i) => {
        if (mouseMoveCallback) {
            mouseMoveCallback(d, i)
        }
    })

    arcs.on("mouseout", (d, i) => {
        if (selectedTarget) {
            d3.select(selectedTarget)
                .transition()
                .duration(300)
                .attr("stroke-width", 1)
        }
        if (mouseOutCallback) {
            mouseOutCallback(d, i)
        }
    });

}
