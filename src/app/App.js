// src/app/App.js
import React from "react";
import { BrowserRouter } from "react-router-dom";

import { ToastProvider } from "../ui/Toast";
import { AuthProvider } from "./providers/AuthProvider";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
