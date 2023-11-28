function DrawLollipopChart(targetElem, width, height, margin, data1, data2, data3, options = {}) {
    const clickCallback = options.clickCallback
    const mouseMoveCallback = options.mouseMoveCallback
    const mouseOutCallback = options.mouseOutCallback
    const mouseOverCallback = options.mouseOverCallback

    let data1Color = '#fa1293';
    let data2Color = '#ab0000';
    let data3Color = '#00a639';

    if (options.data1Color) {
        data1Color = options.data1Color
    }
    if (options.data2Color) {
        data2Color = options.data2Color
    }
    if (options.data3Color) {
        data3Color = options.data3Color
    }


    const svg = d3.select(targetElem, width, height, margin)
        .attr("width", width)
        .attr("height", height);

    // clear chart
    svg.selectAll("*").remove();


    const offset = 10;

    // Create x scale
    const xScale = d3.scaleBand()
        .range([margin, width - margin])
        .padding(0.2);


    // Get max y
    let maxY = d3.max(data1, d => d.value);
    maxY = Math.max(maxY, d3.max(data2, d => d.value));
    maxY = Math.max(maxY, d3.max(data3, d => d.value));

    // Create y scale
    const yScale = d3.scaleLinear()
        .range([height - margin, margin]);

    xScale.domain(data1.map(d => d.key));
    yScale.domain([0, maxY]);


    // Draw x axis
    svg.append('g')
        .attr('transform', `translate(${-offset}, ${height - margin})`)
        .call(d3.axisBottom(xScale))
        .attr('font-size', '13px');

    // Draw y axis
    svg.append('g')
        .attr("transform", `translate(${margin}, 0)`)
        .call(d3.axisLeft(yScale))
        .attr('font-size', '13px');


    data1.forEach(d => {
        // Get female value for current year
        const value = d.value

        // Get x position
        const xPos = xScale(d.key)

        // Get y position
        const yPos = yScale(value);

        // Draw line
        svg.append('line')
            .attr('x1', xPos)
            .attr('y1', yScale(0))
            .attr('x2', xPos)
            .attr('y2', yPos)
            .style('stroke', data1Color);

        // Draw circle
        svg.append('circle')
            .attr('cx', xPos)
            .attr('cy', yPos)
            .attr('r', 5)
            .style('fill', data1Color);
    });
    data2.forEach(d => {
        // Get female value for current year
        const value = d.value

        // Get x position
        const xPos = xScale(d.key)

        // Get y position
        const yPos = yScale(value);

        // Draw line
        svg.append('line')
            .attr('x1', xPos + offset)
            .attr('y1', yScale(0))
            .attr('x2', xPos + offset)
            .attr('y2', yPos)
            .style('stroke', data2Color);

        // Draw circle
        svg.append('circle')
            .attr('cx', xPos + offset)
            .attr('cy', yPos)
            .attr('r', 5)
            .style('fill', data2Color);
    });
    data3.forEach(d => {
        // Get female value for current year
        const value = d.value

        // Get x position
        const xPos = xScale(d.key)

        // Get y position
        const yPos = yScale(value);

        // Draw line
        svg.append('line')
            .attr('x1', xPos + 2 * offset)
            .attr('y1', yScale(0))
            .attr('x2', xPos + 2 * offset)
            .attr('y2', yPos)
            .style('stroke', data3Color);

        // Draw circle
        svg.append('circle')
            .attr('cx', xPos + 2 * offset)
            .attr('cy', yPos)
            .attr('r', 5)
            .style('fill', data3Color);
    });


    // Step 6: Add legend
    svg.append('rect')
        .attr('x', 850)
        .attr('y', 10)
        .attr('width', 20)
        .attr('height', 20)
        .style('fill', data1Color);

    svg.append('text')
        .attr('x', 880)
        .attr('y', 25)
        .text('Confirmed');

    svg.append('rect')
        .attr('x', 850)
        .attr('y', 40)
        .attr('width', 20)
        .attr('height', 20)
        .style('fill', data2Color);

    svg.append('text')
        .attr('x', 880)
        .attr('y', 55)
        .text('Deaths');

    svg.append('rect')
        .attr('x', 850)
        .attr('y', 70)
        .attr('width', 20)
        .attr('height', 20)
        .style('fill', data3Color);

    svg.append('text')
        .attr('x', 880)
        .attr('y', 85)
        .text('Recovered');

}

