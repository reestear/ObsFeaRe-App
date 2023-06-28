import { animated as a, useSpring } from "@react-spring/web";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDeleteTask } from "../../../../../Contexts/DataContext";
import {
  useChangeTaskTitle,
  useModal,
  useModalSendTask,
  useModalTodos,
  useModalUpdate,
  usePrevTask,
  useUpdatePrevTask,
} from "../../../../../Contexts/OpenModalContext";
import TaskModalNewTodo from "./TaskModalNewTodo";
import TaskModalTodo from "./TaskModalTodo.js";
import "./styles.css";

export default function TaskModal() {
  const darkTheme = useSelector((state) => state.darkTheme);
  const openModal = useModal();
  const modalTodos = useModalTodos();
  const prevTask = usePrevTask();
  const changeTaskTitle = useChangeTaskTitle();
  const togglePrevTask = useUpdatePrevTask();
  const toggleModal = useModalUpdate();
  const modalSendTask = useModalSendTask();
  const deleteTask = useDeleteTask();

  let firstTime = 1;
  const animatedProps = useSpring({
    from: {
      marginRight: openModal ? "-450px" : firstTime-- === 1 ? "-450px" : "0px",
    },
    marginRight: openModal ? "0" : "-450px",
    config: { mass: 1, tension: 100, friction: 20 },
  });

  useEffect(() => {
    document.addEventListener("mousedown", (e) => {
      console.log("clicked");
      const classes = [
        "btn-TaskItem",
        "btn-NewTask",
        "boardTodo",
        "header",
        "footer",
        "btn-openTasks",
        "TaskModal",
      ];
      if (
        openModal &&
        !classes.some((className) => e.target.closest(`.${className}`))
      )
        toggleModal();
    });
  }, [toggleModal]);

  return (
    <a.div
      className="TaskModal easeTransition"
      style={{
        backgroundColor: darkTheme ? "#2C2C2C" : "#888888",
        ...animatedProps,
      }}
    >
      <div className="TaskModalTitle">
        <input
          value={prevTask ? prevTask.taskTitle : ""}
          placeholder="Insert Your Task"
          onChange={(e) => changeTaskTitle(e.target.value)}
        ></input>
      </div>
      <div className="linebreak"></div>
      <div className="TaskModalTodos">
        {modalTodos.map((todo) => (
          <TaskModalTodo todo={todo}></TaskModalTodo>
        ))}
        {/* <TaskModalTodo></TaskModalTodo>
        <TaskModalTodo></TaskModalTodo> */}
        <TaskModalNewTodo></TaskModalNewTodo>
      </div>
      <div className="SaveAndCancel">
        <button
          className="btn-save"
          onClick={async () => {
            await modalSendTask();
            const _id = null,
              taskTitle = "";
            // firstTime++;
            togglePrevTask({ _id, taskTitle });
            toggleModal();
          }}
        >
          Save
        </button>
        <button
          className="btn-cancel"
          onClick={() => {
            const _id = null,
              taskTitle = "";
            // firstTime++;
            togglePrevTask({ _id, taskTitle });
            toggleModal();
          }}
        >
          Cancel
        </button>
        {prevTask && prevTask._id !== -1 && (
          <button
            className="btn-delete"
            onClick={async () => {
              // await modalSendTask();
              await deleteTask(prevTask._id);
              const _id = null,
                taskTitle = "";
              // firstTime++;
              togglePrevTask({ _id, taskTitle });
              toggleModal();
            }}
          >
            Delete
          </button>
        )}
      </div>
    </a.div>
  );
}
