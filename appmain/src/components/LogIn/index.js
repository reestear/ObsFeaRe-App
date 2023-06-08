import React, { useEffect, useState } from "react";
import "./styles.css";
import { useNavigate } from "react-router-dom";
import { dataUserLogin } from "../../Contexts/Services";

export default function LogIn() {
  useEffect(() => {
    sessionStorage.clear();
  }, []);

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="LogIn">
      <div
        style={{ backgroundColor: "black", height: "60px", width: "100%" }}
      ></div>
      <div className="LogInForm">
        <div className="LogInTitle">
          <h3>LogIn</h3>
        </div>
        <div className="LogInGrid">
          <div className="LogInEmail">
            <input
              placeholder="Insert Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></input>
          </div>
          <div className="LogInPassword">
            <input
              placeholder="Insert Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></input>
          </div>
          <div className="submitLogInButton">
            <button
              onClick={() => {
                dataUserLogin(email, password).then((res) => {
                  console.log("res: ");
                  console.log(res);
                  if (res) navigate("/WeekBan");
                });
              }}
            >
              Log In
            </button>
          </div>
        </div>
        <div className="registerButton">
          <button onClick={() => navigate("/register")}>Register</button>
        </div>
      </div>
      <div
        style={{ backgroundColor: "black", height: "60px", width: "100%" }}
      ></div>
    </div>
  );
}
