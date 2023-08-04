import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { useData } from "../../../../../../../Contexts/DataContext";
import { dragContext } from "../../../WorkPage";
import colorsDark from "../../Board/colorsDark.json";
import colorsLight from "../../Board/colorsLight.json";
import "./styles.css";

export default function BoardTodo({ boardId, todo }) {
  const {
    dragOverHandler,
    dragLeaveHandler,
    dragStartHandler,
    dragEndHandler,
    dropHandler,
  } = useContext(dragContext);
  // console.log((currentBoardId === null) + " and " + (currentToDoId === null));

  const { todoTitle, taskId } = todo;
  const { taskTitle } = taskId;
  const contextPayload = useData();
  const { updateBoards, updateData, frontUpdateData } = contextPayload;

  const darkTheme = useSelector((state) => state.darkTheme);
  const colors = darkTheme ? colorsDark : colorsLight;

  const handleOnClick = async () => {
    frontUpdateData(todo._id);

    // await updateData();
    // await updateBoards();
  };

  return (
    <div
      className="boardTodo"
      style={{ backgroundColor: colors[boardId].todoColor }}
      draggable={true}
      onDragOver={(e) => dragOverHandler(e)}
      onDragLeave={(e) => dragLeaveHandler(e)}
      onDragStart={(e) => dragStartHandler(e, boardId, todo._id)}
      onDragEnd={(e) => dragEndHandler(e)}
      onDrop={(e) => dropHandler(e, boardId, todo._id)}
    >
      <input
        checked={todo.done}
        type="checkbox"
        className="boardTodoCheck easeTransition"
        style={{ display: "transparent" }}
        onClick={handleOnClick}
      ></input>
      <div className="boardTodoInfo" draggable={false}>
        <p className="boardTodoInfoTodoTitle" draggable={false}>
          {todoTitle}
        </p>
        <p className="boardTodoInfoTaskTitle" draggable={false}>
          {taskTitle}
        </p>
      </div>
    </div>
  );
}
