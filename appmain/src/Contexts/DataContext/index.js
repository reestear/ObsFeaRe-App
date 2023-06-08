import { createContext, useContext, useEffect, useState } from "react";
import {
  dataDeleteTask,
  dataGetTasks,
  dataGetTodos,
  dataSendUpdatedTask,
  dataUpdateBoards,
} from "../Services";

const dataContext = createContext();
const dataUpdateContext = createContext();
const sendUpdatedTaskContext = createContext();
const deleteTaskContext = createContext();
const boardContext = createContext();
const dragUpdateBoardsContext = createContext();
const boardsUpdateContext = createContext();

export function useData() {
  return useContext(dataContext);
}
export function useUpdateData() {
  return useContext(dataUpdateContext);
}
export function useSendUpdatedTask() {
  return useContext(sendUpdatedTaskContext);
}
export function useDeleteTask() {
  return useContext(deleteTaskContext);
}
export function useBoard() {
  return useContext(boardContext);
}
export function useDragUpdateBoards() {
  return useContext(dragUpdateBoardsContext);
}
export function useBoardsUpdate() {
  return useContext(boardsUpdateContext);
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

  async function updateData() {
    const todos = await dataGetTodos();
    const tasks = await dataGetTasks();

    // console.log("someoefsefsef");
    // console.log(weekTodos, activeTodos, progressTodos, doneTodos);

    setData({
      todos: todos,
      tasks: tasks,
    });
    // console.log("lskdjflsjdlfwlef");
    // console.log(boards);
  }

  // useEffect(() => {
  //   const { todos, tasks } = data;
  //   const weekTodos = todos.filter((todo) => todo.boardId === 0);
  //   const activeTodos = todos.filter((todo) => todo.boardId === 1);
  //   const progressTodos = todos.filter((todo) => todo.boardId === 2);
  //   const doneTodos = todos.filter((todo) => todo.boardId === 3);

  //   setBoards([
  //     {
  //       boardId: 0,
  //       boardTitle: "Week",
  //       boardTodos: weekTodos,
  //     },
  //     {
  //       boardId: 1,
  //       boardTitle: "To Do",
  //       boardTodos: activeTodos,
  //     },
  //     {
  //       boardId: 2,
  //       boardTitle: "In Progress",
  //       boardTodos: progressTodos,
  //     },
  //     {
  //       boardId: 3,
  //       boardTitle: "Done",
  //       boardTodos: doneTodos,
  //     },
  //   ]);
  // }, [data]);

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
    // console.log("INSIDE OF USEEFFECT");
    // console.log(data.tasks);
  }, []);

  return (
    <dataContext.Provider value={data}>
      <boardContext.Provider value={boards}>
        <boardsUpdateContext.Provider value={updateBoards}>
          <dataUpdateContext.Provider value={updateData}>
            <sendUpdatedTaskContext.Provider value={sendUpdatedTask}>
              <deleteTaskContext.Provider value={deleteTask}>
                <dragUpdateBoardsContext.Provider value={dragUpdateBoards}>
                  {children}
                </dragUpdateBoardsContext.Provider>
              </deleteTaskContext.Provider>
            </sendUpdatedTaskContext.Provider>
          </dataUpdateContext.Provider>
        </boardsUpdateContext.Provider>
      </boardContext.Provider>
    </dataContext.Provider>
  );
}
