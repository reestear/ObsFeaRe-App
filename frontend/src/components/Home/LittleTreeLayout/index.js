import * as d3 from "d3";
import React, { useEffect, useRef } from "react";
import data from "./data.json";

const LittleTreeLayout = () => {
  const svgRef = useRef(null);
  const WIDTH = 500;
  const HEIGHT = 400;
  const nodeRadius = 10;

  useEffect(() => {
    const svgContainer = d3.select(svgRef.current);
    svgContainer.attr("width", WIDTH).attr("height", HEIGHT);

    // Add background grid
    const gridSize = 50;
    const numHorizontalLines = Math.ceil(HEIGHT / gridSize);
    const numVerticalLines = Math.ceil(WIDTH / gridSize);
    const verticalLineX = d3.range(-gridSize, WIDTH + gridSize, gridSize); // Extend beyond the left and right boundaries
    const horizontalLineY = d3.range(-gridSize, HEIGHT + gridSize, gridSize);

    svgContainer
      .selectAll(".vertical-lineSmall")
      .data(verticalLineX)
      .enter()
      .append("line")
      .attr("class", "vertical-lineSmall")
      .attr("x1", (d) => d)
      .attr("y1", 0)
      .attr("x2", (d) => d)
      .attr("y2", HEIGHT)
      .style("stroke", (d) => (d === 0 || d === WIDTH ? "none" : "lightgray"))
      .style("stroke-width", 1);

    svgContainer
      .selectAll(".horizontal-lineSmall")
      .data(horizontalLineY)
      .enter()
      .append("line")
      .attr("class", "horizontal-lineSmall")
      .attr("x1", 0)
      .attr("y1", (d) => d)
      .attr("x2", WIDTH)
      .attr("y2", (d) => d)
      .style("stroke", (d) => (d === 0 || d === HEIGHT ? "none" : "lightgray"))
      .style("stroke-width", 1);

    const simulation = d3
      .forceSimulation(data.nodes)
      .force("charge", d3.forceManyBody().strength(-300))
      .force(
        "link",
        d3
          .forceLink(data.links)
          .id((d) => d.id)
          .distance(50)
      )
      .force("center", d3.forceCenter(WIDTH / 2, HEIGHT / 2))
      .force("x", d3.forceX(WIDTH / 2).strength(0.1)) // Constrain nodes to stay horizontally centered
      .force("y", d3.forceY(HEIGHT / 2).strength(0.1));

    const links = svgContainer
      .selectAll(".linkSmall")
      .data(data.links)
      .enter()
      .append("line")
      .attr("class", "linkSmall")
      .style("stroke", "gray")
      .style("stroke-width", 2);

    const nodes = svgContainer
      .selectAll(".nodeSmall")
      .data(data.nodes)
      .enter()
      .append("circle")
      .attr("class", "nodeSmall")
      .attr("r", nodeRadius)
      .style("fill", "steelblue")
      .call(
        d3
          .drag()
          .on("start", (d) => {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (d) => {
            if (!d3.event.active) simulation.alphaTarget(0);
            d.fx = d3.event.x;
            d.fy = d3.event.y;
          })
          .on("end", (d) => {
            if (!d3.event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    simulation.on("tick", () => {
      links
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      nodes.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
    });
  }, [data, WIDTH, HEIGHT]);

  return (
    <div
      className="LittleTreeLayout"
      style={{ position: "absolute", top: "20%" }}
    >
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default React.memo(LittleTreeLayout);
