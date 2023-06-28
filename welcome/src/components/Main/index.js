import React, { useState } from "react";
import "./styles.css";
import { useTheme } from "../../Contexts/ThemeContext";
import Typewriter from "typewriter-effect";
import { useSpring, animated } from "react-spring";

export default function Main() {
  const darkTheme = useTheme();
  const text1 = "make changes to your Daily life";
  const text2 = "and eventually ...";
  const text3 = "change your Whole life";
  const props = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
    delay: 200,
  });

  return (
    <div id="main">
      <div
        className="main-frame"
        style={{ color: darkTheme ? "white" : "black" }}
      >
        <div className="main-title">
          <p id="m-t-1">{text1}</p>
          <p id="m-t-2">{text2}</p>
          <p id="m-t-3">{text3}</p>
        </div>
        <animated.button
          className="to-app-btn"
          style={{
            color: darkTheme ? "white" : "black",
            borderColor: darkTheme ? "white" : "black",
            props,
          }}
        >
          start with Kaizenify
        </animated.button>
        {/* <button
          className="to-app-btn"
          style={{
            color: darkTheme ? "white" : "black",
            borderColor: darkTheme ? "white" : "black",
          }}
        >
          start with Kaizenify
        </button>{" "} */}
      </div>
    </div>
  );
}
