import React, { createContext, useState } from "react";
import { useSelector } from "react-redux";
import Footer from "../Footer";
import Header from "../Header";
import PlayGround from "../PlayGround";
import WeekBan from "../WeekBan";

export const PageContext = createContext();

export default function Outline() {
  const darkTheme = useSelector((state) => state.darkTheme);
  const [page, setPage] = useState("WeekBan");

  function togglePage(val) {
    setPage(val);
  }

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
      {page === "PlayGround" && <PlayGround></PlayGround>}

      <Footer></Footer>
    </div>
  );
}
