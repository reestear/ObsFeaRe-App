const express = require("express");
const mongoose = require("mongoose");
const Tree = require("../models/Tree");
const Node = require("../models/Node");
const { getUser } = require("../middlewares/authMiddleware");

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

module.exports = router;
