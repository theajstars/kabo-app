import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { ToastProvider } from "react-toast-notifications";

import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Dashboard from "./Pages/Dashboard";
import Products from "./Pages/Products";
import DashboardContainer from "./Pages/DashboardContainer";
import Orders from "./Pages/Orders";
import Team from "./Pages/Team";
import Cart from "./Pages/Cart";
import Stores from "./Pages/Stores";

function App() {
  return (
    <ToastProvider autoDismiss={true}>
      <Router>
        <Routes>
          <Route index element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<DashboardContainer />}>
            <Route index element={<Dashboard />} />
            <Route path="/dashboard/products" element={<Products />} />
            <Route path="/dashboard/orders" element={<Orders />} />
            <Route path="/dashboard/cart" element={<Cart />} />
            <Route path="/dashboard/stores" element={<Stores />} />
          </Route>
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
