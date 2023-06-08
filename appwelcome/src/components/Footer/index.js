import React, { useContext } from "react";
import "./styles.css";
import { INSTAGRAM, GITHUB, LINKEDIN, TWITTER, LOGO } from "./icons";
import Menu from "../Menu";
import { PageContext } from "../Outline";
import { useTheme } from "../../Contexts/ThemeContext";

export default function Footer() {
  const moveTo = useContext(PageContext);
  const darkTheme = useTheme();
  return (
    <div id="footer">
      <div className="socials">
        <a
          href="https://www.instagram.com/positiononthebottom/"
          target="_blank"
          rel="noreferrer"
        >
          <INSTAGRAM fill={darkTheme ? "white" : "black"}></INSTAGRAM>
          {/* fill */}
        </a>
        <a href="https://github.com/reestear" target="_blank" rel="noreferrer">
          <GITHUB fill={darkTheme ? "white" : "black"}></GITHUB>
          {/* fill */}
        </a>
        <a
          href="https://www.linkedin.com/in/ruslan-tasmukhanov-a5642b247/"
          target="_blank"
          rel="noreferrer"
        >
          <LINKEDIN fill={darkTheme ? "white" : "black"}></LINKEDIN>
          {/* fill */}
        </a>
        <a href="https://twitter.com/ruslahnq" target="_blank" rel="noreferrer">
          <TWITTER fill={darkTheme ? "white" : "black"}></TWITTER>
          {/* fill */}
        </a>
      </div>
      <div className="foot-menus">
        <button onClick={() => moveTo("main")}>
          <LOGO
            width={"40px"}
            height={"40px"}
            fill={darkTheme ? "white" : "black"}
          ></LOGO>
          {/* fill */}
        </button>
        <Menu text={"About"} sectionId="about"></Menu>
        <Menu text={"Learn More"} sectionId="lmore"></Menu>
        <Menu text={"Contact"} sectionId="contact"></Menu>
      </div>
    </div>
  );
}
