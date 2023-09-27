import React, { useState, useEffect, createContext } from "react";

import {
  useNavigate,
  Link,
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import { useToasts } from "react-toast-notifications";
import Cookies from "js-cookie";

import { Product, Store, User } from "../../Lib/Types";

import "./styles.scss";
import { PerformRequest } from "../../Lib/PerformRequest";
import { Endpoints } from "../../Lib/Endpoints";
import {
  GetProductsResponse,
  GetUserStoreResponse,
  LoginResponse,
} from "../../Lib/Responses";
import MegaLoader from "../../Misc/MegaLoader";
import Products from "../Products";
import Dashboard from "../Dashboard";
import Navbar from "../Navbar";

import Orders from "../Orders";
import Team from "../Team";

interface AppContextProps {
  user: User | null;
  products: Product[] | [];
  logout: () => void;
}
const AppContext = createContext<AppContextProps | null>(null);
export default function DashboardContainer() {
  const navigate = useNavigate();
  const { addToast, removeAllToasts } = useToasts();
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [userStore, setUserStore] = useState<Store | null>(null);

  const getUser = async () => {
    const token = Cookies.get("token");
    const r: LoginResponse = await PerformRequest({
      route: Endpoints.GetUserDetails,
      method: "POST",
      data: { token: token },
    });
    console.log(r);
    if (r.data && r.data.data) {
      setUser(r.data.data);
    } else {
      navigate("/login");
    }
  };
  const getProducts = async () => {
    const token = Cookies.get("token");
    const r: GetProductsResponse = await PerformRequest({
      route: Endpoints.GetProducts,
      method: "POST",
      data: { token: token },
    });
    console.log(r);
    if (r.data && r.data.data) {
      setProducts(r.data.data);
    } else {
    }
  };

  useEffect(() => {
    getUser();
    getProducts();
  }, []);

  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("user_store_id");
    navigate("/login");
  };
  return (
    <AppContext.Provider
      value={{ user: user, logout: logout, products: products }}
    >
      <Navbar />
      <Routes>
        <Route index path="/" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/team" element={<Team />} />
      </Routes>
    </AppContext.Provider>
  );
}
export { AppContext };
