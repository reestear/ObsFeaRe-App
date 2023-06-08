import React from "react";
import Header from "../Header";
import { createContext } from "react";
import { useTheme } from "../../Contexts/ThemeContext";
import WorkPage from "../WorkPage";
import TasksHandler from "../TasksHandler";
import Footer from "../Footer";
import TaskModal from "../TaskModal";

export const PageContext = createContext();

export default function Outline() {
  const darkTheme = useTheme();

  return (
    <div
      className="Outline"
      style={{
        backgroundColor: darkTheme ? "#181818" : "#EAEAEA",
        width: "1512px",
        overflow: "hidden",
      }}
    >
      {/* background color */}
      <Header></Header>
      <TaskModal></TaskModal>
      <WorkPage></WorkPage>
      <TasksHandler></TasksHandler>
      <Footer></Footer>
    </div>
  );
}
