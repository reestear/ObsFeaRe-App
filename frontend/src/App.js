import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import LogIn from "./components/LogIn";
import Main from "./components/Main";
import Register from "./components/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" Component={LogIn}></Route>
        <Route path="/register" Component={Register}></Route>
        <Route path="/application" Component={Main}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
