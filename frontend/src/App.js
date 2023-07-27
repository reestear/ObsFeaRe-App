import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import LogIn from "./components/LogIn";
import Main from "./components/Main";
import Register from "./components/Register";
import Start from "./components/Start";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={Start}></Route>
        <Route path="/login" Component={LogIn}></Route>
        <Route path="/register" Component={Register}></Route>
        <Route path="/application" Component={Main}></Route>
        <Route path="/home" Component={Home}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
