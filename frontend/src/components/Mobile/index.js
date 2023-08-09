import React, { useState } from "react";
import Typewriter from "typewriter-effect";
import "./styles.css";

export const Mobile = () => {
  const text = "Desktop's the key for all app features. Give it a go!";
  const delay = 25;
  const timeOut = (text.length + 20) * delay;

  const [show, setShow] = useState(false);
  setTimeout(() => setShow(true), timeOut);

  return (
    <div className="Mobile">
      <div className="Mobile-container">
        <Typewriter
          options={{ delay: delay }}
          onInit={(typewrite) => {
            typewrite.typeString(text).start();
          }}
        ></Typewriter>
        <a
          href="https://kaspi.kz/shop/p/asus-x515ea-bq1189w-90nb0ty1-m25390-seryi-105321625/?c=750000000"
          target="_blank"
          rel="noreferrer"
          style={{
            opacity: show ? "1" : "0",
            marginBottom: show ? "-50px" : "",
          }}
        >
          not an advertisement
        </a>
      </div>
    </div>
  );
};
