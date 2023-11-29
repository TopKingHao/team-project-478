swarm = (data, x, r, priority, baseY = 400, symmetric = true) => {
    let circles = data
        .map((d, index) => ({
            datum: d, x: x(d), y: Infinity, r: r(d), priority: priority(d), index
        }))
        .sort((a, b) => d3.ascending(a.x, b.x));
    let indices = d3
        .range(0, circles.length)
        .sort((a, b) => d3.ascending(circles[a].priority, circles[b].priority));
    indices.forEach((index, order) => (circles[index].order = order));

    for (let d of circles) {
        if (d.x == undefined) throw new Error('x is undefined for datum at index ' + d.index);
        if (d.r == undefined) throw new Error('r is undefined for datum at index ' + d.index);
        if (d.priority == undefined) throw new Error('priority is undefined for datum at index ' + d.index);
    }
    let {sqrt, abs, min} = Math;
    let maxRadius = d3.max(circles, d => d.r);
    for (let index of indices) {
        let intervals = [];
        let circle = circles[index];
        // scan adjacent circles to the left and right
        for (let step of [-1, 1]) for (let i = index + step; i > -1 && i < circles.length; i += step) {
            let other = circles[i];
            let dist = abs(circle.x - other.x);
            let radiusSum = circle.r + other.r;
            // stop once it becomes clear that no circle can overlap us
            if (dist > circle.r + maxRadius) break;
            // don't pay attention to this specific circle if
            // it hasn't been placed yet or doesn't overlap us
            if (other.y === Infinity || dist > radiusSum) continue;
            // compute the distance by which one would need to offset the circle
            // so that it just touches the other circle
            let offset = sqrt(radiusSum * radiusSum - dist * dist);
            // use that offset to create an interval in which this circle is forbidden
            intervals.push([other.y - offset, other.y + offset]);
        }
        // We're going to find a y coordinate for this circle by finding
        // the lowest point at the edge of any interval where it can fit.
        // This is quadratic in the number of intervals, but runs fast in practice due to
        // fact that we stop once the first acceptable candidate is found.
        let y = baseY;
        if (intervals.length) {
            let candidates = intervals
                .flat()
                .sort((a, b) => d3.ascending(abs(a), abs(b)));
            for (let candidate of candidates) {
                if (!symmetric && candidate > 0) continue;
                if (intervals.every(([lo, hi]) => candidate <= lo || candidate >= hi)) {
                    y = candidate;
                    break;
                }
            }
        }
        circles[index].y = y;
    }
    const rList = circles.map(c => c.y)
    rList.sort()
    if (rList.length > 0) {
        const minY = rList[0]
        if (minY < 0) {
            const total = baseY - minY
            const percent = baseY / total * 0.8
            for (let circle of circles) {
                circle.r = circle.r * percent
                circle.y = baseY - (baseY - circle.y) * percent
            }
        }
        console.log(minY)
    }
    return circles;
}

function dataDiff(circles1, circles2) {
    const circles1Map = {}
    const circles2Map = {}

    for (let circle of circles1) {
        circles1Map[circle.datum.data.key] = circle
    }

    for (let circle of circles2) {
        circles2Map[circle.datum.data.key] = circle
    }

    const cxList = []
    const cyList = []
    const rList = []

    const newCircles = []

    for (let circle of circles1) {
        let key = circle.datum.data.key
        if (key in circles2Map) {
            cxList.push(circles2Map[key].x)
            cyList.push(circles2Map[key].y)
            rList.push(circles2Map[key].r)
        } else {
            cxList.push(circle.x)
            cyList.push(circle.y)
            rList.push(0)
        }
    }
    for (let circle of circles2) {
        let key = circle.datum.data.key
        if (!(key in circles1Map)) {
            cxList.push(circle.x)
            cyList.push(circle.y)
            rList.push(circle.r)

            newCircles.push(circle)
        }
    }

    return [cxList, cyList, rList, newCircles]
}


const chartMinR = 3;
const chartMaxR = 24;
const chartDuration = 1000;
let circles = [];

