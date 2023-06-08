import React from "react";
import "./styles.css";
import { useTheme } from "../../Contexts/ThemeContext";
import {
  INSTAGRAM,
  GITHUB,
  LINKEDIN,
  TWITTER,
  INSTAGRAM_LIGHT,
  GITHUB_LIGHT,
  LINKEDIN_LIGHT,
  TWITTER_LIGHT,
} from "./icons";

export default function Footer() {
  const darkTheme = useTheme();

  return (
    <div
      className="footer"
      style={{ backgroundColor: darkTheme ? "#121212" : "white" }}
    >
      <div className="footerMenu">
        <a
          href="https://www.instagram.com/positiononthebottom/"
          target="_blank"
          rel="noreferrer"
        >
          {darkTheme ? (
            <INSTAGRAM></INSTAGRAM>
          ) : (
            <INSTAGRAM_LIGHT></INSTAGRAM_LIGHT>
          )}
          {/* fill */}
        </a>
        <a href="https://github.com/reestear" target="_blank" rel="noreferrer">
          {darkTheme ? <GITHUB></GITHUB> : <GITHUB_LIGHT></GITHUB_LIGHT>}
          {/* fill */}
        </a>
        <a
          href="https://www.linkedin.com/in/ruslan-tasmukhanov-a5642b247/"
          target="_blank"
          rel="noreferrer"
        >
          {darkTheme ? (
            <LINKEDIN></LINKEDIN>
          ) : (
            <LINKEDIN_LIGHT></LINKEDIN_LIGHT>
          )}
          {/* fill */}
        </a>
        <a href="https://twitter.com/ruslahnq" target="_blank" rel="noreferrer">
          {darkTheme ? <TWITTER></TWITTER> : <TWITTER_LIGHT></TWITTER_LIGHT>}
          {/* fill */}
        </a>
      </div>
      <div className="RightF">
        <p style={{ color: darkTheme ? "white" : "black" }}>
          Made with nFactorial in 2023 🖤
        </p>
      </div>
    </div>
  );
}
