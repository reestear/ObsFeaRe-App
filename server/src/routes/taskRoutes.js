const express = require("express");
const mongoose = require("mongoose");
const Task = require("../models/Task");
const ToDo = require("../models/ToDo");
const { getUser } = require("../middlewares/authMiddleware");

const router = express.Router();

// Get all tasks route
router.get("/", getUser, async (req, res) => {
  // Get all tasks logic
  try {
    const userId = req.userId;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      // Handle invalid userId here
      return res.status(400).json({ message: "Invalid userId" });
    }

    const tasks = await Task.find({ userId: userId });

    res.status(200).json({ tasks: tasks, message: "All tasks were retrieved" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something Went Wrong in the Server" });
  }
});

// Update task route
router.post("/:taskId/:taskTitle", getUser, async (req, res) => {
  // Update task logic
  try {
    let { taskId, taskTitle } = req.params;
    const { todos } = req.body;
    const userId = req.userId;

    if (taskId == "-1") {
      await Task.create({
        taskTitle: taskTitle,
        userId: userId,
      });

      taskId = (await Task.findOne({}, {}, { sort: { createdAt: -1 } }))._id;
    }

    const task = await Task.findOne({ _id: taskId });
    task.taskTitle = taskTitle;
    await task.save();

    await ToDo.deleteMany({ taskId: taskId, userId: userId });

    todos.forEach(async (todo) => {
      const { boardId, done, todoTitle, order } = todo;
      const repTodo = {
        todoTitle: todoTitle,
        boardId: boardId,
        done: done,
        userId: userId,
        taskId: taskId,
        order: order,
      };

      await ToDo.create(repTodo);
    });

    // console.log(await ToDo.find({ taskId: taskId, userId: userId }));

    res.json({ message: "Successfully Updated the Task" });
  } catch (err) {
    console.log(err);
    res.status(501).json({ message: "Something Went Wrong in the Server" });
  }
});

// Delete task route
router.delete("/:taskId", getUser, async (req, res) => {
  // Delete task logic
  try {
    const { taskId } = req.params;
    await ToDo.deleteMany({ userId: req.userId, taskId: taskId });
    await Task.deleteOne({ _id: taskId, userId: req.userId });

    res.json({ message: "Successfully deleted the Task" });
  } catch (err) {
    console.log(err);
    res.status(409).json({ message: "Couldn't delete the task" });
  }
});

module.exports = router;
