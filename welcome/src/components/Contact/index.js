import React from "react";
import "./styles.css";
import { useTheme } from "../../Contexts/ThemeContext";

export default function Contact() {
  const darkTheme = useTheme();
  let handleClick = () => {
    window.location.replace(
      "mailto:ruslahn.q@gmail.com?subject=Kaizenify Response about <state theme>&body=Hello!"
    );
  };
  return (
    <div id="contact">
      <div
        className="contact-title"
        style={{ color: darkTheme ? "white" : "black" }}
      >
        {/* color */}
        <p className="ct-1">Stay on Touch</p>
        <p className="ct-2">
          Contact us to report about any bugs or share with your wonderful ideas
          of improving the application
        </p>
        <p className="ct-3">We will be happy!</p>
      </div>
      <button
        className="contact-button"
        onClick={handleClick}
        style={{
          color: darkTheme ? "white" : "black",
          borderColor: darkTheme ? "white" : "black",
        }}
      >
        Contact Us
      </button>
      {/* color, bordercolor */}
    </div>
  );
}
