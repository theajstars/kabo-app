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

  return (
    <div className="dashboard-container flex-col width-100">
      {userContext?.user ? (
        <>
          <img src={Logo} alt="" className="logo" />
          {userContext.products.map((product, index) => {
            return <ProductCard product={product} />;
          })}
        </>
      ) : (
        <MegaLoader />
      )}
    </div>
  );
}
