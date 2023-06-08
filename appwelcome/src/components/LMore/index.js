import React from "react";
import "./styles.css";
import VIDEOIMG from "../../assets/Images/kaizen-image.png";
import { useTheme } from "../../Contexts/ThemeContext";

export default function LMore() {
  const darkTheme = useTheme();
  return (
    <div id="lmore">
      <p
        className="lmore-title"
        style={{ color: darkTheme ? "white" : "black" }}
      >
        {/* color */}
        Learn More about Kaizen by watching the video:
      </p>
      <a href="https://youtu.be/fnLbAKA78D8" target="_blank" rel="noreferrer">
        <img alt="video" src={VIDEOIMG}></img>
      </a>
    </div>
  );
}
