import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { useData } from "../../../../../../Contexts/DataContext";
import { dragContext } from "../../WorkPage";
import BoardTodo from "./BoardTodo";
import colorsDark from "./colorsDark.json";
import colorsLight from "./colorsLight.json";
import "./styles.css";

export default React.memo(function Board({ boardTitle, boardId }) {
  const contextPayload = useData();
  const { boards } = contextPayload;
  const darkTheme = useSelector((state) => state.darkTheme);
  const colors = darkTheme ? colorsDark : colorsLight;

  // console.log("board rerendering");

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
          className="BoardEmptyField"
          style={{ height: "100%", width: "100%" }}
          onDragOver={(e) => dragOverHandler(e)}
          onDrop={(e) => dropCardHandler(e, boardId)}
        ></div>
      </div>
    </div>
  );
});
