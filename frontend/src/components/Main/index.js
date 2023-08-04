import React from "react";
import { Provider } from "react-redux";
import { DataProvider } from "../../Contexts/DataContext";
import { ModalProvider } from "../../Contexts/OpenModalContext";
import { TreesProvider } from "../../Contexts/TreeContext";
import store from "../../store/store";
import Outline from "./Outline";

export default function Main() {
  return (
    <Provider store={store}>
      <TreesProvider>
        <DataProvider>
          <ModalProvider>
            <Outline></Outline>
          </ModalProvider>
        </DataProvider>
      </TreesProvider>
    </Provider>
  );
}
