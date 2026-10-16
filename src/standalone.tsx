import React from "react";
import { createRoot } from "react-dom/client";
import CrmPrototype from "./components/crm/CrmPrototype";
import "./styles.css";

const el = document.getElementById("root");
if (el) {
  const root = createRoot(el);
  root.render(<CrmPrototype persona="SALES-HEAD" scaleMode="fluid" />);
}
