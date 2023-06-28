import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { useBoard } from "../../Contexts/DataContext";
import BoardTodo from "../BoardTodo";
import { dragContext } from "../WorkPage";
import colorsDark from "./colorsDark.json";
import colorsLight from "./colorsLight.json";
import "./styles.css";

export default function Board({ boardTitle, boardId }) {
  const boards = useBoard();
  const darkTheme = useSelector((state) => state.darkTheme);
  const colors = darkTheme ? colorsDark : colorsLight;

  const { dragOverHandler, dropCardHandler } = useContext(dragContext);

  return (
    <div
      className="Board easeTransition"
      style={{
        color: darkTheme ? "white" : "black",
        backgroundColor: colors[boardId].boardColor,
      }}
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
        <div
          style={{ height: "350px", width: "310px" }}
          onDragOver={(e) => dragOverHandler(e)}
          onDrop={(e) => dropCardHandler(e, boardId)}
        ></div>
      </div>
    </div>
  );
}
