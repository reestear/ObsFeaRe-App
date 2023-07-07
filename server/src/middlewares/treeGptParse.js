const Tree = require("../models/Tree");
const Node = require("../models/Node");
let userId;

async function parseNodeDFS(node, depth) {
  if (node.children.length == 0) {
    await Node.create({
      nodeTitle: node.title,
      userId: userId,
      children: [],
      done: false,
      isRoot: depth === 0 ? true : false,
      isLeaf: true,
    });
    const lastNodeId = (await Node.findOne({}, {}, { sort: { createdAt: -1 } }))
      ._id;
    return lastNodeId;
  } else {
    let children = [];
    for (let childInd in node.children) {
      const child = node.children[childInd];
      const childId = await parseNodeDFS(child, depth + 1);
      children.push(childId);
    }
    await Node.create({
      nodeTitle: node.title,
      userId: userId,
      children: children,
      done: false,
      isRoot: depth === 0 ? true : false,
      isLeaf: false,
    });

    const lastNodeId = (await Node.findOne({}, {}, { sort: { createdAt: -1 } }))
      ._id;
    return lastNodeId;
  }
}

async function parseTree(treeJson, userid) {
  userId = userid;
  const rootNodeId = await parseNodeDFS(treeJson, 0);
  await Tree.create({
    nodeId: rootNodeId,
    userId: userId,
    done: false,
  });

  const lastTreeId = (await Tree.findOne({}, {}, { sort: { createdAt: -1 } }))
    ._id;
  return lastTreeId;
}

module.exports = { parseTree };
