import React from "react";
import { useSelector } from "react-redux";
import {
  GITHUB,
  GITHUB_LIGHT,
  INSTAGRAM,
  INSTAGRAM_LIGHT,
  LINKEDIN,
  LINKEDIN_LIGHT,
  TWITTER,
  TWITTER_LIGHT,
} from "./icons";
import "./styles.css";

export default function Footer() {
  const darkTheme = useSelector((state) => state.darkTheme);

  return (
    <div
      className="footer easeTransition"
      style={{ backgroundColor: darkTheme ? "#121212" : "white" }}
    >
      <div className="footerMenu">
        <a
          className="easeTransition"
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
        <a
          className="easeTransition"
          href="https://github.com/reestear"
          target="_blank"
          rel="noreferrer"
        >
          {darkTheme ? <GITHUB></GITHUB> : <GITHUB_LIGHT></GITHUB_LIGHT>}
          {/* fill */}
        </a>
        <a
          className="easeTransition"
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
        <a
          className="easeTransition"
          href="https://twitter.com/ruslahnq"
          target="_blank"
          rel="noreferrer"
        >
          {darkTheme ? <TWITTER></TWITTER> : <TWITTER_LIGHT></TWITTER_LIGHT>}
          {/* fill */}
        </a>
      </div>
      <div className="RightF easeTransition">
        <p style={{ color: darkTheme ? "white" : "black" }}>
          Made with nFactorial in 2023 🖤
        </p>
      </div>
    </div>
  );
}
