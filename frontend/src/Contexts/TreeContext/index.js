import { createContext, useContext, useEffect, useState } from "react";
import { treesPull } from "../Services";

const treesContext = createContext();

export function useTrees() {
  return useContext(treesContext);
}

export function TreesProvider({ children }) {
  const [resTrees, setResTrees] = useState();
  const [trees, setTrees] = useState([]);

  function depth_first_search(curNode, nodesArr, linksArr) {
    const { children, ...withoutChildrenCurNode } = curNode;
    // withoutChildrenCurNode.x = 0;
    // withoutChildrenCurNode.y = 0;
    withoutChildrenCurNode.fx = null;
    withoutChildrenCurNode.fy = null;
    nodesArr.push(withoutChildrenCurNode);
    for (let childInd in curNode.children) {
      const child = curNode.children[childInd];
      linksArr.push({
        source: curNode._id,
        target: child._id,
      });
      depth_first_search(child, nodesArr, linksArr);
    }
  }

  async function getTrees() {
    setResTrees(await treesPull());
  }

  useEffect(() => {
    getTrees();
  }, []);
  useEffect(() => {
    let copyTrees = [];
    for (let treeInd in resTrees) {
      const tree = resTrees[treeInd];
      // console.log("Working with tree: ");
      // console.log(tree);
      const nodes = [],
        links = [];
      depth_first_search(tree.tree, nodes, links);
      copyTrees.push({
        treeId: tree.treeId,
        nodes: nodes,
        links: links,
      });
    }
    setTrees(copyTrees);
  }, [resTrees]);
  // useEffect(() => {
  //   console.log("the whole updated trees: ");
  //   trees.forEach((tree) => {
  //     console.log(tree);
  //   });
  // }, [trees]);

  const payload = {
    trees: trees,
  };

  return (
    <treesContext.Provider value={payload}>{children}</treesContext.Provider>
  );
}
