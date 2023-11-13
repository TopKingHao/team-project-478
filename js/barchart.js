function DrawBarChart(targetElem, width, height, margin, data) {

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
        .attr("fill", "#FEFEB6");

    // Draw axes
    svg.append("g")
        .attr("transform", `translate(0, ${height - margin})`)
        .call(xAxis);

    svg.append("g")
        .attr("transform", `translate(${margin}, 0)`)
        .call(yAxis);

    svg.selectAll(".bar").on("mouseover", (d, i) => {
        const count = i.value;
        const elem = document.getElementById("character-name");
        elem.innerText = count;
    });

    svg.selectAll(".bar").on("mousemove", (d, i) => {
        const letter = i.key;
        const count = i.value;
        tooltip.html(`<div>Character: ${letter}</div> <div>Count: ${count}</div>`)
            .style("left", d.clientX + "px")
            .style("top", (d.clientY - tooltip.node().clientHeight - 10) + "px")
            .style("opacity", 1);
    });

    svg.selectAll(".bar").on("mouseout", (d, i) => {
        tooltip
            .style("opacity", 0);
    });


}
