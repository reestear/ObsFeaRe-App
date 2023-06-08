import React, { useState } from "react";

import "./styles.css";
import {
  useChangeToDoTitle,
  useModalDeleteToDo,
  useToggleModalToDo,
} from "../../Contexts/OpenModalContext";

export default function TaskModalTodo({ todo }) {
  const changeTodoTitle = useChangeToDoTitle();
  const toggleModalToDo = useToggleModalToDo();
  const modalDeleteToDo = useModalDeleteToDo();
  const [trash, setTrash] = useState(true);

  return (
    <div className="TaskModalTodo">
      <input
        checked={todo.done ? true : false}
        className="TaskModalTodoCheck"
        type="checkbox"
        onClick={() => toggleModalToDo(todo._id)}
      ></input>
      <div className="tmtHandler">
        <input
          value={todo.todoTitle}
          placeholder="Insert Your To-Do"
          onChange={(e) => {
            changeTodoTitle(todo._id, e.target.value);
          }}
        ></input>
        <div className="handleToDos">
          {trash && (
            <button onClick={() => setTrash(!trash)}>
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.25 3.75V11.25C11.25 11.9404 10.6904 12.5 10 12.5H5C4.30964 12.5 3.75 11.9404 3.75 11.25V3.75M2.5 3.75H12.5M9.375 3.75V3.125C9.375 2.43464 8.81537 1.875 8.125 1.875H6.875C6.18464 1.875 5.625 2.43464 5.625 3.125V3.75"
                  stroke="#E73B3B"
                  stroke-width="1.25"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          )}
          {!trash && (
            <button onClick={() => setTrash(!trash)}>
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.5 13.125C10.6066 13.125 13.125 10.6066 13.125 7.5C13.125 4.3934 10.6066 1.875 7.5 1.875C4.3934 1.875 1.875 4.3934 1.875 7.5C1.875 10.6066 4.3934 13.125 7.5 13.125Z"
                  stroke="#3EB92A"
                  stroke-width="1.66667"
                />
                <path
                  d="M11.25 11.25L3.75 3.75"
                  stroke="#3EB92A"
                  stroke-width="1.66667"
                />
              </svg>
            </button>
          )}
          {!trash && (
            <button
              onClick={() => {
                setTrash(!trash);
                modalDeleteToDo(todo._id);
              }}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.125 7.5C13.125 10.6066 10.6066 13.125 7.5 13.125C4.3934 13.125 1.875 10.6066 1.875 7.5C1.875 4.3934 4.3934 1.875 7.5 1.875C10.6066 1.875 13.125 4.3934 13.125 7.5Z"
                  stroke="#E77105"
                  stroke-width="1.66667"
                />
                <path
                  d="M5.625 7.5L6.67675 8.55175C6.78625 8.66125 6.96375 8.66125 7.07325 8.55175L9.375 6.25"
                  stroke="#E77105"
                  stroke-width="1.66667"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          )}
        </div>
        {/* <p>10 Push Ups</p> */}
      </div>
    </div>
  );
}
