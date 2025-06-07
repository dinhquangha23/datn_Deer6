import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { StoreProvider } from "./util/contextAPI/Provider.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

const client_id = import.meta.env.VITE_GG_CLIENT_ID;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={client_id}>
      <BrowserRouter>
        <StoreProvider>
          <App />
        </StoreProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
