import React from "react";
import TaskModal from "./TaskModal";
import TasksHandler from "./TasksHandler";
import WorkPage from "./WorkPage";
import "./styles.css";

export default function WeekBan() {
  console.log("Mounting WeekBan");
  return (
    <div className="WeekBan">
      <TaskModal></TaskModal>
      <WorkPage></WorkPage>
      <TasksHandler></TasksHandler>
    </div>
  );
}
