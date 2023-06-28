import { animated as a, useSpring } from "@react-spring/web";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useData } from "../../../../../Contexts/DataContext";
import NewTask from "./NewTask";
import TaskItem from "./TaskItem";
import "./styles.css";

export default function TasksHandler() {
  const data = useData();
  const { tasks } = data;
  // console.log("there are the tasks insideo of TasksHandler");
  // console.log(tasks);
  // console.log("data: ");
  // console.log(data);
  const darkTheme = useSelector((state) => state.darkTheme);
  const [isOpenTasks, setIsOpenTasks] = useState(false);
  let firstTime = 1;

  const animatedProps = useSpring({
    from: {
      marginLeft: isOpenTasks ? "-800px" : firstTime-- === 1 ? "-800px" : "0px",
    },
    marginLeft: isOpenTasks ? "0" : "-800px",
    config: { mass: 1, tension: 100, friction: 20 },
  });

  const task = {
    taskId: 0,
    taskTitle: "WorkOut Schedule",
  };

  return (
    <div className="tasksHandler">
      <button
        className="btn-openTasks"
        onClick={() => setIsOpenTasks(!isOpenTasks)}
      >
        <svg
          style={{ scale: isOpenTasks ? "-1" : "1" }}
          width="44"
          height="20"
          viewBox="5 1.5 44 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            className="easeTransition"
            d="M20 4L28.95 12.05L20 20.1"
            stroke={darkTheme ? "white" : "black"}
            stroke-width="1.33333"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            className="easeTransition"
            d="M25.8333 4.00002L34.7833 12.05L25.8333 20.1"
            stroke={darkTheme ? "white" : "black"}
            stroke-width="1.33333"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
      <a.div
        className="tasksList"
        style={{
          backgroundColor: darkTheme
            ? "rgba(131, 101, 52, 0.3)"
            : "rgba(242, 217, 152, 0.3)",
          ...animatedProps,
        }}
      >
        {tasks.map((task) => (
          <TaskItem task={task}></TaskItem>
        ))}
        {/* <TaskItem task={task}></TaskItem>
        <TaskItem task={task}></TaskItem>
        <TaskItem task={task}></TaskItem>
        <TaskItem task={task}></TaskItem> */}
        <NewTask></NewTask>
      </a.div>
    </div>
  );
}
