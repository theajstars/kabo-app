import { useState, useEffect, useContext } from "react";

import { Container, Alert, Divider, Button } from "@mui/material";
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
import ProgressCircle from "../../Misc/ProgressCircle";
import MegaLoader from "../../Misc/MegaLoader";

export default function Cart() {
  const { addToast, removeAllToasts } = useToasts();
  const userContext = useContext(AppContext);
  const [isProductModalVisible, setProductModalVisible] =
    useState<boolean>(false);

  const [isLoading, setLoading] = useState<boolean>(false);
  const [shippingAddress, setShippingAddress] = useState<string>("");
  const [isShippingAddressPresent, setShippingAddressPresent] =
    useState<boolean>(false);

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

  const AddShipping = async () => {
    removeAllToasts();
    if (shippingAddress.length === 0) {
      addToast("Please provide an address!", { appearance: "info" });
    } else {
      setLoading(true);
      const r: DefaultResponse = await PerformRequest({
        method: "POST",
        route: Endpoints.AddShippingInformation,
        data: {
          token: Cookies.get("token"),
          details: shippingAddress,
          info: shippingAddress,
        },
      }).catch(() => {
        setLoading(false);
      });
      setLoading(false);
      console.log(r);
      if (r && r.data) {
        setShippingAddressPresent(r.data.status === "success");
        addToast(r.data.message, {
          appearance: r.data.status === "success" ? "success" : "error",
        });
      }
    }
  };
  const CheckoutCart = async () => {
    if (!isShippingAddressPresent) {
      addToast("You must have an address!", { appearance: "error" });
    } else {
      setLoading(true);
      const r = await PerformRequest({
        method: "POST",
        route: Endpoints.CheckoutCart,
        data: {
          token: Cookies.get("token"),
        },
      }).catch(() => {
        setLoading(false);
      });
      console.log(r);
      setLoading(false);
    }
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
      {userContext && userContext.cart ? (
        <div className="cart-container flex-col align-center justify-between">
          <div className="flex-row width-100">
            <span className="px-20 fw-600 text-dark ">Cart</span>
          </div>
          {userContext.cart.product && userContext.cart.product.length > 0 ? (
            <>
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
              <div className="flex-row align-center width-100 justify-between tag">
                <span className="text-dark px-12">Cart</span>
                <span className="text-dark px-15">
                  ₦
                  {getFinancialValueFromNumeric(
                    userContext.cart.amount.product
                  )}
                </span>
              </div>
              <div className="flex-row align-center width-100 justify-between tag">
                <span className="text-dark px-12">VAT</span>
                <span className="text-dark px-15">
                  ₦{getFinancialValueFromNumeric(userContext.cart.amount.vat)}
                </span>
              </div>
              <div className="flex-row align-center width-100 justify-between tag">
                <span className="text-dark px-12">Shipping</span>
                <span className="text-dark px-15">
                  ₦
                  {getFinancialValueFromNumeric(
                    userContext.cart.amount.shipping
                  )}
                </span>
              </div>
              <div className="flex-row align-center width-100 justify-between tag">
                <span className="text-dark px-12">Processor Fee</span>
                <span className="text-dark px-15">
                  ₦
                  {getFinancialValueFromNumeric(
                    userContext.cart.amount.processor
                  )}
                </span>
              </div>
              <Divider sx={{ width: "100%" }} />
              <div className="flex-row align-center width-100 justify-between tag">
                <span className="text-dark px-12">Total Price</span>
                <span className="text-dark px-17 fw-500">
                  ₦{getFinancialValueFromNumeric(userContext.cart.amount.total)}
                </span>
              </div>
              <div className="flex-row width-100">
                <span className="px-13 text-dark">Shipping Address</span>
              </div>
              <textarea
                disabled={isShippingAddressPresent || isLoading}
                style={{
                  opacity: isShippingAddressPresent ? 0.5 : 1,
                }}
                className="address"
                name="address"
                id="address"
                placeholder="Input Address..."
                spellCheck={false}
                value={shippingAddress}
                onChange={(e) => {
                  setShippingAddress(e.target.value);
                }}
              />
              <Button
                disabled={isLoading}
                onClick={() => {
                  if (isShippingAddressPresent) {
                    CheckoutCart();
                  } else {
                    AddShipping();
                  }
                }}
                variant="contained"
                color="primary"
                sx={{
                  width: "120px",
                  height: "35px",
                  mt: "10px",
                }}
              >
                {isLoading ? (
                  <ProgressCircle />
                ) : isShippingAddressPresent ? (
                  "Checkout"
                ) : (
                  "Submit"
                )}
              </Button>
            </>
          ) : (
            <>
              <br />
              <Alert severity="info">
                Please add some items to your cart to checkout
              </Alert>
            </>
          )}
        </div>
      ) : (
        <MegaLoader />
      )}
    </Container>
  );
}
