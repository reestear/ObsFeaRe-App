import { animated as a, useSpring } from "@react-spring/web";
import React from "react";
import TreeItem from "./TreeItem";
import "./styles.css";

function TreeInfo({ openTreeInfo, activeTree }) {
  activeTree && console.log("Updated activeTree.treeId: " + activeTree.treeId);
  const animatedProps = useSpring({
    from: {
      right: openTreeInfo.prev ? "1%" : "-35%",
    },
    right: openTreeInfo.cur ? "1%" : "-35%",
    config: { mass: 1, tension: 100, friction: 20 },
  });

  return (
    <a.div style={{ ...animatedProps }} className="TreeInfo">
      <div className="RootHolder">
        <p>{activeTree && activeTree.tree.nodeTitle}</p>
      </div>
      <div className="TreeStructure">
        {activeTree && (
          <ul
            style={{ margin: "0px", paddingLeft: "0px" }}
            className="TreeItemChildren"
          >
            {activeTree.tree.children.map((node) => (
              <TreeItem node={node} depth={0}></TreeItem>
            ))}
          </ul>
        )}
      </div>
    </a.div>
  );
}

export default React.memo(TreeInfo);
