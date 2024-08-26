// Sample data points with x and y coordinates for the first dataset
const data = [
    { x: 30, y: 20 },
    { x: 85, y: 75 },
    { x: 45, y: 50 },
    { x: 60, y: 80 },
    { x: 90, y: 10 },
    { x: 70, y: 55 },
    { x: 55, y: 35 },
    { x: 80, y: 60 },
    { x: 20, y: 40 },
    { x: 100, y: 90 }
];

// Sample data points for the second dataset
const secondData = [
    { x: 40, y: 30 },
    { x: 75, y: 70 },
    { x: 50, y: 45 },
    { x: 65, y: 85 },
    { x: 95, y: 15 },
    { x: 25, y: 60 },
    { x: 55, y: 20 },
    { x: 70, y: 90 },
    { x: 30, y: 40 },
    { x: 10, y: 80 }
];

// Set up the dimensions of the chart
const width = 500;
const height = 300;
const margin = { top: 20, right: 30, bottom: 40, left: 40 };

// Create an SVG element
const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Set up the scales
const xScale = d3.scaleLinear()
    .domain([0, 120])
    .range([0, width]);

const yScale = d3.scaleLinear()
    .domain([0, 100])
    .range([height, 0]);

// Function to render circles and labels
function render(dataSet, color) {
    // Bind data to groups (g elements)
    const groups = svg.selectAll(".datapoint")
        .data(dataSet, d => d.x + '-' + d.y);

    // Enter selection: append new groups
    const enterGroups = groups.enter()
        .append("g")
        .attr("class", "datapoint")
        .attr("transform", d => `translate(${xScale(d.x)},${yScale(d.y)})`)
        .on("click", function() {
            // Update with the second dataset on click
            render(secondData, "orange");
        });

    // Append circles to the groups
    enterGroups.append("circle")
        .attr("r", 15)
        .attr("fill", color);

    // Append labels to the groups
    enterGroups.append("text")
        .text((d, i) => String.fromCharCode(65 + i)) // Assign alphabetical character as name
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .attr("fill", "white")
        .attr("font-size", "12px");

    // Exit selection: remove groups no longer in the data
    groups.exit().remove();
}

// Initial rendering of the first dataset
render(data, "steelblue");
