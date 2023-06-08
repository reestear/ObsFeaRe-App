import React from "react";
import "./styles.css";
import { useNewTodo } from "../../Contexts/OpenModalContext";

export default function TaskModalNewTodo() {
  const createNewTodo = useNewTodo();
  return (
    <div>
      <button
        className="btn-TaskModalNewTodo"
        onClick={() => {
          // console.log("clicked on TaskModalNewTodo");
          createNewTodo();
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15.3535 10H4.0404"
            stroke="white"
            stroke-width="1.95163"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M9.69699 4.16669V15.8334"
            stroke="white"
            stroke-width="1.95163"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <p>New To-Do</p>
      </button>
    </div>
  );
}
