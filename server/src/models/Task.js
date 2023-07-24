const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  taskTitle: {
    type: String,
    required: true,
    default: "",
  },
  userId: {
    type: String,
    ref: "User",
    required: true,
  },
  todos: [
    {
      type: String,
      ref: "ToDo",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isNode: {
    type: Boolean,
    required: true,
    default: false,
  },
  nodeId: {
    type: String,
    // required: true,
    default: null,
  },
});

module.exports = mongoose.model("Task", taskSchema);
