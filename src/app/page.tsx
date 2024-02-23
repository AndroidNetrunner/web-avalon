"use client";

import { Provider } from "react-redux";
import store from "@/redux/store";
import Home from "../components/Home";

export default function MyApp() {
  return (
    <Provider store={store}>
      <Home />
    </Provider>
  );
}
