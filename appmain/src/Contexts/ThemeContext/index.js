import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();
const ThemeUpdateContext = createContext();

export function useTheme() {
  return useContext(ThemeContext);
}

export function useThemeUpdate() {
  return useContext(ThemeUpdateContext);
}

export function ThemeProvider({ children }) {
  const [darkTheme, setDarkTheme] = useState(false);

  function toggleTheme() {
    localStorage.setItem("theme", JSON.stringify(!darkTheme));
    const Root = document.getElementById("root");
    Root.style.backgroundColor = !darkTheme ? "EAEAEA" : "181818";
    setDarkTheme((darkTheme) => !darkTheme);
  }
  const [mounted, setMounted] = useState();
  useEffect(() => {
    setDarkTheme(JSON.parse(localStorage.getItem("theme")));
  }, [mounted]);

  return (
    <ThemeContext.Provider value={darkTheme}>
      <ThemeUpdateContext.Provider value={toggleTheme}>
        {children}
      </ThemeUpdateContext.Provider>
    </ThemeContext.Provider>
  );
}
