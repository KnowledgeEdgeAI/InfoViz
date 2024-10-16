// Load the JSON data from the file
d3.json("../data/data0.json").then(function(data) {
  
    // Specify the chart’s dimensions.
    const width = 928;
    const height = width;
  
    // Create the color scale.
    const color = d3.scaleLinear()
        .domain([0, 5])
        .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
        .interpolate(d3.interpolateHcl);
  
    // Compute the layout.
    const pack = data => d3.pack()
        .size([width, height])
        .padding(3)
      (d3.hierarchy(data)
      .each(d => d.value = d.value || 1) 
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value));
    const root = pack(data);
    console.log(data);
    
    console.log(root);
    // Create the SVG container.
    const svg = d3.create("svg")
        .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
        .attr("width", width)
        .attr("height", height)
        .attr("style", `max-width: 100%; height: auto; display: block; margin: 0 -14px; background: ${color(0)}; cursor: pointer;`);
  
    // Append the nodes.
    const node = svg.append("g")
        .selectAll("circle")
        .data(root.descendants().slice(1))
        .join("circle")
            .attr("visibility", d => d.depth > 1 ? "hidden" : "visible")  // Use visibility to hide deeper nodes
            .attr("fill", d => d.children ? color(d.depth) : "white")
            .attr("pointer-events", d => !d.children ? "none" : null)
            .on("mouseover", function() { d3.select(this).attr("stroke", "#000"); })
            .on("mouseout", function() { d3.select(this).attr("stroke", null); })
            .on("click", (event, d) => focus !== d && (zoom(event, d), event.stopPropagation()));


  
    // Append the text labels.
    const label = svg.append("g")
        .style("font", "10px sans-serif")
        .attr("pointer-events", "none")
        .attr("text-anchor", "middle")
      .selectAll("text")
      .data(root.descendants())
      .join("text")
        .style("fill-opacity", d => d.parent === root ? 1 : 0)
        .style("display", d => d.parent === root ? "inline" : "none")
        .text(d => d.data.name);
  
    // Create the zoom behavior and zoom immediately in to the initial focus node.
    svg.on("click", (event) => zoom(event, root));
    let focus = root;
    let view;
    zoomTo([focus.x, focus.y, focus.r * 2]);
    console.log(node);
    console.log(label);
    function zoomTo(v) {
      const k = width / v[2];
  
      view = v;

      //show the nodes which have depth less than depth of focus node + 1
    node.attr("visibility", d => d.depth > focus.depth + 1 ? "hidden" : "visible");
      label.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
      node.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
      node.attr("r", d => d.r * k);
    }
  
    function zoom(event, d) {
      const focus0 = focus;
  
      focus = d;
  
      const transition = svg.transition()
          .duration(event.altKey ? 7500 : 750)
          .tween("zoom", d => {
            const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
            return t => zoomTo(i(t));
          });
  
      label
        .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
        .transition(transition)
          .style("fill-opacity", d => d.parent === focus ? 1 : 0)
          .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
          .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });

    }
  
    // Append the chart to the div element
    document.getElementById('chart').appendChild(svg.node());
  
  });


// trying to work with dynamic data
  const data = [
    {r: 100, x: 0, y: 0, depth: 1, children: null, parent: "test_root", text: "root"},
    {r: 100, x: 200, y: 0, depth: 1, children: null, parent: "test_root", text: "root2"},
];

const width = 928;
const height = width;

// Create the color scale.
const color = d3.scaleLinear()
    .domain([0, 5])
    .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
    .interpolate(d3.interpolateHcl);

const svg = d3.create("svg")
    .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
    .attr("width", width)
    .attr("height", height)
    .attr("style", `max-width: 100%; height: auto; display: block; margin: 0 -14px; background: ${color(0)}; cursor: pointer;`);

const node = svg.append("g")
    .selectAll("circle")
    .data(data)
    .join("circle")
        .attr("cx", d => d.x) // Set the x position
        .attr("cy", d => d.y) // Set the y position
        .attr("r", d => d.r)  // Set the radius
        .attr("fill", d => color(d.depth)) // Optional: Set the fill color based on depth
        .attr("visibility", d => d.depth > 1 ? "hidden" : "visible")  // Use visibility to hide deeper nodes
            .attr("fill", d => d.children ? color(d.depth) : "white")
            .attr("pointer-events", d => !d.children ? "none" : null)
            .on("mouseover", function() { d3.select(this).attr("stroke", "#000"); })
            .on("mouseout", function() { d3.select(this).attr("stroke", null); });

const label = svg.append("g")
    .style("font", "10px sans-serif")
    .attr("pointer-events", "none")
    .attr("text-anchor", "middle")
  .selectAll("text")
  .data(data)
  .join("text")
    .attr("x", d => d.x)
    .attr("y", d => d.y)
    .style("fill-opacity", 1)
    .style("display", "inline")
    .text(d => d.text);

document.getElementById('chart_test').appendChild(svg.node());



// const plot = (data, svg) => {
//   const circle = svg
//     .selectAll('circle')
//     .data(data)
//     .join('circle')
//     .attr('cy', circleRadius)
//     .attr('cx', (d, i) => circleRadius + (i * circleDiameter))
//     .attr('r', circleRadius);


//   circle
//     .enter()
//     .append('circle')
//     .attr('cy', circleRadius)
//     .attr('cx', (d, i) => circleRadius + (i * circleDiameter))
//     .attr('r', 0)
//     .transition()
//     .attr('r', circleRadius);

//   circle
//     .exit()
//     .transition()
//     .attr('r', 0)
//     .remove();
// };



// const addCircle = () => {
//   if (data.length < 5) data.push(1);
//   plot(data, svg);
// };

// const removeCircle = () => {
//   data.pop();
//   plot(data, svg);
// };



// plot(data, svg);