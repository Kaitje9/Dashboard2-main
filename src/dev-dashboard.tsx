import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./styles/tokens.css";
import DevDashboardPage from "./app/dev/dashboard/page";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DevDashboardPage />
  </StrictMode>,
);
