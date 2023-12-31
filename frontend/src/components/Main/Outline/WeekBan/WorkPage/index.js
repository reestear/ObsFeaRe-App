import React, { createContext, useCallback, useState } from "react";
import { useData } from "../../../../../Contexts/DataContext";
import { useUpdateModalTodos } from "../../../../../Contexts/OpenModalContext";
import Board from "./Board";
import "./styles.css";

export const dragContext = createContext();

export default function WorkPage() {
  const contextPayload = useData();
  const {
    boards,
    dragUpdateBoards,
    updateData,
    updateBoards,
    frontUpdateBoards,
  } = contextPayload;
  const updateModalTodos = useUpdateModalTodos();

  const [currentBoardId, setCurrentBoardId] = useState(null);
  const [currentToDoId, setCurrentToDoId] = useState(null);

  const findParentWithClassName = useCallback((element, className) => {
    while (element.className && element.className !== className)
      element = element.parentNode;
    return element;
  }, []);

  function dragOverHandler(e) {
    e.preventDefault();

    const parentDiv = findParentWithClassName(e.target, "boardTodo");
    if (parentDiv.className && parentDiv.className === "boardTodo")
      parentDiv.style.boxShadow = "0 3px 1px #1B79BE";
  }
  function dragLeaveHandler(e) {
    const parentDiv = findParentWithClassName(e.target, "boardTodo");
    parentDiv.style.boxShadow = "none";
  }
  function dragStartHandler(e, boardId, todoId) {
    setCurrentBoardId(boardId);
    setCurrentToDoId(todoId);
    e.target.style.opacity = "75%";
  }
  function dragEndHandler(e) {
    e.preventDefault();
    const parentDiv = findParentWithClassName(e.target, "boardTodo");
    parentDiv.style.boxShadow = "0 3px 1px none";

    e.target.style.opacity = "100%";
  }
  async function dropHandler(e, boardId, todoId) {
    e.preventDefault();

    const parentDiv = findParentWithClassName(e.target, "boardTodo");
    // console.log("dropping parentDiv: ");
    // console.log(parentDiv);
    parentDiv.style.boxShadow = "none";

    // console.log("before changes");
    // console.log(boards[currentBoardId].boardTodos);
    // console.log(boards[boardId].boardTodos);

    const currentIndex = boards[currentBoardId].boardTodos.findIndex(
      (todo) => todo._id === currentToDoId
    );
    const dropIndex = boards[boardId].boardTodos.findIndex(
      (todo) => todo._id === todoId
    );
    // console.log("dropIndex  = " + dropIndex);
    // console.log("currentIndex = " + currentIndex);

    let repCurBoard = boards[currentBoardId].boardTodos.filter(
      (_, index) => index !== currentIndex
    );
    // console.log("repCurBoard: ");
    // console.log(repCurBoard);

    let repBoard = [];
    if (currentBoardId !== boardId) {
      repBoard = [
        ...boards[boardId].boardTodos.slice(0, dropIndex + 1),
        boards[currentBoardId].boardTodos[currentIndex],
        ...boards[boardId].boardTodos.slice(dropIndex + 1),
      ];
    } else {
      let delBoard = repCurBoard;

      delBoard = [
        ...delBoard.slice(0, dropIndex),
        boards[boardId].boardTodos[currentIndex],
        ...delBoard.slice(dropIndex),
      ];

      if (currentIndex > dropIndex) {
        const temp = delBoard[dropIndex];
        delBoard[dropIndex] = delBoard[dropIndex + 1];
        delBoard[dropIndex + 1] = temp;
      }

      repBoard = delBoard;
    }

    if (currentBoardId !== boardId) {
      repBoard.forEach((todo, index) => {
        todo.boardId = boardId;
        todo.order = index;
        todo.done = boardId === 3;
      });
      repCurBoard.forEach((todo, index) => {
        todo.order = index;
        todo.done = currentBoardId === 3;
      });

      frontUpdateBoards([...repBoard, ...repCurBoard]);
    } else {
      repBoard.forEach((todo, index) => {
        todo.order = index;
      });

      frontUpdateBoards(repBoard);
    }
  }

  async function dropCardHandler(e, boardId) {
    console.log("NOOOOO");
    e.preventDefault();

    const currentIndex = boards[currentBoardId].boardTodos.findIndex(
      (todo) => todo._id === currentToDoId
    );

    let repCurBoard = boards[currentBoardId].boardTodos.filter(
      (_, index) => index !== currentIndex
    );
    repCurBoard.forEach((todo, index) => {
      todo.order = index;
      todo.done = currentBoardId === 3;
    });

    const repBoard = [
      ...boards[boardId].boardTodos,
      boards[currentBoardId].boardTodos[currentIndex],
    ];
    repBoard.forEach((todo, index) => {
      todo.boardId = boardId;
      todo.order = index;
      todo.done = boardId === 3;
    });

    frontUpdateBoards([...repBoard, ...repCurBoard]);
  }

  return (
    <dragContext.Provider
      value={{
        currentBoardId,
        currentToDoId,
        dragOverHandler,
        dragLeaveHandler,
        dragStartHandler,
        dragEndHandler,
        dropHandler,
        dropCardHandler,
      }}
    >
      <div className="WorkPage">
        {boards.map((board) => (
          <Board boardTitle={board.boardTitle} boardId={board.boardId}></Board>
        ))}
      </div>
    </dragContext.Provider>
  );
}
