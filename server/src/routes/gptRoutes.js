const express = require("express");
const { getUser } = require("../middlewares/authMiddleware");
const { Configuration, OpenAIApi } = require("openai");
const { parseTree } = require("../middlewares/treeGptParse");
const { parseChatDialog } = require("../middlewares/chatHistoryMiddleware");
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
    
    Give me the result in view of object i.e node, where it has its "title" (the title of the nodes including root, sub root, and leaves) and "children" array which also consists of the same objects i.e nodes which also have their own titles and possibly children array.
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
    Also, remember that "children" should be an array!!!

    Wrap the json file which includes tree structure between keywords: !START! and !END!
    
   Divide the tree into subnodes very, very detailed, remembering that my leaves should be reachable within a week.
  
  And, finally give your overall feedback or advice in 1 sentence to this goal, also wrapping it inside of keywords !RESPONSE START! and !RESPONSE END!`;

  return content;
}

// generating new tree
router.post("/gpt/new", getUser, async (req, res) => {
  try {
    const { request } = req.body;
    console.log("working with request: " + request);
    const content = generateContent(request);

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo-16k",
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

module.exports = router;

function extractTreeJson(str, startWord, endWord) {
  const startIndex = str.indexOf(startWord);
  if (startIndex === -1) {
    // Start word not found
    return "";
  }

  const endIndex = str.indexOf(endWord, startIndex + startWord.length);
  if (endIndex === -1) {
    // End word not found
    return "";
  }

  return str.substring(startIndex + startWord.length, endIndex).trim();
}
