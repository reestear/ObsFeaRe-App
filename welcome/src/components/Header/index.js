import React from "react";
import "./styles.css";
import { ReactComponent as LOGO } from "../../assets/Icons/3logo.svg";
import Menu from "../Menu";
import ThemeCh from "../ThemeCh";
import { useTheme } from "../../Contexts/ThemeContext";

export default function Header() {
  const darkTheme = useTheme();
  return (
    <div id="header">
      <div className="logo">
        <LOGO className="logo-img" fill={darkTheme ? "white" : "black"}></LOGO>
        <p style={{ color: darkTheme ? "white" : "black" }}>Kaizenify</p>
      </div>
      <div className="menu">
        <Menu text={"About"} sectionId="about"></Menu>
        <Menu text={"Learn More"} sectionId="lmore"></Menu>
        <Menu text={"Contact"} sectionId="contact"></Menu>
        <ThemeCh></ThemeCh>
      </div>
    </div>
  );
}
