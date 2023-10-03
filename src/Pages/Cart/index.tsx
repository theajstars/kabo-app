import { useState, useRef, useContext } from "react";

import { Container, Alert, Divider, Button } from "@mui/material";
import Cookies from "js-cookie";
import { useToasts } from "react-toast-notifications";
import { PaystackConsumer } from "react-paystack";

import { Endpoints } from "../../Lib/Endpoints";
import { getFinancialValueFromNumeric } from "../../Lib/Methods";
import { PerformRequest } from "../../Lib/PerformRequest";
import { PaystackConfigProps, Product } from "../../Lib/Types";

import DefaultImage from "../../Assets/IMG/DefaultProductImage.png";

import "./styles.scss";
import { CheckoutResponse, DefaultResponse } from "../../Lib/Responses";
import { AppContext } from "../DashboardContainer";
import ProductCard from "../ProductCard";
import ProgressCircle from "../../Misc/ProgressCircle";
import MegaLoader from "../../Misc/MegaLoader";
import { locations } from "../../Lib/appConfig";

export default function Cart() {
  const { addToast, removeAllToasts } = useToasts();
  const userContext = useContext(AppContext);
  const [isProductModalVisible, setProductModalVisible] =
    useState<boolean>(false);

  const [isLoading, setLoading] = useState<boolean>(false);

  const [shippingAddress, setShippingAddress] = useState<string>("");
  const [shippingLocation, setShippingLocation] = useState<string>("Ikeja");
  const [referenceCode, setReferenceCode] = useState<string>("");
  const [isPaymentShowing, setPaymentShowing] = useState<boolean>(true);
  const paystackButtonRef = useRef<HTMLButtonElement>(null);

  const [paystackConfig, setPaystackConfig] = useState<PaystackConfigProps>({
    reference: "",
    amount: 1110,
    publicKey: "pk_test_61f45043bcd6ef95901283089c329757a1fb776f",
    email: "atajiboyeo@gmail.com",
    text: "",
    onSuccess: () => {},
    onClose: () => {},
  });
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
          details: `${shippingAddress} ${shippingLocation}`,
          info: `${shippingAddress} ${shippingLocation}`,
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
      const r: CheckoutResponse = await PerformRequest({
        method: "POST",
        route: Endpoints.CheckoutCart,
        data: {
          token: Cookies.get("token"),
        },
      }).catch(() => {
        setLoading(false);
      });
      console.log(r);
      if (r.data && r.data.status == "success") {
        setReferenceCode(r.data.reference_code);
      }
      setLoading(false);
    }
  };
  const generatePaystackConfig = async () => {
    if (userContext && userContext.cart) {
      const amount = userContext.cart.amount.total;

      setLoading(true);

      const r: DefaultResponse = await PerformRequest({
        route: "",
        method: "POST",
        data: { amount: amount, method: "card", id: "" },
      }).catch(() => {
        setLoading(false);
      });

      console.log(r);
      if (r.data && r.data.status === "failed") {
        setLoading(false);
      }
      if (r.data.response_code === 200) {
      }
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
              <br />
              <div className="flex-row width-100">
                <span className="px-13 text-dark fw-500">Address Details</span>
              </div>
              <div className="flex-col select-container">
                <small className="px-12">&nbsp;Region</small>
                <select
                  disabled={isLoading}
                  className="select"
                  value={shippingLocation}
                  onChange={(e) => setShippingLocation(e.target.value)}
                >
                  {locations.map((location, index) => {
                    return <option value={location}>{location}</option>;
                  })}
                </select>
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
              {isPaymentShowing && (
                <PaystackConsumer {...paystackConfig}>
                  {({ initializePayment }) => (
                    <button
                      onClick={() =>
                        initializePayment(
                          paystackConfig?.onSuccess,
                          paystackConfig?.onClose
                        )
                      }
                      className="none"
                      ref={paystackButtonRef}
                    >
                      Paystack Consumer Implementation
                    </button>
                  )}
                </PaystackConsumer>
              )}
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
