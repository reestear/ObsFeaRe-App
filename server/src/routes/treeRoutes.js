const express = require("express");
const mongoose = require("mongoose");
const Tree = require("../models/Tree");
const Node = require("../models/Node");
const { getUser } = require("../middlewares/authMiddleware");

const router = express.Router();

async function populateTree(rootNode) {
  try {
    await rootNode.populate("children");

    for (const child in rootNode.children) {
      await populateTree(rootNode.children[child]);
    }

    return {
      error: false,
      rootNode: rootNode,
    };
  } catch (err) {
    console.log(err.message);
    return {
      error: true,
      message: "Something Went Wrong in the Server",
    };
  }
}

//getting all the trees
router.get("/", getUser, async (req, res) => {
  try {
    const userId = req.userId;
    const trees = await Tree.find({ userId: userId });

    // Map each tree to the corresponding promise of populating the tree
    const populatePromises = trees.map(async (tree) => {
      const treeNode = await Node.findById(tree.nodeId);
      const populatedRootNode = await populateTree(treeNode);
      if (populatedRootNode.error) {
        return res.status(401).json({
          status: 401,
          message: populatedRootNode.message,
        });
      } else {
        const payload = {
          treeId: tree._id,
          tree: populatedRootNode.rootNode,
        };
        return payload;
      }
    });

    // Wait for all promises to resolve
    const populatedTrees = await Promise.all(populatePromises);

    // Check if any promises were rejected
    const errorPayload = populatedTrees.find((result) => result.status === 401);
    if (errorPayload) {
      return res
        .status(errorPayload.status)
        .json({ message: errorPayload.message });
    }

    // console.log(populatedTrees);

    res.status(200).json({
      trees: populatedTrees,
      message: "Successfully Pulled All the Trees",
    });
  } catch (err) {
    console.log(err.message);
    res.status(501).json({ message: "Something Went Wrong in the Server" });
  }
});

// creating new Tree
router.post("/new", getUser, async (req, res) => {
  try {
    const { rootTitle } = req.body;
    const userId = req.userId;

    await Node.create({
      nodeTitle: rootTitle,
      userId: userId,
      children: [],
      isRoot: true,
      isLeaf: true,
    });

    const nodeId = (await Node.findOne({}, {}, { sort: { createdAt: -1 } }))
      ._id;

    await Tree.create({
      nodeId: nodeId,
      userId: userId,
    });
    res.json({ message: "Successfully Created new Tree" });
  } catch (err) {
    console.log(err.message);
    res.status(501).json({ message: "Something Went Wrong in the Server" });
  }
});

async function deleteTree(curNodeId) {
  const curNode = await Node.findById(curNodeId);

  if (curNode.children.length == 0) {
    // leaf
    await Node.deleteOne({ _id: curNodeId });
    return;
  }
  for (let childInd in curNode.children) {
    const childId = curNode.children[childInd];
    deleteTree();
  }
}

// deleting the tree
router.delete("/delete/:treeId", getUser, async (req, res) => {
  try {
    const { treeId } = req.header;
    const userId = req.userId;
  } catch (err) {
    console.log(err.message);
    res.status(201).json({
      message: "Something Went Wrong in the Server",
    });
  }
});

module.exports = router;
