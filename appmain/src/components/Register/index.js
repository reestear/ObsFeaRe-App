import React, { useState } from "react";
import "./styles.css";
import { useNavigate } from "react-router-dom";
import { dataUserRegister } from "../../Contexts/Services";

export default function Register() {
  const navigate = useNavigate();
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [errorM, setErrorM] = useState("");
  // const [password_copy, setPassword_Copy] = useState("");

  return (
    <div className="Register">
      <div
        style={{ backgroundColor: "black", height: "60px", width: "100%" }}
      ></div>
      <div className="RegisterForm">
        <div className="RegisterTitle">
          <h3>Register</h3>
        </div>
        <div className="RegisterGrid">
          <div className="RegisterName">
            <input
              placeholder="Username"
              value={username}
              onChange={(e) => setName(e.target.value)}
            ></input>
          </div>
          <div className="RegisterEmail">
            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></input>
          </div>
          <div className="RegisterPassword">
            <input
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></input>
          </div>
          {/* {errorM && <p>{errorM}</p>} */}
          {/* <div style={{ visibility: errorM ? "visible" : "hidden" }}>
            <p>{errorM}</p>
          </div> */}
          {/* <div className="RegisterPassword">
            <input
              placeholder="Again Password"
              value={password_copy}
              onChange={(e) => setPassword_Copy(e.target.value)}
            ></input>
          </div> */}
          <div className="submitRegisterButton">
            <button
              onClick={() => {
                dataUserRegister(username, email, password).then((res) => {
                  console.log(res);
                  if (res) {
                    setEmail("");
                    setName("");
                    setPassword("");
                    navigate("/application");
                  }
                });
              }}
            >
              Register
            </button>
          </div>
        </div>
        <div className="loginButton">
          <button onClick={() => navigate("/login")}>Log In</button>
        </div>
      </div>
      <div
        style={{ backgroundColor: "black", height: "60px", width: "100%" }}
      ></div>
    </div>
  );
}
