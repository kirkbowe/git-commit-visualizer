document.getElementById('apply-filter').addEventListener('click', () => {
    const authorFilter = document.getElementById('author-filter').value;
    updateVisualization(authorFilter);
});

function updateVisualization(authorFilter = '') {
    const apiUrl = authorFilter ? `/api/commits?author=${authorFilter}` : '/api/commits';

    // Fetch commit data and render the visualization
    d3.json(apiUrl).then(function(data) {
        var svg = d3.select("svg"),
            width = +svg.attr("width"),
            height = +svg.attr("height");

        // Clear the visualization
        svg.selectAll("*").remove();

        // Create a group to hold all elements
        const g = svg.append("g");

        // Zoom behavior
        const zoom = d3.zoom()
            .scaleExtent([1, 8]) // Define the scale limits
            .on("zoom", (event) => {
                g.attr("transform", event.transform);
            });

        // Create a rectangle to capture zoom events
        svg.append("rect")
            .attr("width", width)
            .attr("height", height)
            .attr("class", "zoom-rect")
            .attr("fill", "none")
            .attr("pointer-events", "all");

        // Apply zoom behavior to the svg
        svg.call(zoom);

        var tooltip = d3.select("#tooltip");

        var nodes = data.map(function(d, i) {
            return { 
                id: d.sha, 
                label: d.message.split("\n")[0], 
                x: Math.random() * width,  // Random x coordinate
                y: Math.random() * height  // Random y coordinate
            };
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

        var link = g.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(links)
            .enter().append("line")
            .attr("stroke-width", 2);

        var node = g.append("g")
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
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html("Commit: " + d.label + "<br/>" + d.id)
                    .style("left", (event.pageX + 5) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function() {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        var label = g.append("g")
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
                .attr("cx", function(d) { return d.x = Math.max(10, Math.min(width - 10, d.x)); })
                .attr("cy", function(d) { return d.y = Math.max(10, Math.min(height - 10, d.y)); });

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
}

window.onload = function() {
    updateVisualization('');
};
