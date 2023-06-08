import React from "react";
import "./styles.css";
import TaskModalTodo from "../TaskModalTodo.js";
import TaskModalNewTodo from "../TaskModalNewTodo";
import { useTheme } from "../../Contexts/ThemeContext";
import { useSpring, animated as a } from "@react-spring/web";
import {
  useChangeTaskTitle,
  useModal,
  useModalTodos,
  useModalUpdate,
  usePrevTask,
  useUpdatePrevTask,
  useModalSendTask,
} from "../../Contexts/OpenModalContext";
import { useDeleteTask } from "../../Contexts/DataContext";

export default function TaskModal() {
  const darkTheme = useTheme();
  const openModal = useModal();
  const modalTodos = useModalTodos();
  const prevTask = usePrevTask();
  const changeTaskTitle = useChangeTaskTitle();
  const togglePrevTask = useUpdatePrevTask();
  const toggleModal = useModalUpdate();
  const modalSendTask = useModalSendTask();
  const deleteTask = useDeleteTask();

  // console.log("prevTask._id = " + prevTask._id);
  // console.log("prevTask:");
  // console.log(prevTask);
  // console.log("modalTodos are:");
  // console.log(modalTodos);

  let firstTime = 1;
  const animatedProps = useSpring({
    from: {
      marginRight: openModal ? "-450px" : firstTime-- === 1 ? "-450px" : "0px",
    },
    marginRight: openModal ? "0" : "-450px",
    config: { mass: 1, tension: 100, friction: 20 },
  });

  return (
    <a.div
      className="TaskModal"
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
