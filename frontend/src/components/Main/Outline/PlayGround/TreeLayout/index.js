import * as d3 from "d3";
import React, { useEffect, useRef, useState } from "react";
import { useTrees } from "../../../../../Contexts/TreeContext";
import ColorNode from "./ColorNode.json";
import "./styles.css";

const TreeLayout = ({ toggleOpenTreeInfo, outsideToggleOpenTreeInfo }) => {
  const treesContext = useTrees();
  const { trees, resTrees } = treesContext;

  const WIDTH = 1512;
  const HEIGHT = 800 * 0.94;
  const nodeRadius = 15; // Adjust the radius of the circles
  const padding = 25;

  const svgRef = useRef(null);
  const [panning, setPanning] = useState(false);
  let movedZoom = useRef(false);

  const rectRef = useRef(null);

  useEffect(() => {
    // Everything around if statement
    if (rectRef && rectRef.current) {
      rectRef.current.addEventListener("click", (e) => {
        // console.log("CLICKED ON RECT");
        outsideToggleOpenTreeInfo();
      });

      // return () => {
      //   rectRef.current.removeEventListener("click");
      // };
    }
  }, [rectRef]);

  useEffect(() => {
    const svgContainer = d3.select(svgRef.current);
    const zoomContainer = svgContainer.select(".zoom-container");

    const storedZoomSetttings = localStorage.getItem("zoomSettings");
    if (storedZoomSetttings !== null && !movedZoom.current) {
      const zoomSettings = JSON.parse(storedZoomSetttings);
      zoomContainer.attr(
        "transform",
        `translate(${zoomSettings.x},${zoomSettings.y}) scale(${zoomSettings.k})`
      );
      // d3.event = { ...d3.event, transform: zoomSettings };
    }
  }, []);

  useEffect(() => {
    const svgContainer = d3.select(svgRef.current);
    const zoomContainer = svgContainer.select(".zoom-container");

    const handleKeyDown = (event) => {
      if (event.code === "Space") {
        setPanning(true);
        svgContainer.style("cursor", "grabbing");
        event.preventDefault(); // Prevent default scrolling behavior
      }
    };

    const handleKeyUp = (event) => {
      if (event.code === "Space") {
        setPanning(false);
        svgContainer.style("cursor", "auto");
        event.preventDefault(); // Prevent default scrolling behavior
      }
    };

    // Define the zoom behavior
    const zoom = d3
      .zoom()
      .scaleExtent([0.25, 1.5])
      .translateExtent([
        [-2 * WIDTH, -2 * HEIGHT], // Set the lower bounds for translation (left, top)
        [2 * WIDTH, 2 * HEIGHT], // Set the upper bounds for translation (right, bottom)
      ])
      .filter(() => panning) // Disable zooming when panning is active
      .on("zoom", () => {
        const storedZoomSetttings = localStorage.getItem("zoomSettings");
        if (storedZoomSetttings !== null && !movedZoom.current) {
          const zoomSettings = JSON.parse(storedZoomSetttings);
          // transform.x = zoomSettings.x;
          // transform.y = zoomSettings.y;
          // transform.k = zoomSettings.k;
          d3.event.transform.x = zoomSettings.x;
          d3.event.transform.y = zoomSettings.y;
          d3.event.transform.k = zoomSettings.k;
        }

        const { transform } = d3.event;

        // console.log("this is d3.event.transform: ");
        // console.log(d3.event.transform);
        zoomContainer.attr("transform", transform);

        const zoomSettings = {
          x: transform.x,
          y: transform.y,
          k: transform.k,
        };
        localStorage.setItem("zoomSettings", JSON.stringify(zoomSettings));
        movedZoom.current = true;
      });

    // Apply the zoom behavior to the zoom container
    svgContainer.call(zoom);

    // Listen for spacebar key events
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Clean up event listeners
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [panning]);

  useEffect(() => {
    const svgContainer = d3.select(svgRef.current);
    const zoomContainer = svgContainer.select(".zoom-container");
    const width = 2 * WIDTH; // handle the width of background-grid
    const height = 2 * HEIGHT; // handle the height of background-grid
    const gridSize = 70; // Adjust the size of the grid squares as desired

    // Calculate the number of hor izontal and vertical lines based on the container size and grid size
    const numHorizontalLines = Math.ceil(height / gridSize);
    const numVerticalLines = Math.ceil(width / gridSize);

    // Create an array of x-coordinates for the vertical lines
    const verticalLineX = d3.range(-2 * width, 2 * width, gridSize);

    // Create an array of y-coordinates for the horizontal lines
    const horizontalLineY = d3.range(-2 * height, 2 * height, gridSize);

    // Append the vertical lines to the zoom container
    zoomContainer
      .selectAll(".vertical-line")
      .data(verticalLineX)
      .enter()
      .append("line")
      .attr("class", "vertical-line")
      .attr("x1", (d) => d)
      .attr("y1", -2 * height)
      .attr("x2", (d) => d)
      .attr("y2", 2 * height)
      .style("stroke", "white") // Adjust the line color as desired
      .style("stroke-width", 1); // Adjust the line width as desired
    // .style("stroke-dasharray", "2,2"); // Adjust the line dash pattern as desired

    // Append the horizontal lines to the zoom container
    zoomContainer
      .selectAll(".horizontal-line")
      .data(horizontalLineY)
      .enter()
      .append("line")
      .attr("class", "horizontal-line")
      .attr("x1", -2 * width)
      .attr("y1", (d) => d)
      .attr("x2", 2 * width)
      .attr("y2", (d) => d)
      .style("stroke", "white") // Adjust the line color as desired
      .style("stroke-width", 1); // Adjust the line width as desired
    // .style("stroke-dasharray", "2,2"); // Adjust the line dash pattern as desired
  }, []);

  useEffect(() => {
    const svgContainer = d3.select(svgRef.current);
    const zoomContainer = svgContainer.select(".zoom-container");

    zoomContainer.selectAll(".tree").remove();

    // Render the trees
    trees.forEach((tree) => {
      const { nodes, links, treeId } = tree;

      // Retrieve the node positions from localStorage
      const storedNodePositions = localStorage.getItem("nodePositions");
      if (storedNodePositions !== null) {
        try {
          const nodePositions =
            storedNodePositions !== null ? JSON.parse(storedNodePositions) : {};
          const curNodePositions = nodePositions[treeId];
          // Update the node positions
          nodes.forEach((node) => {
            const storedPosition = curNodePositions[node._id];
            if (storedPosition) {
              node.x = storedPosition.x;
              node.y = storedPosition.y;
              // node.fx = storedPosition.x;
              // node.fy = storedPosition.y;
            }
          });
        } catch (error) {
          console.log("error appeared");
          console.log(error);
        }
      }

      // Create a group for the current tree
      const treeGroup = zoomContainer.append("g").attr("class", "tree");

      // Create a force simulation
      const simulation = d3
        .forceSimulation(nodes)
        .force(
          "link",
          d3
            .forceLink(links)
            .id((d) => d._id)
            .distance(150)
        )
        .force("charge", d3.forceManyBody().strength(-300))
        // .force(
        //   "center",
        //   d3.forceCenter(WIDTH * Math.random(), HEIGHT * Math.random())
        // )
        .force("attractToRoot", () => {
          const alpha = 0.1; // Adjust the strength of the force as desired

          return (alpha) => {
            nodes.forEach((node) => {
              if (node._id !== nodes[0]._id) {
                const dx = node.x - nodes[0].x; // Calculate the distance along the x-axis from the current node to the root
                const dy = node.y - nodes[0].y; // Calculate the distance along the y-axis from the current node to the root
                const distance = Math.sqrt(dx ** 2 + dy ** 2); // Calculate the distance between the current node and the root

                // Apply a force to push the node towards the root
                node.vx -= (dx / distance) * alpha;
                node.vy -= (dy / distance) * alpha;
              }
            });
          };
        });
      // .alphaTarget(0.3);
      // .force("collision", d3.forceCollide().radius(20));

      // Create SVG elements for links
      const linkElements = treeGroup
        .selectAll(".link")
        .data(links)
        .enter()
        .append("line")
        .attr("class", "link")
        // .style("stroke", "black")
        .style("stroke-width", 1);

      // Create SVG elements for nodes
      const nodeElements = treeGroup
        .selectAll(".node")
        .data(nodes)
        .enter()
        .append("g") // Create a container <g> element for each node
        .attr("class", "node")
        .attr("transform", (d) => `translate(${d.x},${d.y})`) // Position the node using its x and y coordinates
        .call(
          d3
            .drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended)
        );

      function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }
      function dragged(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      }
      function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;

        // Store the updated node positions in localStorage
        const curNodePositions = {};
        nodes.forEach((node) => {
          curNodePositions[node._id] = { x: node.x, y: node.y };
        });
        const storedNodePositions = localStorage.getItem("nodePositions");
        if (storedNodePositions !== null) {
          const nodePositions = JSON.parse(storedNodePositions);
          nodePositions[treeId] = curNodePositions;
          localStorage.setItem("nodePositions", JSON.stringify(nodePositions));
        } else {
          // const nodePositions = {
          //   treeId: curNodePositions,
          // };
          const nodePositions = {};
          nodePositions[treeId] = curNodePositions;
          localStorage.setItem("nodePositions", JSON.stringify(nodePositions));
        }
      }

      // Append the circle to the node container
      nodeElements
        .append("circle")
        .attr("r", nodeRadius)
        // .style("fill", (d) => (d.isRoot ? "#E51C1C" : "steelblue")) // Set different color for the root node
        .style("fill", (d) => {
          if (d.isRoot) return ColorNode.ROOT_NODE;
          if (d.isLeaf) return ColorNode.LEAF_NODE;
          return ColorNode.DEFAULT_NODE;
        })
        .style(
          "box-shadow",
          "0px 0px 12px 1.8000000715255737px rgba(255, 255, 255, 0.50) inset"
        )
        .attr("filter", "url(#inner-shadow)")
        .on("mouseover", function () {
          this.setAttribute("prev_fill", this.style.fill);
          this.style.fill = ColorNode.ACTIVE_NODE;
        })
        .on("mouseout", function () {
          this.style.fill = this.getAttribute("prev_fill");
        })
        .on("click", async function (d) {
          // console.log(d.nodeTitle);
          const curTree = await resTrees.find((item) => item.treeId === treeId);

          toggleOpenTreeInfo(curTree);
          // console.log(tree.treeId);
        });

      // Append the title to the node
      nodeElements
        .append("text")
        .attr("class", "node-title")
        .attr("dy", nodeRadius + 12.5) // Adjust the vertical position of the title
        .style("text-anchor", "middle") // Align the text to the center
        .style("fill", "gray") // Set the color of the text
        .style("font-size", "10px") // Set the font size
        .style("opacity", 1) // Set the opacity
        .text((d) => d.nodeTitle);

      // Update the positions of nodes and titles on each tick of the simulation
      simulation.on("tick", () => {
        nodeElements.attr("transform", (d) => `translate(${d.x},${d.y})`);
      });

      // Update the positions of links and nodes on each tick of the simulation
      simulation.on("tick", () => {
        nodeElements.attr("transform", (d) => `translate(${d.x},${d.y})`);
        nodeElements.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

        linkElements
          .attr(
            "x1",
            (d) =>
              d.source.x +
              ((nodeRadius + padding) * (d.target.x - d.source.x)) /
                Math.sqrt(
                  (d.target.x - d.source.x) ** 2 +
                    (d.target.y - d.source.y) ** 2
                )
          )
          .attr(
            "y1",
            (d) =>
              d.source.y +
              ((nodeRadius + padding) * (d.target.y - d.source.y)) /
                Math.sqrt(
                  (d.target.x - d.source.x) ** 2 +
                    (d.target.y - d.source.y) ** 2
                )
          )
          .attr(
            "x2",
            (d) =>
              d.target.x -
              ((nodeRadius + padding) * (d.target.x - d.source.x)) /
                Math.sqrt(
                  (d.target.x - d.source.x) ** 2 +
                    (d.target.y - d.source.y) ** 2
                )
          )
          .attr(
            "y2",
            (d) =>
              d.target.y -
              ((nodeRadius + padding) * (d.target.y - d.source.y)) /
                Math.sqrt(
                  (d.target.x - d.source.x) ** 2 +
                    (d.target.y - d.source.y) ** 2
                )
          );
      });
    });
  }, [trees]);
  // inner-shadow
  return (
    <svg ref={svgRef} width={WIDTH} height={HEIGHT}>
      <defs>
        <filter
          id="inner-shadow"
          // x="0.5"
          // y="0"
          // // width="30"
          // // height="30"
          // filterUnits="userSpaceOnUse"
          // color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feMorphology
            radius="1"
            operator="erode"
            in="SourceAlpha"
            result="effect1_innerShadow_354_131"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="5" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0"
          />
          <feBlend
            mode="normal"
            in2="shape"
            result="effect1_innerShadow_354_131"
          />
        </filter>
      </defs>

      <rect ref={rectRef} width="100%" height="100%" fill="#EAEAEA" />
      <g className="zoom-container">{/* Render your tree components here */}</g>
    </svg>
  );
};

export default TreeLayout;
