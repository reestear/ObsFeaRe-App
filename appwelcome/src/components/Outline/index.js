import React from "react";
import About from "../About";
import Contact from "../Contact";
import Footer from "../Footer";
import Header from "../Header";
import LMore from "../LMore";
import Main from "../Main";
import { createContext } from "react";
import { useTheme } from "../../Contexts/ThemeContext";

export const PageContext = createContext();

export default function Outline() {
  const darkTheme = useTheme();
  function moveTo(id) {
    const section = document.getElementById(id);

    section.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div
      className="Outline"
      style={{ backgroundColor: darkTheme ? "#141414" : "white" }}
    >
      {/* background color */}
      <PageContext.Provider value={moveTo}>
        <Header></Header>
      </PageContext.Provider>
      <div
        style={{
          height: "1px",
          backgroundColor: darkTheme ? "white" : "black",
        }}
      ></div>
      <Main></Main>
      <div
        style={{
          border: "black",
          height: "1px",
          backgroundColor: darkTheme ? "white" : "black",
        }}
      ></div>
      <About></About>
      <div
        style={{
          border: "black",
          height: "1px",
          backgroundColor: darkTheme ? "white" : "black",
        }}
      ></div>
      <LMore></LMore>
      <div
        style={{
          border: "black",
          height: "1px",
          backgroundColor: darkTheme ? "white" : "black",
        }}
      ></div>
      <Contact></Contact>
      <div
        style={{
          border: "black",
          height: "1px",
          backgroundColor: darkTheme ? "white" : "black",
        }}
      ></div>
      <PageContext.Provider value={moveTo}>
        <Footer></Footer>
      </PageContext.Provider>
    </div>
  );
}
