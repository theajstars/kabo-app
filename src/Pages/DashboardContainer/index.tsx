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
  Bank,
  Cart as CartType,
  Category,
  Product,
  SavedItem,
  Store,
  User,
  Wallet as WalletType,
} from "../../Lib/Types";

import "./styles.scss";
import { PerformRequest } from "../../Lib/PerformRequest";
import { Endpoints } from "../../Lib/Endpoints";
import {
  GetBanksResponse,
  GetCartResponse,
  GetCategoriesResponse,
  GetProductsResponse,
  GetSavedItemsResponse,
  GetStoreListResponse,
  GetWalletResponse,
  LoginResponse,
} from "../../Lib/Responses";
import MegaLoader from "../../Misc/MegaLoader";
import Products from "../Products";
import Dashboard from "../Dashboard";
import Navbar from "../Navbar";

import Orders from "../Orders";
import Team from "../Team";
import Cart from "../Cart";
import Stores from "../Stores";
import SingleStore from "../SingleStore";
import SavedItems from "../SavedItems";
import Profile from "../Profile";
import Wallet from "../Wallet";
import Footer from "../Footer";
import BottomTabs from "../BottomTabs";

interface FetchProductProps {
  page: number;
  limit: number;
  category_id?: string;
}
interface FetchSavedProps {
  page?: number;
  limit?: number;
}
interface GetStoresProps {
  page: number;
  limit: number;
}
interface AppContextProps {
  user: User | null;
  banks: Bank[] | [];
  logout: () => void;
  getUser: () => void;
  cart: CartType | null;
  reloadCart?: () => void;
  categories: Category[] | [];
  products: Product[] | [];
  productCount: number;
  getProducts?: ({ page, limit }: FetchProductProps) => void;
  stores: Store[] | [];
  getStores?: ({ page, limit }: FetchProductProps) => void;
  storeCount: number;

  savedItems: SavedItem[] | [];
  wallet: WalletType | null;
  getSavedItems?: ({ page, limit }: FetchSavedProps) => void;
  savedItemsCount: number;
}
const AppContext = createContext<AppContextProps | null>(null);
export default function DashboardContainer() {
  const navigate = useNavigate();
  const { addToast, removeAllToasts } = useToasts();
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartType | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [storeCount, setStoreCount] = useState<number>(0);

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [wallet, setWallet] = useState<WalletType | null>(null);
  const [productCount, setProductCount] = useState<number>(0);

  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [savedItemsCount, setSavedItemsCount] = useState<number>(0);
  const [banks, setBanks] = useState<Bank[]>([]);

  const getUser = async () => {
    const token = Cookies.get("token");
    if (!token) {
      navigate("/login");
    }
    const r: LoginResponse = await PerformRequest({
      route: Endpoints.GetUserDetails,
      method: "POST",
      data: { token: token },
    }).catch(() => {});
    console.log(r);
    if (r.data && r.data.data) {
      setUser(r.data.data);
    } else {
      navigate("/login");
    }
    const r2: GetWalletResponse = await PerformRequest({
      route: Endpoints.GetWalletDetails,
      method: "POST",
      data: {
        token,
        account: "customer",
      },
    });
    if (r2.data && r2.data.data) {
      setWallet(r2.data.data[0] ?? null);
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
  const getBanks = async () => {
    const token = Cookies.get("token");
    const r: GetBanksResponse = await PerformRequest({
      route: Endpoints.GetBanks,
      method: "POST",
      data: { token: token },
    });
    console.log(r);
    if (r.data && r.data.status === "success") {
      setBanks(r.data.data ?? []);
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
  const getStores = async ({ page, limit }: GetStoresProps) => {
    const token = Cookies.get("token");
    const r: GetStoreListResponse = await PerformRequest({
      route: Endpoints.GetStoreList,
      method: "POST",
      data: {
        token: token,
        page: page,
        limit: limit,
      },
    }).catch(() => {});
    if (r.data && r.data.data) {
      setStores(r.data.data);
      setStoreCount(r.data.counts);
    }
  };

  const getSavedItems = async ({ page, limit }: FetchSavedProps) => {
    const token = Cookies.get("token");
    const data =
      page && limit
        ? {
            token: token,
            page: page,
            limit: limit,
          }
        : {
            token: token,
          };
    const r: GetSavedItemsResponse = await PerformRequest({
      route: Endpoints.GetSavedItems,
      method: "POST",
      data: data,
    });
    console.log(r);
    if (r.data && r.data.status === "success") {
      setSavedItems(r.data.data ?? []);
      setSavedItemsCount(r.data.counts ?? 0);
    }
  };
  useEffect(() => {
    getUser();
    getCart();
    getBanks();
    getSavedItems({ page: 1, limit: 15 });
    getCategories();
    getProducts({ page: 1, limit: 15 });
    getStores({ page: 1, limit: 10 });
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
        getUser: getUser,
        logout: logout,
        categories: categories,
        cart: cart,
        reloadCart: getCart,
        products: products,
        getProducts: getProducts,
        productCount: productCount,
        stores: stores,
        getStores: getStores,
        wallet: wallet,
        storeCount: storeCount,
        savedItems: savedItems,
        getSavedItems: getSavedItems,
        savedItemsCount: savedItemsCount,
        banks: banks,
      }}
    >
      <Navbar />
      <Routes>
        <Route index path="/" element={<Dashboard />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/saved" element={<SavedItems />} />
        <Route path="/stores" element={<Stores />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/store/:storeID" element={<SingleStore />} />
      </Routes>
      <BottomTabs />
      {/* <Footer /> */}
    </AppContext.Provider>
  );
}
export { AppContext };
