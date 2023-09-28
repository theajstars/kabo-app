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

export default function Cart() {
  const { addToast, removeAllToasts } = useToasts();
  const userContext = useContext(AppContext);
  const [isProductModalVisible, setProductModalVisible] =
    useState<boolean>(false);

  const [isLoading, setLoading] = useState<boolean>(false);

  return (
    <Container maxWidth="lg">
      {userContext && userContext.cart && (
        <div className="cart-container flex-col align-center justify-between">
          {userContext.cart.product && userContext.cart.product.length > 0 ? (
            <div className="products">
              {userContext.cart.product.map((product) => {
                return (
                  <div className="product flex-row">
                    <img src={product.main_photo} alt="" className="image" />
                    <div className="details flex-col">
                      <span className="text-gray px-14">{product.name}</span>
                      <span className="text-gray px-14">
                        ₦{getFinancialValueFromNumeric(product.amount)}
                      </span>
                      <div className="flex-row align-center width-100 justify-between actions">
                        <span className="action flex-row align-center justify-center">
                          <i className="far fa-minus" />
                        </span>
                        <span className="quantity px-14 fw-600 text-dark">
                          {product.quantity}
                        </span>
                        <span className="action flex-row align-center justify-center">
                          <i className="far fa-plus" />
                        </span>
                      </div>
                    </div>
                    <i className="far fa-times pointer text-gray" />
                  </div>
                );
              })}
            </div>
          ) : (
            <Alert severity="info">
              Please add some items to your cart to checkout
            </Alert>
          )}
        </div>
      )}
    </Container>
  );
}
