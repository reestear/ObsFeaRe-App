const express = require("express");
const Tree = require("../models/Tree");
const Node = require("../models/Node");
const { getUser } = require("../middlewares/authMiddleware");
const { deleteTask } = require("../services/service_tasks");
const Task = require("../models/Task");

const router = express.Router();

// creating new Node
router.post("/new", getUser, async (req, res) => {
  try {
    const { parNodeId, curNode } = req.body;
    const userId = req.userId;
    await Node.create({
      nodeTitle: curNode.nodeTitle,
      userId: userId,
      children: [],
      isLeaf: true,
    });
    const curNodeId = (await Node.findOne({}, {}, { sort: { createdAt: -1 } }))
      ._id;
    const parNode = await Node.findById(parNodeId);
    parNode.children.push(curNodeId);
    // parNode.isRoot = false;
    parNode.done = false;
    parNode.isLeaf = false;
    await parNode.save();

    res.status(201).json({ message: "Successfully created new Node" });
  } catch (err) {
    console.log(err.message);
    res.status(501).json({ message: "Something Went Wrong in the Server" });
  }
});

async function deleteSubNode(curNodeId, userId) {
  const curNode = await Node.findById(curNodeId);
  if (!curNode) return;

  if (curNode.children.length == 0) {
    // leaf
    if (curNode.taskId) await deleteTask(curNode.taskId, userId);
    await Node.deleteOne({ _id: curNodeId });
    return;
  }
  for (let childInd in curNode.children) {
    const childId = curNode.children[childInd];
    deleteSubNode(childId, userId);
  }
  await Node.deleteOne({ _id: curNodeId });
}

// deleting the subNode
router.post("/delete", getUser, async (req, res) => {
  try {
    const { nodeId } = req.body;
    const userId = req.userId;
    // console.log(nodeId);

    await deleteSubNode(nodeId, userId);
    const tree = await Tree.findOne({ nodeId: nodeId });
    if (tree) await Tree.deleteOne({ _id: tree._id });

    res.status(201).json({
      message: "Successfully deleted",
    });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      message: "Something Went Wrong in the Server",
    });
  }
});

// set Focus to the Leaf node
router.post("/focus", getUser, async (req, res) => {
  try {
    const { nodeId } = req.body;
    const userId = req.userId;
    const node = await Node.findById(nodeId);

    await Task.create({
      taskTitle: node.nodeTitle,
      userId: userId,
      treeId: node.treeId,
      isNode: true,
      nodeId: nodeId,
    });
    const taskId = (await Task.findOne({}, {}, { sort: { createdAt: -1 } }))
      ._id;

    node.focus = true;
    node.taskId = taskId.toString();
    await node.save();
    res.status(201).json({
      message: "Successfully set Focus",
    });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      message: "Something Went Wrong in the Server",
    });
  }
});

module.exports = router;
