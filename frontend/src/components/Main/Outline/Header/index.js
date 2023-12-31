import React, { useState } from "react";
import { useSelector } from "react-redux";
// import { toggleTheme } from "../../store/reducers/themeSlice";
// import { useTheme } from "../../Contexts/ThemeContext";
import { useNavigate } from "react-router-dom";
import ThemeCh from "./ThemeCh";
import "./styles.css";

export default function Header({ togglePage }) {
  // const darkTheme = useTheme();
  const [isOpenMore, setIsOpenMore] = useState(false);
  const [logOutWindow, setLogOutWindow] = useState(false);
  const navigate = useNavigate();

  const darkTheme = useSelector((state) => state.darkTheme);

  return (
    <div
      className="header easeTransition"
      style={{ backgroundColor: darkTheme ? "#121212" : "white" }}
    >
      <div className="LeftH">
        <button
          className="btn-WeekBan easeTransition"
          style={{ color: darkTheme ? "white" : "black" }}
          onClick={() => togglePage("WeekBan")}
        >
          WeekBan
        </button>
        <button
          className="btn-Timeline easeTransition"
          style={{ color: darkTheme ? "white" : "black" }}
          onClick={() => togglePage("Timeline")}
        >
          Timeline
        </button>
        <button
          className="btn-PlayGround easeTransition"
          style={{ color: darkTheme ? "white" : "black" }}
          onClick={() => togglePage("PlayGround")}
        >
          PlayGround
        </button>
        <button className="btn-More" onClick={() => setIsOpenMore(!isOpenMore)}>
          <svg
            style={{ scale: isOpenMore ? "-1" : "1" }}
            width="15"
            height="16"
            viewBox="0 0 15 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              className="easeTransition"
              d="M3.065 3.16998L8.435 7.99998L3.065 12.83"
              stroke={darkTheme ? "white" : "black"}
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              className="easeTransition"
              d="M6.565 3.16998L11.935 7.99998L6.565 12.83"
              stroke={darkTheme ? "white" : "black"}
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
      <div className="menu">
        <ThemeCh></ThemeCh>
        <button
          className="btn-userProfile"
          onClick={() => setLogOutWindow(!logOutWindow)}
        >
          <svg
            width="25"
            height="26"
            viewBox="0 0 25 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_7_183)">
              <path
                className="easeTransition"
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M7.55214 2.98732C8.90496 2.68668 10.5461 2.58334 12.5 2.58334C14.4538 2.58334 16.095 2.68668 17.4478 2.98732C18.8125 3.2906 19.9466 3.80834 20.8191 4.68082C21.6916 5.5533 22.2094 6.68753 22.5127 8.05217C22.8133 9.40499 22.9166 11.0462 22.9166 13C22.9166 14.9539 22.8133 16.595 22.5127 17.9478C22.2094 19.3125 21.6916 20.4467 20.8191 21.3192C19.9466 22.1917 18.8125 22.7094 17.4478 23.0127C16.095 23.3133 14.4538 23.4167 12.5 23.4167C10.5461 23.4167 8.90496 23.3133 7.55214 23.0127C6.1875 22.7094 5.05327 22.1917 4.18079 21.3192C3.30831 20.4467 2.79057 19.3125 2.48729 17.9478C2.18665 16.595 2.08331 14.9539 2.08331 13C2.08331 11.0462 2.18665 9.40499 2.48729 8.05217C2.79057 6.68753 3.30831 5.5533 4.18079 4.68082C5.05327 3.80834 6.1875 3.2906 7.55214 2.98732ZM12.5 6.75001C10.1988 6.75001 8.33331 8.61549 8.33331 10.9167C8.33331 13.2178 10.1988 15.0833 12.5 15.0833C14.8011 15.0833 16.6666 13.2178 16.6666 10.9167C16.6666 8.61549 14.8011 6.75001 12.5 6.75001ZM19.1432 18.5148C19.5107 19.1141 19.3807 19.9063 18.7884 20.2849C18.2499 20.6293 17.6206 20.8401 16.9957 20.979C15.8669 21.2298 14.4061 21.3333 12.4998 21.3333C10.5935 21.3333 9.13273 21.2298 8.00395 20.979C7.39077 20.8427 6.77295 20.6374 6.24093 20.3042C5.63797 19.9266 5.50543 19.1236 5.882 18.5199C6.31564 17.8248 6.91327 17.2787 7.7175 16.89C8.93771 16.3004 10.5372 16.125 12.4996 16.125C14.4553 16.125 16.053 16.2863 17.2715 16.8591C18.0965 17.2469 18.7054 17.8009 19.1432 18.5148Z"
                fill={darkTheme ? "white" : "black"}
              />
            </g>
            <defs>
              <clipPath id="clip0_7_183">
                <rect
                  className="easeTransition"
                  width="25"
                  height="25"
                  fill={darkTheme ? "white" : "black"}
                  transform="translate(0 0.5)"
                />
              </clipPath>
            </defs>
          </svg>
        </button>
      </div>

      <button
        className="btn-logout"
        style={{
          opacity: logOutWindow ? "100%" : "0%",
          visibility: logOutWindow ? "visible" : "hidden",
        }}
        onClick={() => {
          sessionStorage.clear();
          navigate("/login");
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8.125 9.875L10 8M10 8L8.125 6.125M10 8H3.125M3.125 5.03001V5.00013C3.125 4.30006 3.125 3.94976 3.26124 3.68238C3.38108 3.44717 3.57217 3.25608 3.80738 3.13624C4.07476 3 4.42506 3 5.12513 3H11.1251C11.8252 3 12.1748 3 12.4421 3.13624C12.6773 3.25608 12.8691 3.44717 12.9889 3.68238C13.125 3.9495 13.125 4.29937 13.125 4.99807V11.0023C13.125 11.7009 13.125 12.0503 12.9889 12.3174C12.8691 12.5526 12.6773 12.7441 12.4421 12.8639C12.175 13 11.8256 13 11.1269 13H5.12307C4.42437 13 4.0745 13 3.80738 12.8639C3.57217 12.7441 3.38108 12.5524 3.26124 12.3173C3.125 12.0499 3.125 11.7001 3.125 11V10.9688"
            stroke="black"
            stroke-width="1.25"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <p>Log Out</p>
      </button>
    </div>
  );
}
