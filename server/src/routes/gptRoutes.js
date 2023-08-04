const express = require("express");
const { getUser } = require("../middlewares/authMiddleware");
const { Configuration, OpenAIApi } = require("openai");
const { parseTree } = require("../services/service_tree_gpt_parse");
const { parseChatDialog } = require("../services/service_chatHistory");
const { extractTreeJson } = require("../services/service_extract_tree_json");
const { get_populated_node } = require("../services/service_get_children_node");
const { filterNodeFields } = require("../services/service_filter_node");
const {
  parseAppendNode,
} = require("../services/service_append_tree_gpt_parse");
const {
  check_tree_for_done,
} = require("../services/service_check_tree_for_done");
const Node = require("../models/Node");
const Tree = require("../models/Tree");
require("dotenv").config();

const router = express.Router();

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_GPT_KEY,
  })
);

function generateContent(request) {
  const content = `I have a description of my goal as: ${request}
  Summarize the goal as Goal and follow below commands:
  
    Now, I want to visualize my Goal in view of tree, where my root is the my Goal.
    Therefore, dividing my Goal into different subroots where each subroot represents generalized aspect which should be accomplished in order to complete the main Goal. This process of dividing root and each subroot should continue until reaching the moment when all of the leaves (the nodes which don't have any children) have a capacity to be done in within a week.
    
    Give me the result in view of object i.e node, where it has its "title" (the title of the nodes including root, sub root, and leaves) and "children" array which also consists of the same objects i.e nodes which also have their own titles and possibly empty children array if they are leaves.
    Also, generate at least 45+ nodes including the root, subroots, and leaves.

    For example, the structure should be similar to this:
    {
      "title": "Some node title",
      "children": [
        {
          "title": String = "Some children node title",
          "children": Array = [other nodes...]
        }
      ]
    }
    Also, remember that "children" should be an array and that root shouldn't have any leaves!

    Wrap the json file which includes tree structure between keywords: !START! and !END!
    
   Divide the tree into subnodes very, very detailed, remembering that my leaves should be reachable within a week.
  
  And, finally give your overall feedback or advice in 1 sentence to this goal, also wrapping it inside of keywords !RESPONSE START! and !RESPONSE END!`;

  return content;
}

// generating new tree
router.post("/gpt/new", getUser, async (req, res) => {
  try {
    const { request } = req.body;
    // console.log("working with request: " + request);
    const content = generateContent(request);

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: content }],
    });

    const responseMessage = extractTreeJson(
      response.data.choices[0].message.content,
      "!RESPONSE START!",
      "!RESPONSE END!"
    );

    const treeJson = JSON.parse(
      extractTreeJson(
        response.data.choices[0].message.content,
        "!START!",
        "!END!"
      )
    );

    const treeId = await parseTree(treeJson, req.userId);
    await parseChatDialog(request, responseMessage, req.userId);

    res.status(200).json({
      treeId: treeId,
      message: "Successfully Prompted",
    });
  } catch (err) {
    console.log(err.message);
    res.status(501).json({ message: "Something Went Wrong in the Server" });
  }
});

function generateAppendContext(appendingNodeTitle, prohibitedNodes) {
  const content = `I have a description of my goal as: ${appendingNodeTitle}
  Summarize the goal as Goal and follow below commands:
  
    Now, I want to visualize my Goal in view of tree, where my root is the my Goal.
    Therefore, dividing my Goal into different subroots where each subroot represents generalized aspect which should be accomplished in order to complete the main Goal. This process of dividing root and each subroot should continue until reaching the moment when all of the leaves (the nodes which don't have any children) have a capacity to be done in within a week.

Remember that there are prohibited nodes that you shouldn't include in the tree:
These nodes are: ${prohibitedNodes}. 
So, generate me tree NOT including these nodes.
    
    Give me the result in view of object i.e node, where it has its "title" (the title of the nodes including root, sub root, and leaves) and "children" array which also consists of the same objects i.e nodes which also have their own titles and possibly empty children array if they are leaves.

    Also, remember that "children" should be an array and that root shouldn't have any leaves!

    Wrap the json file which includes tree structure between keywords: !START! and !END!
    
   Divide the tree into subnodes very, very detailed, remembering that my leaves should be reachable within a week remembering about the prohibited nodes that you shouldn't process.
  
  And, finally give your overall feedback or advice in 1 sentence to this goal, also wrapping it inside of keywords !RESPONSE START! and !RESPONSE END!

And remember, no comments are allowed inside your JSON.`;

  return content;
}

router.post("/gpt/append/:treeId/:nodeId", getUser, async (req, res) => {
  try {
    const userId = req.userId;
    const { treeId, nodeId } = req.params;
    const node = await get_populated_node(nodeId);

    const rootNodeId = (await Tree.findById(treeId)).nodeId;
    const rootNode = await Node.findById(rootNodeId);
    const treeTitle = rootNode.nodeTitle;

    const filteredNode = filterNodeFields(node, [
      "userId",
      "treeId",
      "taskId",
      "done",
      "focus",
      "isRoot",
      "isLeaf",
      "createdAt",
      "__v",
    ]);
    const appendingNodeTitle = filteredNode.nodeTitle;
    const prohibitedNodes = [];
    for (const node of filteredNode.children) {
      prohibitedNodes.push(node.nodeTitle);
    }

    const content = generateAppendContext(appendingNodeTitle, prohibitedNodes);
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: content }],
    });

    const responseMessage = extractTreeJson(
      response.data.choices[0].message.content,
      "!RESPONSE START!",
      "!RESPONSE END!"
    );

    const nodeJson = JSON.parse(
      extractTreeJson(
        response.data.choices[0].message.content,
        "!START!",
        "!END!"
      )
    );
    await parseAppendNode(nodeJson, userId, treeId, nodeId);

    const request = `Appending the node: ${node.nodeTitle} of tree: ${treeTitle}`;
    await parseChatDialog(request, responseMessage, userId);
    await check_tree_for_done(treeId);

    res.status(201).json({ message: "Successfully Appended" });
  } catch (err) {
    console.log(err);
    res.status(501).json({ message: "Something Went Wrong in the Server" });
  }
});

module.exports = router;
