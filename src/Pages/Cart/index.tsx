import { useState, useEffect, useContext } from "react";

import { Container, Alert } from "@mui/material";
import Cookies from "js-cookie";
import { useToasts } from "react-toast-notifications";

import { Endpoints } from "../../Lib/Endpoints";
import { getFinancialValueFromNumeric } from "../../Lib/Methods";
import { PerformRequest } from "../../Lib/PerformRequest";
import { Product } from "../../Lib/Types";

import DefaultImage from "../../Assets/IMG/DefaultProductImage.png";

import "./styles.scss";
import { DefaultResponse } from "../../Lib/Responses";
import { AppContext } from "../DashboardContainer";
import ProductCard from "../ProductCard";

export default function Cart() {
  const { addToast, removeAllToasts } = useToasts();
  const userContext = useContext(AppContext);
  const [isProductModalVisible, setProductModalVisible] =
    useState<boolean>(false);

  const [isLoading, setLoading] = useState<boolean>(false);

  const defaultProduct: Product = {
    id: "",
    name: "",
    amount: "",
    constant_amount: "",
    details: "",
    active: "Yes",
    category_id: "",
    category_name: "",
    sub_category_id: "",
    sub_category_name: "",
    quantity: "",
    weight: "",
    main_photo: "",
    location: "",
    photo_a: "",
    photo_b: "",
    photo_c: "",
    photo_d: "",
    store_id: "",
    store_name: "",
  };
  return (
    <Container
      maxWidth="lg"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {userContext && userContext.cart && (
        <div className="cart-container flex-col align-center justify-between">
          <div className="flex-row width-100">
            <span className="px-20 fw-600 text-dark ">Cart</span>
          </div>
          {userContext.cart.product && userContext.cart.product.length > 0 ? (
            <div className="products flex-col">
              {userContext.cart.product.map((product) => {
                return (
                  <ProductCard
                    product={defaultProduct}
                    disabled={isLoading}
                    cartProduct={product}
                    isCartProduct={true}
                  />
                );
              })}
            </div>
          ) : (
            <>
              <br />
              <Alert severity="info">
                Please add some items to your cart to checkout
              </Alert>
            </>
          )}
        </div>
      )}
    </Container>
  );
}
