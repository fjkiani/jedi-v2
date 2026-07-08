// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import { ThemeProvider } from "./context/ThemeContext";
import App from "./App";
import "./index.css";

const CLERK_PUB = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "";
if (!CLERK_PUB) {
  console.warn(
    "[clerk] VITE_CLERK_PUBLISHABLE_KEY missing — /seo-command-center will not render the sign-in gate."
  );
}

// If Clerk key present, wrap in ClerkProvider so any auth-gated route can use hooks.
// If missing, render without Clerk — /seo-command-center will show a config notice.
function Root() {
  if (!CLERK_PUB) {
    return (
      <ThemeProvider>
        <Router>
          <App />
        </Router>
      </ThemeProvider>
    );
  }
  return (
    <ClerkProvider publishableKey={CLERK_PUB} afterSignOutUrl="/">
      <ThemeProvider>
        <Router>
          <App />
        </Router>
      </ThemeProvider>
    </ClerkProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
