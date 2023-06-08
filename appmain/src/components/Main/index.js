import React from "react";
import { ThemeProvider } from "../../Contexts/ThemeContext";
import Outline from "../Outline";
import { DataProvider } from "../../Contexts/DataContext";
import { ModalProvider } from "../../Contexts/OpenModalContext";

export default function Main() {
  return (
    <ThemeProvider>
      <DataProvider>
        <ModalProvider>
          <Outline></Outline>
        </ModalProvider>
      </DataProvider>
    </ThemeProvider>
  );
}
