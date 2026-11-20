import React from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./dulce-encanto.css";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);