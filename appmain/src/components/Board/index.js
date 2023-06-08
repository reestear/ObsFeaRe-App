import React, { useContext } from "react";
import "./styles.css";
import BoardTodo from "../BoardTodo";
import { useTheme } from "../../Contexts/ThemeContext";
import colorsDark from "./colorsDark.json";
import colorsLight from "./colorsLight.json";
import { useBoard } from "../../Contexts/DataContext";
import { dragContext } from "../WorkPage";

export default function Board({ boardTitle, boardId }) {
  const boards = useBoard();
  // console.log("THHESEF");
  // console.log(boards[boardId].boardTodos);
  // const data = useData();
  // const { todos } = data;
  const darkTheme = useTheme();
  const colors = darkTheme ? colorsDark : colorsLight;

  const { dragOverHandler, dropCardHandler } = useContext(dragContext);

  return (
    <div
      className="Board"
      style={{
        color: darkTheme ? "white" : "black",
        backgroundColor: colors[boardId].boardColor,
      }}
      onDragOver={(e) => dragOverHandler(e)}
      onDrop={(e) =>
        boards[boardId].boardTodos.length === 0 && dropCardHandler(e, boardId)
      }
    >
      <div
        className="BoardTitle"
        style={{
          backgroundColor: colors[boardId].titleColor,
        }}
      >
        {boardTitle}
      </div>
      <div className="BoardTodos">
        {boards[boardId].boardTodos
          .slice()
          .sort((a, b) => a.order - b.order)
          .map(
            (todo) =>
              todo.boardId === boardId && (
                <BoardTodo boardId={boardId} todo={todo}></BoardTodo>
              )
          )}
        {/* <BoardTodo boardId={boardId} todo={todo}></BoardTodo> */}
      </div>
    </div>
  );
}