function DrawBubbleChart(targetElem, width, height, margin, data, options = {}) {
    const clickCallback = options.clickCallback
    const mouseMoveCallback = options.mouseMoveCallback
    const mouseOutCallback = options.mouseOutCallback
    const mouseOverCallback = options.mouseOverCallback


    const maxX = d3.max(data, d => d.x)
    const minX = d3.min(data, d => d.x)
    const maxR = d3.max(data, d => d.r)
    const minR = d3.min(data, d => d.r)

    const svg = d3.select(targetElem, width, height, margin)
        .attr("width", width)
        .attr("height", height);

    const curCircles = swarm(data, // map each data point to an x position (in pixels)
        d => margin + (d.x - minX) / (maxX - minX) * (width - margin * 2), // map each data point to a radius (in pixels)
        d => chartMinR + (d.r - minR) / (maxR - minR) * (chartMaxR - chartMinR), // map each data point to a priority which determines placement order (lower = earlier).
        d => -d.r, height - margin - chartMaxR)

    console.log(curCircles)
    const [cxList, cyList, rList, newCircles] = dataDiff(circles, curCircles)

    if (newCircles.length > 0) {
        // Append circles to the SVG element
        svg.selectAll('circle')
            .data(newCircles)
            .enter()
            .append('circle')
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .attr('r', 0)
            .attr('fill', d => d.datum.color)
    }

    svg.selectAll("circle")
        .transition()
        .duration(chartDuration)
        .attr("cx", function (d, i) {
            return cxList[i];
        })
        .attr("cy", function (d, i) {
            return cyList[i];
        })
        .attr("r", function (d, i) {
            return rList[i];
        })
        .on("end", function () {
            svg.selectAll("circle").remove();
            svg.selectAll('circle')
                .data(curCircles)
                .enter()
                .append('circle')
                .attr('cx', d => d.x)
                .attr('cy', d => d.y)
                .attr('r', d => d.r)
                .attr('fill', d => d.datum.color)
                .on("mouseover", (d, i) => {
                    if (mouseOverCallback) {
                        mouseOverCallback(d, i)
                    }
                })
                .on("mouseout", (d, i) => {
                    if (mouseOutCallback) {
                        mouseOutCallback(d, i)
                    }
                })
                .on("click", (d, i) => {
                    if (clickCallback) {
                        clickCallback(d, i)
                    }
                })
                .on("mousemove", (d, i) => {
                    if (mouseMoveCallback) {
                        mouseMoveCallback(d, i)
                    }
                })

        });

    circles = curCircles

    const xScale = d3.scaleLinear()
        .domain([minX, maxX])
        .range([margin, width - margin]);
    // Define the x-axis
    const xAxis = d3.axisBottom(xScale);
    svg.selectAll("g").remove();
    // Draw the x-axis
    svg.append("g")
        .attr("transform", `translate(0, ${height - margin})`)
        .call(xAxis);

}

function UpdateBubbleChart(targetElem, width, height, margin, data, options={}) {
    const clickCallback = options.clickCallback
    const mouseMoveCallback = options.mouseMoveCallback
    const mouseOutCallback = options.mouseOutCallback
    const mouseOverCallback = options.mouseOverCallback

    const maxX = d3.max(data, d => d.x)
    const minX = d3.min(data, d => d.x)
    const maxR = d3.max(data, d => d.r)
    const minR = d3.min(data, d => d.r)

    const svg = d3.select(targetElem, width, height, margin)
        .attr("width", width)
        .attr("height", height);

    const curCircles = swarm(data, // map each data point to an x position (in pixels)
        d => margin + (d.x - minX) / (maxX - minX) * (width - margin * 2), // map each data point to a radius (in pixels)
        d => chartMinR + (d.r - minR) / (maxR - minR) * (chartMaxR - chartMinR), // map each data point to a priority which determines placement order (lower = earlier).
        d => -d.r, height - margin - chartMaxR)

    console.log(curCircles)
    const [cxList, cyList, rList, newCircles] = dataDiff(circles, curCircles)

    if (newCircles.length > 0) {
        // Append circles to the SVG element
        svg.selectAll('circle')
            .data(newCircles)
            .enter()
            .append('circle')
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .attr('r', 0)
            .attr('fill', d => d.datum.color)
    }

    svg.selectAll("circle")
        .transition()
        .duration(chartDuration)
        .attr("cx", function (d, i) {
            return cxList[i];
        })
        .attr("cy", function (d, i) {
            return cyList[i];
        })
        .attr("r", function (d, i) {
            return rList[i];
        })
        .on("end", function () {
            svg.selectAll("circle").remove();
            svg.selectAll('circle')
                .data(curCircles)
                .enter()
                .append('circle')
                .attr('cx', d => d.x)
                .attr('cy', d => d.y)
                .attr('r', d => d.r)
                .attr('fill', d => d.datum.color)
                .on("mouseover", (d, i) => {
                    if (mouseOverCallback) {
                        mouseOverCallback(d, i)
                    }
                })
                .on("mouseout", (d, i) => {
                    if (mouseOutCallback) {
                        mouseOutCallback(d, i)
                    }
                })
                .on("click", (d, i) => {
                    if (clickCallback) {
                        clickCallback(d, i)
                    }
                })
                .on("mousemove", (d, i) => {
                    if (mouseMoveCallback) {
                        mouseMoveCallback(d, i)
                    }
                })
        });

    circles = curCircles

    const xScale = d3.scaleLinear()
        .domain([minX, maxX])
        .range([margin, width - margin]);
    // Define the x-axis
    const xAxis = d3.axisBottom(xScale);
    svg.selectAll("g").remove();
    // Draw the x-axis
    svg.append("g")
        .attr("transform", `translate(0, ${height - margin})`)
        .call(xAxis);

}
