import * as d3 from "d3";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTrees } from "../../../../../Contexts/TreeContext";
import ColorNode from "./ColorNode.json";
import NodeToolkit from "./NodeToolkit";
import "./styles.css";

const TreeLayout = React.memo(
  ({ toggleOpenTreeInfo, outsideToggleOpenTreeInfo }) => {
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

    const [tooltipOpen, setTooltipOpen] = useState(false);
    const [tooltipNode, setTooltipNode] = useState(null);
    const [tooltipNodePosition, setTooltipNodePosition] = useState({
      x: 0,
      y: 0,
    });

    function handleTooltipEnter() {
      setTooltipOpen(true);
    }
    function handleTooltipLeave() {
      setTooltipOpen(false);
    }

    const [dragging, setDragging] = useState(false);

    // To get the inital zoom settings when mounting
    const [initialZoomSettings, setInitialZoomSettings] = useState(null);
    const [mounted, setMounted] = useState(true);

    useEffect(() => {
      // Fetch zoom settings from local storage
      const storedZoomSettings = localStorage.getItem("zoomSettings");
      if (storedZoomSettings) {
        const zoomSettings = JSON.parse(storedZoomSettings);
        const initialZoom = d3.zoomIdentity
          .translate(+zoomSettings.x, +zoomSettings.y)
          .scale(+zoomSettings.k);
        setInitialZoomSettings(initialZoom);
      }
    }, []);

    // Listening for rectangle
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

    // Creating SVG Container
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
      }
    }, []);

    // Zooming in, out, and panning
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
          const { transform } = d3.event;
          zoomContainer.attr("transform", transform);
          localStorage.setItem("zoomSettings", JSON.stringify(transform));
        });

      // Apply the zoom behavior to the zoom container
      svgContainer.call(zoom);

      // Check if there are initial zoom settings to apply
      if (initialZoomSettings && mounted) {
        svgContainer.call(zoom.transform, initialZoomSettings);
        setMounted(false);
      }

      // Listen for spacebar key events
      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);

      // Clean up event listeners
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("keyup", handleKeyUp);
      };
    }, [panning]);

    // Vertical and Horizontal Lines for the BackGround Grid
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

    // Displaying trees
    useEffect(() => {
      const svgContainer = d3.select(svgRef.current);
      const zoomContainer = svgContainer.select(".zoom-container");

      zoomContainer.selectAll(".tree").remove();

      // Render the trees
      trees.forEach((tree) => {
        const { nodes, links, treeId } = tree;
        // console.log(nodes);

        // Retrieve the node positions from localStorage
        const storedNodePositions = localStorage.getItem("nodePositions");
        if (storedNodePositions !== null) {
          try {
            const nodePositions =
              storedNodePositions !== null
                ? JSON.parse(storedNodePositions)
                : {};
            const curNodePositions = nodePositions[treeId];
            // Update the node positions
            nodes.forEach((node) => {
              const storedPosition = curNodePositions[node._id];
              if (storedPosition) {
                node.x = storedPosition.x;
                node.y = storedPosition.y;
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
          .force("charge", d3.forceManyBody().strength(-300));

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

          setDragging(true);
        }
        function dragged(d) {
          if (!d3.event.active) simulation.alphaTarget(0);
          d.fx = d3.event.x;
          d.fy = d3.event.y;

          // setTooltipNode(null);
        }
        function dragended(d) {
          if (!d3.event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;

          setDragging(false);

          // Store the updated node positions in localStorage
          const curNodePositions = {};
          nodes.forEach((node) => {
            curNodePositions[node._id] = { x: node.x, y: node.y };
          });
          const storedNodePositions = localStorage.getItem("nodePositions");
          if (storedNodePositions !== null) {
            const nodePositions = JSON.parse(storedNodePositions);
            nodePositions[treeId] = curNodePositions;
            localStorage.setItem(
              "nodePositions",
              JSON.stringify(nodePositions)
            );
          } else {
            const nodePositions = {};
            nodePositions[treeId] = curNodePositions;
            localStorage.setItem(
              "nodePositions",
              JSON.stringify(nodePositions)
            );
          }
        }

        // Append the circle to the node container
        nodeElements
          .append("circle")
          .attr("r", nodeRadius)
          .style("fill", (d) => {
            if (d.isRoot) return ColorNode.ROOT_NODE;
            if (d.isLeaf) return ColorNode.LEAF_NODE;
            return ColorNode.DEFAULT_NODE;
          })
          .attr("filter", "url(#inner-shadow-filter)")
          .on("mouseenter", function (d) {
            this.setAttribute("prev_fill", this.style.fill);
            this.style.fill = ColorNode.ACTIVE_NODE;

            // using custom method

            const boundingRect = this.getBoundingClientRect();
            const nodePosition = {
              x: boundingRect.left + boundingRect.width / 2,
              y: boundingRect.top + boundingRect.height / 2,
            };

            // Set the tooltip data and position based on the mouse cursor position
            handleTooltipEnter();
            setTooltipNode(d);
            setTooltipNodePosition({ x: nodePosition.x, y: nodePosition.y });

            // console.log(d);
            // console.log(nodePosition);
          })
          .on("mouseleave", function () {
            this.style.fill = this.getAttribute("prev_fill");

            // Hide the tooltip when the mouse leaves the node
            handleTooltipLeave();
            setTooltipNode(null);
          })
          .on("click", async function () {
            const curTree = await resTrees.find(
              (item) => item.treeId === treeId
            );

            toggleOpenTreeInfo(curTree);
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
          .style("user-select", "none") // Prevent text selection
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

    // memoized inner shadow filter
    // Pre-render the filter components outside the component to avoid unnecessary re-renders
    const innerShadowFilter = useMemo(
      () => (
        // <svg width="0" height="0">
        <defs>
          <filter id="inner-shadow-filter">
            {/* ... Your filter components ... */}
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
        // </svg>
      ),
      []
    );

    return (
      <>
        {tooltipOpen && !dragging && (
          <NodeToolkit
            node={tooltipNode}
            nodePosition={tooltipNodePosition}
            handleTooltipEnter={handleTooltipEnter}
            handleTooltipLeave={handleTooltipLeave}
          ></NodeToolkit>
        )}
        <svg ref={svgRef} width={WIDTH} height={HEIGHT}>
          {/* {innerShadowFilter} */}
          <rect ref={rectRef} width="100%" height="100%" fill="#EAEAEA" />
          <g className="zoom-container"></g>
        </svg>
      </>
    );
  }
);

export default TreeLayout;
