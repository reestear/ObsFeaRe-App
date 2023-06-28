import React from "react";
import { Provider } from "react-redux";
import { DataProvider } from "../../Contexts/DataContext";
import { ModalProvider } from "../../Contexts/OpenModalContext";
import store from "../../store/store";
import Outline from "../Outline";

export default function Main() {
  return (
    <Provider store={store}>
      <DataProvider>
        <ModalProvider>
          <Outline></Outline>
        </ModalProvider>
      </DataProvider>
    </Provider>
  );
}
