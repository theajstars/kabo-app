import React, { useState, useEffect, useContext } from "react";

import { useNavigate, Link } from "react-router-dom";

import { useToasts } from "react-toast-notifications";
import Cookies from "js-cookie";

import { Store, User } from "../../Lib/Types";

import ProductsIcon from "../../Assets/IMG/ProductsIconDark.svg";
import OrdersIcon from "../../Assets/IMG/OrdersIconDark.svg";

import Logo from "../../Assets/IMG/Logo.png";

import "./styles.scss";
import { PerformRequest } from "../../Lib/PerformRequest";
import MegaLoader from "../../Misc/MegaLoader";
import { AppContext } from "../DashboardContainer";
import ProductCard from "../ProductCard";

export default function Dashboard() {
  const navigate = useNavigate();
  const { addToast, removeAllToasts } = useToasts();
  const userContext = useContext(AppContext);
  const user = userContext?.user;
  const userStore = userContext?.store;

  return (
    <div className="dashboard-container flex-col width-100">
      <ProductCard />
      {userContext?.user ? (
        <>
          <img src={Logo} alt="" className="logo" />
          <div className="profile flex-row align-center width-100 text-dark">
            <div className="item flex-row align-center">
              <span className="icon px-18 flex-row align-center justify-center">
                <i className="far fa-user" />
              </span>
              <span className="tag px-14">
                {user?.lastname} {user?.othernames}
              </span>
            </div>
            <div className="item flex-row align-center">
              <span className="icon px-18 flex-row align-center justify-center">
                <i className="far fa-store" />
              </span>
              <span className="tag px-14">{userStore?.name}</span>
            </div>
            {/* <div className="item flex-row align-center">
              <span className="icon px-18 flex-row align-center justify-center">
                <i className="far fa-user-tie" />
              </span>
              <span className="tag px-14">{user.email}</span>
            </div> */}
          </div>
          <div className="menu flex-row align-center">
            <div className="item justify-between flex-col">
              <img src={OrdersIcon} alt="" />
              <div className="details flex-col width-100 align-start">
                <span className="px-19 fw-600 text-dark">Orders</span>
                <span className="px-15 text-dark">
                  View delivered, failed and successful orders
                </span>
                <Link
                  className="flex-row align-center justify-center"
                  to="/dashboard/orders"
                >
                  View
                </Link>
              </div>
            </div>
            <div className="item justify-between flex-col">
              <img src={ProductsIcon} alt="" />
              <div className="details flex-col width-100 align-start">
                <span className="px-19 fw-600 text-dark">Products</span>
                <span className="px-15 text-dark">
                  View catalogue of products
                </span>
                <Link
                  className="flex-row align-center justify-center"
                  to="/dashboard/products"
                >
                  View
                </Link>
              </div>
            </div>
          </div>
        </>
      ) : (
        <MegaLoader />
      )}
    </div>
  );
}
