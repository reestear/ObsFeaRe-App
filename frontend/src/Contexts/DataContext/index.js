import { createContext, useContext, useEffect, useState } from "react";
import {
  dataDeleteTask,
  dataGetTasks,
  dataGetTodos,
  dataSendUpdatedTask,
  dataUpdateBoards,
} from "../Services";

const dataContext = createContext();

export function useData() {
  return useContext(dataContext);
}

export function DataProvider({ children }) {
  const [data, setData] = useState({
    todos: [],
    tasks: [],
  });
  const [boards, setBoards] = useState([
    {
      boardId: 0,
      boardTitle: "Week",
      boardTodos: [],
    },
    {
      boardId: 1,
      boardTitle: "To Do",
      boardTodos: [],
    },
    {
      boardId: 2,
      boardTitle: "In Progress",
      boardTodos: [],
    },
    {
      boardId: 3,
      boardTitle: "Done",
      boardTodos: [],
    },
  ]);

  function frontUpdateData(todoId) {
    console.log("inside upd");
    const { todos, tasks } = data;
    console.log(todos);

    const newTodos = todos.map((todo) => {
      if (todo._id !== todoId) return todo;
      else {
        const copyTodo = { ...todo };
        copyTodo.done = !copyTodo.done;

        if (copyTodo.boardId === 3) copyTodo.boardId = 0;
        else copyTodo.boardId = 3;

        return copyTodo;
      }
    });
    // console.log("newTodos: ");
    // console.log(newTodos);

    setData({
      todos: newTodos,
      tasks: tasks,
    });
  }

  async function updateData() {
    const todos = await dataGetTodos();
    const tasks = await dataGetTasks();

    await setData({
      todos: todos,
      tasks: tasks,
    });
  }

  async function sendUpdatedTask(prevTask, modalTodos) {
    const { _id, taskTitle } = prevTask;
    console.log("inside of sendUpdatedTask");
    console.log(_id + " " + taskTitle);
    if (_id === null || taskTitle === null || (await taskTitle.trim()) === "")
      return false;

    modalTodos.filter((todo) => todo.todoTitle && todo.todoTitle.trim() !== "");

    await dataSendUpdatedTask(prevTask, modalTodos);

    await updateData();
    await updateBoards();
  }

  async function deleteTask(taskId) {
    await dataDeleteTask(taskId);
    await updateData();
    await updateBoards();
  }

  async function dragUpdateBoards(merdegTodos) {
    await dataUpdateBoards(merdegTodos);
    await updateData();
    await updateBoards();
  }

  useEffect(() => {
    console.log("inside useEffBoard");
    const { todos, tasks } = data;
    console.log(todos);

    const weekTodos = todos.filter((todo) => todo.boardId === 0);
    const activeTodos = todos.filter((todo) => todo.boardId === 1);
    const progressTodos = todos.filter((todo) => todo.boardId === 2);
    const doneTodos = todos.filter((todo) => todo.boardId === 3);

    setBoards([
      {
        boardId: 0,
        boardTitle: "Week",
        boardTodos: weekTodos.sort((a, b) => a.order - b.order),
      },
      {
        boardId: 1,
        boardTitle: "To Do",
        boardTodos: activeTodos.sort((a, b) => a.order - b.order),
      },
      {
        boardId: 2,
        boardTitle: "In Progress",
        boardTodos: progressTodos.sort((a, b) => a.order - b.order),
      },
      {
        boardId: 3,
        boardTitle: "Done",
        boardTodos: doneTodos.sort((a, b) => a.order - b.order),
      },
    ]);
  }, [data]);

  function frontUpdateBoards(mergedTodos) {
    const { todos, tasks } = data;
    const newTodos = [...todos];

    newTodos.forEach((newTodo) => {
      const foundTodo = mergedTodos.find((todo) => todo._id === newTodo._id);
      if (foundTodo) {
        newTodo.boardId = foundTodo.boardId;
        newTodo.order = foundTodo.order;
        newTodo.done = foundTodo.done;
      }
    });
    console.log("newTodos");
    console.log(newTodos);

    setData({
      todos: newTodos,
      tasks: tasks,
    });
    dataUpdateBoards(mergedTodos);
  }

  async function updateBoards() {
    const todos = await dataGetTodos();
    const tasks = await dataGetTasks();

    const weekTodos = todos.filter((todo) => todo.boardId === 0);
    const activeTodos = todos.filter((todo) => todo.boardId === 1);
    const progressTodos = todos.filter((todo) => todo.boardId === 2);
    const doneTodos = todos.filter((todo) => todo.boardId === 3);

    setBoards([
      {
        boardId: 0,
        boardTitle: "Week",
        boardTodos: weekTodos.sort((a, b) => a.order - b.order),
      },
      {
        boardId: 1,
        boardTitle: "To Do",
        boardTodos: activeTodos.sort((a, b) => a.order - b.order),
      },
      {
        boardId: 2,
        boardTitle: "In Progress",
        boardTodos: progressTodos.sort((a, b) => a.order - b.order),
      },
      {
        boardId: 3,
        boardTitle: "Done",
        boardTodos: doneTodos.sort((a, b) => a.order - b.order),
      },
    ]);
  }

  useEffect(() => {
    updateData();
    updateBoards();
  }, []);

  const payload = {
    data: data,
    boards: boards,
    updateBoards: updateBoards,
    updateData: updateData,
    sendUpdatedTask: sendUpdatedTask,
    deleteTask: deleteTask,
    dragUpdateBoards: dragUpdateBoards,
    frontUpdateData: frontUpdateData,
    frontUpdateBoards: frontUpdateBoards,
  };

  return (
    <dataContext.Provider value={payload}>{children}</dataContext.Provider>
  );
}
