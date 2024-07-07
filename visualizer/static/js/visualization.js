// Fetch commit data and render the visualization
window.onload = function() {
d3.json('/api/commits').then(function(data) {
    var svg = d3.select("svg"),
        width = +svg.attr("width"),
        height = +svg.attr("height");
    
    var tooltip = d3.select("#tooltip");

    var nodes = data.map(function(d, i) {
        return { id: d.sha, label: d.message.split("\n")[0], x: width / 2, y: i * 30 + 20 };
    });

    var links = [];
    data.forEach(function(d) {
        d.parents.forEach(function(p) {
            links.push({ source: p, target: d.sha });
        });
    });

    var simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(function(d) { return d.id; }).distance(50))
        .force("charge", d3.forceManyBody().strength(-200))
        .force("center", d3.forceCenter(width / 2, height / 2));

    var link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(links)
        .enter().append("line")
        .attr("stroke-width", 2);

    var node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(nodes)
        .enter().append("circle")
        .attr("r", 10)
        .attr("class", "commit-node")
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended))
        .on("mouseover", function(event, d) {
            var eventX = event.pageX;
            var eventY = event.pageY;

            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html("Commit: " + d.label + "<br/>" + d.id)
                .style("left", (eventX + 5) + "px")
                .style("top", (eventY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

    var label = svg.append("g")
        .attr("class", "labels")
        .selectAll("text")
        .data(nodes)
        .enter().append("text")
        .attr("class", "commit-label")
        .attr("dy", ".35em")
        .text(function(d) { return d.label; });

    simulation
        .nodes(nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(links);

    function ticked() {
        link
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });

        label
            .attr("x", function(d) { return d.x + 15; })
            .attr("y", function(d) { return d.y; });
    }

    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
}).catch(function(error) {
    console.error('Error fetching commit data:', error);
  });
};
