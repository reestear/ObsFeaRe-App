import { animated as a, useSpring } from "@react-spring/web";
import React from "react";
import { deleteNode } from "../../../../../../Contexts/Services";
import { useTrees } from "../../../../../../Contexts/TreeContext";
import ColorNode from "../ColorNode.json";
import "./styles.css";

export default function NodeToolkit({
  node,
  nodePosition,
  handleTooltipEnter,
  handleTooltipLeave,
  tooltipOpen,
}) {
  const treesContext = useTrees();
  const { updateTrees } = treesContext;

  const animatedProps = useSpring({
    from: {
      transform: tooltipOpen ? "scale(0, 0)" : "scale(1, 1)",
    },
    transform: tooltipOpen ? "scale(1, 1)" : "scale(0, 0)",
    config: { mass: 1, tension: 100, friction: 20 },
  });

  const handleDeleteClick = async () => {
    await deleteNode(node._id);
    await updateTrees();
    handleTooltipLeave();
  };

  return (
    <a.div
      className="parNodeToolkit"
      style={{
        // visibility: tooltipOpen ? "visible" : "hidden",
        top: `${nodePosition.y}px`,
        left: `${nodePosition.x}px`,
        ...animatedProps,
      }}
      onMouseEnter={() => handleTooltipEnter()}
      // onMouseLeave={() => handleTooltipLeave()}
    >
      <div
        className="NodeToolkit"
        // style={{
        //   top: `${nodePosition.y}px`,
        //   left: `${nodePosition.x}px`,
        // }}
        // onMouseEnter={() => handleTooltipEnter()}
        // // onMouseLeave={() => handleTooltipLeave()}
      >
        <div className="NodeToolkitTitle">
          <p>{node.nodeTitle}</p>
        </div>
        <div className="NodeToolkitBelow">
          <div className="NodeToolkilChildren">
            {node.isLeaf && node.taskId
              ? node.taskId.todos.map((child) => (
                  <div className="NodeToolkitChildrenItem">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="7"
                      height="8"
                      viewBox="0 0 7 8"
                      fill="none"
                    >
                      <circle
                        cx="3.5"
                        cy="4"
                        r="3.5"
                        fill={
                          child.done
                            ? ColorNode.DONE_NODE
                            : ColorNode.DEFAULT_DARK
                        }
                      />
                    </svg>
                    <p
                      style={{
                        color: child.done ? ColorNode.DONE_NODE : "",
                        textDecoration: child.done ? "line-through" : "",
                      }}
                    >
                      {child.todoTitle}
                    </p>
                  </div>
                ))
              : node.children.map((child) => (
                  <div className="NodeToolkitChildrenItem">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="7"
                      height="8"
                      viewBox="0 0 7 8"
                      fill="none"
                    >
                      <circle
                        cx="3.5"
                        cy="4"
                        r="3.5"
                        fill={
                          child.done
                            ? ColorNode.DONE_NODE
                            : ColorNode.DEFAULT_DARK
                        }
                      />
                    </svg>
                    <p style={{ color: child.done ? ColorNode.DONE_NODE : "" }}>
                      {child.nodeTitle}
                    </p>
                  </div>
                ))}
          </div>
          <div className="NodeTolkitButtons">
            {node.isLeaf && (
              <button
                style={{ backgroundColor: "#DF8D41" }}
                onClick={() => console.log("clicked")}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_500_14)">
                    <g clip-path="url(#clip1_500_14)">
                      <line
                        x1="2.3"
                        y1="0.9"
                        x2="2.3"
                        y2="11.1"
                        stroke="white"
                        stroke-width="1.8"
                        stroke-linecap="round"
                      />
                      <line
                        x1="6.29999"
                        y1="2.9"
                        x2="6.29999"
                        y2="9.1"
                        stroke="white"
                        stroke-width="1.8"
                        stroke-linecap="round"
                      />
                      <line
                        x1="10.3"
                        y1="4.9"
                        x2="10.3"
                        y2="7.1"
                        stroke="white"
                        stroke-width="1.8"
                        stroke-linecap="round"
                      />
                    </g>
                  </g>
                  <defs>
                    <clipPath id="clip0_500_14">
                      <rect width="12" height="12" fill="white" />
                    </clipPath>
                    <clipPath id="clip1_500_14">
                      <rect
                        width="10.8"
                        height="12"
                        fill="white"
                        transform="translate(0.599998)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </button>
            )}
            <button style={{ backgroundColor: "#4679C7" }}>
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <ellipse
                  cx="5.94724"
                  cy="6.10538"
                  rx="2.10525"
                  ry="2.10526"
                  fill="white"
                />
                <ellipse
                  cx="10.3684"
                  cy="1.47368"
                  rx="1.47367"
                  ry="1.47368"
                  fill="white"
                />
                <ellipse
                  cx="1.5263"
                  cy="1.68401"
                  rx="1.47367"
                  ry="1.47368"
                  fill="white"
                />
                <ellipse
                  cx="1.5263"
                  cy="10.5262"
                  rx="1.47367"
                  ry="1.47368"
                  fill="white"
                />
                <ellipse
                  cx="10.3684"
                  cy="10.5262"
                  rx="1.47367"
                  ry="1.47368"
                  fill="white"
                />
                <path
                  d="M5.87292 6.03077L10.3388 1.56483"
                  stroke="white"
                  stroke-width="0.210526"
                />
                <path
                  d="M5.94732 6.10511L10.4132 10.571"
                  stroke="white"
                  stroke-width="0.210526"
                />
                <path
                  d="M5.94732 6.1051L1.48141 10.571"
                  stroke="white"
                  stroke-width="0.210526"
                />
                <path
                  d="M5.94733 6.1051L1.48142 1.63916"
                  stroke="white"
                  stroke-width="0.210526"
                />
              </svg>
              Append
            </button>
            <button
              style={{ backgroundColor: "#DF4B41" }}
              onClick={async () => await handleDeleteClick()}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_500_29)">
                  <path
                    d="M9.49999 2.79163V9.79162C9.49999 10.436 8.97768 10.9583 8.33333 10.9583H3.66666C3.02233 10.9583 2.49999 10.436 2.49999 9.79162V2.79163M1.33333 2.79163H10.6667M7.74999 2.79163V2.20829C7.74999 1.56396 7.22768 1.04163 6.58333 1.04163H5.41666C4.77233 1.04163 4.24999 1.56396 4.24999 2.20829V2.79163"
                    stroke="white"
                    stroke-width="1.16667"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_500_29">
                    <rect width="12" height="12" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              Delete
            </button>
          </div>
        </div>
      </div>
    </a.div>
  );
}
