import React, { useContext } from "react";
import "./styles.css";
import { PageContext } from "../Outline";
import { useTheme } from "../../Contexts/ThemeContext";

export default function Menu({ text, sectionId }) {
  const darkTheme = useTheme();
  const moveTo = useContext(PageContext);
  return (
    <button
      className="menu-text"
      onClick={() => moveTo(sectionId)}
      style={{ color: darkTheme ? "white" : "black" }}
    >
      {text}
    </button>
    // color
  );
}
