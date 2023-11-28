function DrawBarChart(targetElem, width, height, margin, data, options) {
    const clickCallback = options.clickCallback
    const mouseMoveCallback = options.mouseMoveCallback
    const mouseOutCallback = options.mouseOutCallback
    const mouseOverCallback = options.mouseOverCallback

    let barColor = options.barColor
    if (!barColor) {
        barColor = '#FEFEB6'
    }

    // SVG element
    const svg = d3.select(targetElem, width, height, margin)
        .attr("width", width)
        .attr("height", height);

    svg.selectAll("*").remove();

    // X scale
    const x = d3.scaleBand()
        .range([margin, width - margin])
        .padding(0.2);

    // Y scale
    const y = d3.scaleLinear()
        .range([height - margin, margin]);

    // Axis generators
    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y)

    // Update scales
    x.domain(data.map(d => d.key));
    y.domain([0, d3.max(data, d => d.value)]);

    // Draw bars
    svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.key))
        .attr("width", x.bandwidth())
        .attr("y", d => y(d.value))
        .attr("height", d => height - margin - y(d.value))
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .attr("fill", barColor);

    // Draw axes
    svg.append("g")
        .attr("transform", `translate(0, ${height - margin})`)
        .call(xAxis);

    svg.append("g")
        .attr("transform", `translate(${margin}, 0)`)
        .call(yAxis);

    svg.selectAll(".bar").on("click", (d, i) => {
        if (clickCallback) {
            clickCallback(d, i)
        }
    });
    svg.selectAll(".bar").on("mouseover", (d, i) => {
        if (mouseOverCallback) {
            mouseOverCallback(d, i)
        }
    });

    svg.selectAll(".bar").on("mousemove", (d, i) => {
        if (mouseMoveCallback) {
            mouseMoveCallback(d, i)
        }
    });

    svg.selectAll(".bar").on("mouseout", (d, i) => {
        if (mouseOutCallback) {
            mouseOutCallback(d, i)
        }
    });
    return Array.from(svg.selectAll(".bar").nodes())
}
