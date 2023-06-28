import React from "react";
import { useSelector } from "react-redux";
import {
  useModal,
  useModalUpdate,
  usePrevTask,
  useUpdatePrevTask,
} from "../../../../../../Contexts/OpenModalContext";
import "./styles.css";

export default function NewTask() {
  const darkTheme = useSelector((state) => state.darkTheme);
  const openModal = useModal();
  const toggleModal = useModalUpdate();
  const prevTask = usePrevTask();
  const togglePrevTask = useUpdatePrevTask();

  return (
    <button
      className="btn-NewTask"
      style={{
        color: darkTheme ? "white" : "black",
        backgroundColor: darkTheme ? "#836534" : "#F2D998",
      }}
      onClick={() => {
        if (!openModal || prevTask._id === -1) {
          toggleModal();
        }
        const _id = -1,
          taskTitle = !prevTask
            ? ""
            : prevTask._id === -1
            ? prevTask.taskTitle
            : "";
        togglePrevTask({ _id, taskTitle });
      }}
    >
      <div className="btn-NewTask-inside">
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15.3535 10H4.0404"
            stroke={darkTheme ? "white" : "black"}
            stroke-width="1.95163"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M9.69699 4.16669V15.8334"
            stroke={darkTheme ? "white" : "black"}
            stroke-width="1.95163"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <p>New Task</p>
      </div>
    </button>
  );
}
