import React from "react";
import TaskModal from "../TaskModal";
import TasksHandler from "../TasksHandler";
import WorkPage from "../WorkPage";

export default function WeekBan() {
  return (
    <>
      <TaskModal></TaskModal>
      <WorkPage></WorkPage>
      <TasksHandler></TasksHandler>
    </>
  );
}
