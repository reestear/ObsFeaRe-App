import React from "react";
import "./styles.css";
import { useTheme } from "../../Contexts/ThemeContext";

export default function About() {
  const darkTheme = useTheme();
  return (
    <div id="about" style={{ color: darkTheme ? "white" : "black" }}>
      {/* color */}
      <div className="about-info">
        <p className="ai-1">Kaizenify is ...</p>
        <p className="ai-2">
          A powerful productivity tool that emphasizes continuous improvement
          and incremental progress. By breaking down goals into smaller,
          manageable tasks, users can avoid feeling overwhelmed and make steady
          progress towards their objectives.
        </p>
      </div>
      <p>Forget the Goal and Trust the Process</p>
    </div>
  );
}
