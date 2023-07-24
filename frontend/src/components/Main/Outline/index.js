import React, { createContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ChatHistoryProvider } from "../../../Contexts/ChatHistoryContext";
import { NotifyInfoProvider } from "../../../Contexts/NotifyInfoContext";
import { TreesProvider } from "../../../Contexts/TreeContext";
import Footer from "./Footer";
import Header from "./Header";
import PlayGround from "./PlayGround";
import WeekBan from "./WeekBan";

export const PageContext = createContext();

export default function Outline() {
  const darkTheme = useSelector((state) => state.darkTheme);
  const [page, setPage] = useState("WeekBan");

  function togglePage(val) {
    setPage(val);
    localStorage.setItem("page", JSON.stringify(val));
  }

  useEffect(() => {
    const pageLocal = localStorage.getItem("page");
    if (pageLocal !== null) setPage(JSON.parse(pageLocal));
  }, []);

  return (
    <div
      className="Outline easeTransition"
      style={{
        backgroundColor: darkTheme ? "#181818" : "#EAEAEA",
        width: "1512px",
        overflow: "hidden",
      }}
    >
      {/* background color */}
      <Header togglePage={togglePage}></Header>
      {page === "WeekBan" && <WeekBan></WeekBan>}
      {page === "PlayGround" && (
        <TreesProvider>
          <ChatHistoryProvider>
            <NotifyInfoProvider>
              <PlayGround></PlayGround>
            </NotifyInfoProvider>
          </ChatHistoryProvider>
        </TreesProvider>
      )}

      <Footer></Footer>
    </div>
  );
}
