const express = require("express");
const { getUser } = require("../middlewares/authMiddleware");
const { Configuration, OpenAIApi } = require("openai");
const { parseTree } = require("../middlewares/treeGptParse");
require("dotenv").config();

const router = express.Router();

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_GPT_KEY,
  })
);

const content = `I have a Goal of becoming professional F1 racer.

Now, I want to visualize my Goal in view of tree, where my root is the my Goal.
Therefore, dividing my Goal into sub roots where each sub root represents generalized aspect which should be done in order to complete the main Goal. This process of dividing root and each sub root should continue until reaching the moment when all of the leaves (the nodes which don't have any children) have a capacity to be done in within a week.

Give me the result in view of object where it has its "title" (the title of the nodes including root, sub root, and leaves) and "children" array which also consists of the same objects (nodes)

Wrap the json file which includes tree structure between keywords: !START! and !END!

Divide the tree very very detailed, remembering that my leaves should be reachable with a week.`;
// generating new tree
router.post("/gpt/new", getUser, async (req, res) => {
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: content }],
    });

    const treeJson = JSON.parse(
      extractTreeJson(
        response.data.choices[0].message.content,
        "!START!",
        "!END!"
      )
    );

    const treeId = await parseTree(treeJson, req.userId);

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
