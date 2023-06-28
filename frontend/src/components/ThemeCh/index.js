import React from "react";
import { ReactComponent as MOON } from "../../assets/Icons/moon.svg";
import { ReactComponent as SUN } from "../../assets/Icons/sun.svg";
// import { useTheme, useThemeUpdate } from "../../Contexts/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../../store/reducers/themeSlice";
import "./styles.css";

export default function ThemeCh() {
  // const darkTheme = useTheme();
  // const toggleTheme = useThemeUpdate();

  const darkTheme = useSelector((state) => state.darkTheme);
  const dispatch = useDispatch();

  return (
    <button
      className="toggle-theme-button"
      onClick={() => dispatch(toggleTheme())}
    >
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
