import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import LogIn from "./components/LogIn";
import Main from "./components/Main";
import { Mobile } from "./components/Mobile";
import { NotFound } from "./components/NotFound";
import Register from "./components/Register";
import Start from "./components/Start";

function App() {
  const [isMobile, setIsMobile] = useState(true);

  const handleResize = () => {
    console.log("window.innerWidth: " + window.innerWidth);
    // setIsDesktop(window.innerWidth >= 1200); // Adjust the breakpoint as needed
    if (window.innerWidth < 1200) setIsMobile(true);
    else if (isMobile) setIsMobile(false);
  };

  useEffect(() => {
    // remove the comments to handle the phone screen

    handleResize(); // Set the initial value based on window size
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const screenRes = {
      width: window.screen.width,
      height: window.screen.height,
    };
    localStorage.setItem("screenRes", JSON.stringify(screenRes));
  }, []);

  return (
    <>
      {isMobile && <Mobile></Mobile>}
      {!isMobile && (
        <BrowserRouter>
          <Routes>
            <Route path="/" Component={Start}></Route>
            <Route path="/login" Component={LogIn}></Route>
            <Route path="/register" Component={Register}></Route>
            <Route path="/application" Component={Main}></Route>
            <Route path="/home" Component={Home}></Route>
            <Route path="*" Component={NotFound}></Route>
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
}

export default App;
