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

import {
  Cart as CartType,
  Category,
  Product,
  Store,
  User,
} from "../../Lib/Types";

import "./styles.scss";
import { PerformRequest } from "../../Lib/PerformRequest";
import { Endpoints } from "../../Lib/Endpoints";
import {
  GetCartResponse,
  GetCategoriesResponse,
  GetProductsResponse,
  LoginResponse,
} from "../../Lib/Responses";
import MegaLoader from "../../Misc/MegaLoader";
import Products from "../Products";
import Dashboard from "../Dashboard";
import Navbar from "../Navbar";

import Orders from "../Orders";
import Team from "../Team";
import Cart from "../Cart";

interface FetchProductProps {
  page: number;
  limit: number;
  category_id?: string;
}
interface AppContextProps {
  user: User | null;
  cart: CartType | null;
  categories: Category[] | [];
  products: Product[] | [];
  productCount: number;
  getProducts?: ({ page, limit }: FetchProductProps) => void;
  reloadCart?: () => void;
  logout: () => void;
}
const AppContext = createContext<AppContextProps | null>(null);
export default function DashboardContainer() {
  const navigate = useNavigate();
  const { addToast, removeAllToasts } = useToasts();
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartType | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [productCount, setProductCount] = useState<number>(0);

  const getUser = async () => {
    const token = Cookies.get("token");
    if (!token) {
      navigate("/login");
    }
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
  const getProducts = async ({
    page,
    limit,
    category_id,
  }: FetchProductProps) => {
    const token = Cookies.get("token");
    const r: GetProductsResponse = await PerformRequest({
      route: Endpoints.GetProducts,
      method: "POST",
      data: {
        token: token,
        page: page,
        limit: limit,
        category_id: category_id ?? "",
      },
    });
    console.log(r);
    if (r.data && r.data.status === "success") {
      setProducts(r.data.data ?? []);
      setProductCount(r.data.counts ?? 0);
    } else {
      addToast(r.data.message, { appearance: "error" });
    }
  };
  const getCategories = async () => {
    const token = Cookies.get("token");
    const r: GetCategoriesResponse = await PerformRequest({
      route: Endpoints.GetProductCategory,
      method: "POST",
      data: { token: token },
    });
    console.log(r);
    if (r.data && r.data.status === "success") {
      setCategories(r.data.data ?? []);
    }
  };
  const getCart = async () => {
    const token = Cookies.get("token");
    const r: GetCartResponse = await PerformRequest({
      route: Endpoints.GetUserCart,
      method: "POST",
      data: { token: token },
    });
    console.log(r);
    if (r.data && r.data.status === "success") {
      setCart(r.data.data);
    }
  };

  useEffect(() => {
    getUser();
    getCart();
    getCategories();
    getProducts({ page: 1, limit: 15 });
  }, []);

  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("user_store_id");
    navigate("/login");
  };
  return (
    <AppContext.Provider
      value={{
        user: user,
        categories: categories,
        logout: logout,
        cart: cart,
        products: products,
        getProducts: getProducts,
        reloadCart: getCart,
        productCount: productCount,
      }}
    >
      <Navbar />
      <Routes>
        <Route index path="/" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/team" element={<Team />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </AppContext.Provider>
  );
}
export { AppContext };
