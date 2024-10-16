// Load the JSON data from the file
d3.json("../data/data1.json").then(function(data) {
  
    // Specify the chart’s dimensions.
    const width = 928;
    const height = width;
  
    // Create the color scale.
    const color = d3.scaleLinear()
        .domain([0, 5])
        .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
        .interpolate(d3.interpolateHcl);
  let node;
  let label;
  let root;
      // Function to compute the layout and update the visualization
function update(data) {
  // Update the root data with the new data structure
  root = d3.pack()
  .size([width, height])
  .padding(3)
  (d3.hierarchy(data)
  .each(d => d.value = d.value || 1) 
      .sum(d => d.value)
      .sort((a, b) => b.value - a.value));
    console.log(root);
    // clear the previous svg groups
    d3.selectAll("g").remove();
    d3.selectAll("text").remove();
    d3.selectAll("circle").remove();

      // Append the nodes.
      node = svg.append("g")
      .selectAll("circle")
      .data(root.descendants().slice(1))
      .join("circle")
          .attr("visibility", d => d.depth > 1 ? "hidden" : "visible")  // Use visibility to hide deeper nodes
          .attr("fill", d => d.children ? color(d.depth) : "white")
        //   .attr("pointer-events", d => !d.children ? null : null)
          .on("mouseover", function() { d3.select(this).attr("stroke", "#000"); })
          .on("mouseout", function() { d3.select(this).attr("stroke", null); })
          .on("click", (event, d) => focus !== d && (zoom(event, d), event.stopPropagation()));



  // Append the text labels.
  label = svg.append("g")
      .style("font", "10px sans-serif")
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
    .selectAll("text")
    .data(root.descendants())
    .join("text")
      .style("fill-opacity", d => d.parent === root ? 1 : 0)
      .style("display", d => d.parent === root ? "inline" : "none")
      .text(d => d.data.name);
}

    const svg = d3.create("svg")
        .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
        .attr("width", width)
        .attr("height", height)
        .attr("style", `max-width: 100%; height: auto; display: block; margin: 0 -14px; background: ${color(0)}; cursor: pointer;`);

    update(data);

    // Create the zoom behavior and zoom immediately in to the initial focus node.
    svg.on("click", (event) => zoom(event, root));
    let focus = root;
    let view;
    zoomTo([focus.x, focus.y, focus.r * 2]);
  
    function zoomTo(v) {
      const k = width / v[2];
  
      view = v;

      //show the nodes which have depth less than depth of focus node + 1
    node.attr("visibility", d => d.depth > focus.depth + 1 ? "hidden" : "visible");
      label.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
      node.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
      node.attr("r", d => d.r * k);
    }
  
    async function zoom(event, d) {
        console.log(data);
        
        // Load the new data and await it before proceeding
        const newData = await d3.json("../data/data0.json");
        
        // Update the visualization with the new data
        update(newData);
        
        // Find the node in the new root with the same name as the clicked node
        focus = root.descendants().find(node1 => node1.data.name === d.data.name);
        console.log("New focus after data update:", focus);
    
        // Continue with the zoom transition using the updated focus node
        const transition = svg.transition()
            .duration(event.altKey ? 7500 : 750)
            .tween("zoom", () => {
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
    document.getElementById('wip_chart').appendChild(svg.node());
  
  });






