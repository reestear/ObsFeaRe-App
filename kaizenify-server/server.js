const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("./Schemas/User");
const Task = require("./Schemas/Task");
const ToDo = require("./Schemas/ToDo");
require("dotenv").config();

const app = express();
app.use(express.json(), cors());
mongoose.connect("mongodb://localhost/kaizenify");

// middleware to register
async function preRegister(req, res, next) {
  //   console.log("req.body: ");
  //   console.log(req.body);
  const { password, email } = req.body.user;
  //   console.log(password, email);

  if (await User.exists({ email: email }))
    return res.status(409).json({ message: "User alredy exists" });
  try {
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);
    req.hashedPassword = hashedPassword;
    next();
  } catch (err) {
    res.sendStatus(500);
    console.log(err.message);
  }
}
// middlware for user authentication

// registering the an user
app.post("/register", preRegister, async (req, res) => {
  const { username, email, password } = req.body.user;
  try {
    const user = await new User({
      username: username,
      email: email,
      password: req.hashedPassword,
    });
    await user.save();
    const userId = user._id;
    // console.log("registiring with userId = " + userId);
    const actoken = await jwt.sign({ userId: userId }, process.env.KEY);
    // console.log(actoken);

    res
      .status(201)
      .json({ actoken: actoken, message: "Successful Registration" });
  } catch (err) {
    res.sendStatus(500);
    console.log(err.message);
  }
});
// loggin in with
app.get("/login/:email/:password", async (req, res) => {
  try {
    // console.log("printing req.body.user:");
    // console.log(req.body.user);
    const { email, password } = req.params;
    // console.log(email + " and " + password);

    // const ret = await User.findOne({ email: email });
    // console.log("ret: \n" + ret);

    if (!(await User.findOne({ email: email })))
      return res.status(401).json({ message: "Account doesn't exist" });

    const user = await User.findOne({ email: email });
    const hashedPassword = user.password;

    if (await bcrypt.compare(password, hashedPassword)) {
      const actoken = await jwt.sign({ userId: user._id }, process.env.KEY);
      //   console.log("user._id in the logging in: " + user._id);
      //   console.log("generated actoken: " + actoken);
      res.status(200).json({ actoken: actoken, message: "Succesful LogIn" });
    } else return res.status(403).json({ message: "Incorrect Password" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Something Went Wrong in the Server" });
  }
});

//middleawre to get the userId

async function getUser(req, res, next) {
  try {
    const actoken = await req.headers.authorization.split(" ")[1];
    const userId = await jwt.verify(actoken, process.env.KEY).userId;
    // console.log("userId from middleware = " + userId);
    req.userId = userId;
    next();
  } catch (err) {
    res.status(401).json({ message: "Couldn't Authorize" });
    console.log(err.meassage);
  }
}

// get all tasks

app.get("/tasks", getUser, async (req, res) => {
  try {
    const userId = req.userId;
    // console.log("userId = ");
    // console.log(userId);
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      // Handle invalid userId here
      return res.status(400).json({ message: "Invalid userId" });
    }

    const tasks = await Task.find({ userId: userId });
    // console.log("all tasks: ");
    // console.log(tasks);
    res.status(200).json({ tasks: tasks, message: "All tasks were retrieved" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something Went Wrong in the Server" });
  }
});

// get all todos

app.get("/todos", getUser, async (req, res) => {
  try {
    const userId = req.userId;
    const todos = await ToDo.find({ userId: userId }).populate("taskId");
    res
      .status(200)
      .json({ todos: todos, meassage: "All todos were retrieved" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something Went Wrong in the Server" });
  }
});

// update the task

app.post("/tasks/:taskId/:taskTitle", getUser, async (req, res) => {
  try {
    let { taskId, taskTitle } = req.params;
    const { todos } = req.body;
    const userId = req.userId;

    if (taskId == "-1") {
      await Task.create({
        taskTitle: taskTitle,
        userId: userId,
      });

      //   console.log("created new Task");

      taskId = (await Task.findOne({}, {}, { sort: { createdAt: -1 } }))._id;
      //   console.log("the new created taskId = " + taskId);
    }

    const task = await Task.findOne({ _id: taskId });
    task.taskTitle = taskTitle;
    await task.save();

    await ToDo.deleteMany({ taskId: taskId, userId: userId });
    // console.log("the new todos: ");
    // console.log(todos);

    // console.log("all the delTodos by provided taskId");
    // console.log(delTodos);

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

// rechecking todo

app.post("/todos/:todoId", getUser, async (req, res) => {
  try {
    const { todoId } = req.params;
    const todo = await ToDo.findOne({ _id: todoId, userId: req.userId });

    todo.boardId = todo.done ? 0 : 3;
    todo.done = !todo.done;

    await todo.save();
    res.json({ message: "Successfully Toggled the ToDo" });
  } catch (err) {
    console.log(err);
    res.status(501).json({ message: "Something Went Wrong in the Server" });
  }
});

// deleging the task

app.delete("/tasks/:taskId", getUser, async (req, res) => {
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

app.post("/boardsUpdate", getUser, async (req, res) => {
  try {
    const { mergedTodos } = req.body;
    console.log(mergedTodos);

    await mergedTodos.forEach(async (item) => {
      const todo = await ToDo.findById(item._id);
      todo.order = item.order;
      todo.boardId = item.boardId;
      todo.done = item.done;
      await todo.save();
    });

    res.json({ message: "Successfully updated Boards" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something Went Wrong in the Server" });
  }
});

app.listen(process.env.PORT, () => console.log("server is listening"));
