import { ThemeProvider } from "./Contexts/ThemeContext";
import Outline from "./components/Outline";

function App() {
  return (
    <ThemeProvider>
      <Outline></Outline>
    </ThemeProvider>
  );
}

export default App;
