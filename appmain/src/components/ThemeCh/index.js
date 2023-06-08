import React from "react";
import { ReactComponent as SUN } from "../../assets/Icons/sun.svg";
import { ReactComponent as MOON } from "../../assets/Icons/moon.svg";
import { useTheme, useThemeUpdate } from "../../Contexts/ThemeContext";
import "./styles.css";

export default function ThemeCh() {
  const darkTheme = useTheme();
  const toggleTheme = useThemeUpdate();

  return (
    <button className="toggle-theme-button" onClick={toggleTheme}>
      {darkTheme ? (
        <SUN
          width={"20px"}
          height={"20px"}
          fill={darkTheme ? "white" : "black"}
        ></SUN>
      ) : (
        <MOON width={"20px"} height={"20px"} style={{}}></MOON>
      )}
    </button>
  );
}
