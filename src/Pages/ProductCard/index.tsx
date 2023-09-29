import { useState, useEffect, useContext } from "react";

import { Link } from "react-router-dom";

import { Modal, Skeleton, Stack } from "@mui/material";
import Cookies from "js-cookie";
import { useToasts } from "react-toast-notifications";

import { Endpoints } from "../../Lib/Endpoints";
import { getFinancialValueFromNumeric } from "../../Lib/Methods";
import { PerformRequest } from "../../Lib/PerformRequest";
import { Product, SimpleProduct } from "../../Lib/Types";

import DefaultImage from "../../Assets/IMG/DefaultProductImage.png";

import "./styles.scss";
import { DefaultResponse } from "../../Lib/Responses";
import { AppContext } from "../DashboardContainer";

interface ProductCardProps {
  product: Product;
  disabled: boolean;
  isCartProduct?: boolean;
  cartProduct?: SimpleProduct;
}
export default function ProductCard({
  product,
  disabled,
  isCartProduct,
  cartProduct,
}: ProductCardProps) {
  const { addToast, removeAllToasts } = useToasts();
  const userContext = useContext(AppContext);
  const [isProductModalVisible, setProductModalVisible] =
    useState<boolean>(false);

  const [isLoading, setLoading] = useState<boolean>(false);

  const getProductImage = () => {
    const { main_photo } = product;
    if (main_photo) {
      if (main_photo.length > 0) {
        return main_photo;
      }
      return DefaultImage;
    }
    return DefaultImage;
  };

  const getProductInCart = () => {
    if (isCartProduct) {
      const quantity = cartProduct?.quantity;
      return parseInt(quantity?.toString() ?? "0");
    } else {
      const cartProducts = userContext?.cart?.product;
      const findInCart = cartProducts?.filter((p) => p.id === product.id);
      const noInCart = findInCart
        ? findInCart.length > 0
          ? findInCart[0]?.quantity ?? 0
          : 0
        : 0;
      return parseInt(noInCart.toString());
    }
  };

  const AddProductToCart = async () => {
    if (isCartProduct) {
      console.log(cartProduct);
      removeAllToasts();
      const token = Cookies.get("token");
      setLoading(true);
      const r: DefaultResponse = await PerformRequest({
        route: Endpoints.AddProductToCart,
        method: "POST",
        data: {
          token,
          id: cartProduct?.id,
          quantity: 1,
        },
      }).catch(() => [setLoading(false)]);
      setLoading(false);
      if (r && r.data.status === "success") {
        addToast("Product Added", { appearance: "success" });
        if (userContext && userContext.reloadCart) {
          userContext.reloadCart();
        }
      } else {
        addToast(r.data.message, { appearance: "error" });
      }
    } else {
      console.log(product);
      removeAllToasts();
      const token = Cookies.get("token");
      setLoading(true);
      const r: DefaultResponse = await PerformRequest({
        route: Endpoints.AddProductToCart,
        method: "POST",
        data: {
          token,
          id: product.id,
          quantity: 1,
        },
      }).catch(() => [setLoading(false)]);
      setLoading(false);
      if (r && r.data.status === "success") {
        addToast("Product Added", { appearance: "success" });
        if (userContext && userContext.reloadCart) {
          userContext.reloadCart();
        }
      } else {
        addToast(r.data.message, { appearance: "error" });
      }
    }
  };
  const RemoveProductFromCart = async () => {
    if (isCartProduct) {
      console.log(cartProduct);
      removeAllToasts();
      setLoading(true);

      const token = Cookies.get("token");
      const poid = cartProduct?.poid;
      const r: DefaultResponse = await PerformRequest({
        route:
          getProductInCart() === 1
            ? Endpoints.RemoveProductFromCart
            : Endpoints.UpdateCart,
        method: "POST",
        data: {
          token,
          poid: [poid],
          quantity: getProductInCart() === 1 ? [0] : [getProductInCart() - 1],
        },
      }).catch(() => [setLoading(false)]);
      setLoading(false);

      if (r && r.data.status === "success") {
        addToast("Product Removed", { appearance: "success" });
        if (userContext && userContext.reloadCart) {
          userContext.reloadCart();
        }
      } else {
        addToast(r.data.message, { appearance: "error" });
      }
    } else {
      console.log(product);
      removeAllToasts();
      setLoading(true);

      const token = Cookies.get("token");
      const poid = userContext?.cart?.product?.filter(
        (p) => p.id === product.id
      )[0].poid;
      const r: DefaultResponse = await PerformRequest({
        route:
          getProductInCart() === 1
            ? Endpoints.RemoveProductFromCart
            : Endpoints.UpdateCart,
        method: "POST",
        data: {
          token,
          poid: [poid],
          quantity: getProductInCart() === 1 ? [0] : [getProductInCart() - 1],
        },
      }).catch(() => [setLoading(false)]);
      setLoading(false);

      if (r && r.data.status === "success") {
        addToast("Product Removed", { appearance: "success" });
        if (userContext && userContext.reloadCart) {
          userContext.reloadCart();
        }
      } else {
        addToast(r.data.message, { appearance: "error" });
      }
    }
  };

  const DeleteProductFromCart = async () => {
    removeAllToasts();
    setLoading(true);

    const token = Cookies.get("token");
    const poid = cartProduct?.poid;
    const r: DefaultResponse = await PerformRequest({
      route: Endpoints.RemoveProductFromCart,
      method: "POST",
      data: {
        token,
        poid: [poid],
      },
    }).catch(() => [setLoading(false)]);
    setLoading(false);

    if (r && r.data.status === "success") {
      addToast("Product Removed", { appearance: "success" });
      if (userContext && userContext.reloadCart) {
        userContext.reloadCart();
      }
    } else {
      addToast(r.data.message, { appearance: "error" });
    }
  };
  return (
    <>
      {isCartProduct ? (
        <div className="cart-product flex-row align-start justify-between">
          {cartProduct && (
            <>
              <img src={cartProduct.main_photo} alt="" className="image" />
              <div className="details flex-col">
                <span className="text-gray px-14 fw-500">
                  {cartProduct.name}
                </span>
                <span className="text-dark fw-600 px-20">
                  ₦{getFinancialValueFromNumeric(cartProduct.amount)}
                </span>
                <div className="flex-row align-center width-100 justify-between actions">
                  <button
                    disabled={isLoading}
                    className="action flex-row align-center justify-center"
                    onClick={() => RemoveProductFromCart()}
                  >
                    <i className="far fa-minus" />
                  </button>
                  <span
                    className="quantity px-16 fw-600 text-dark"
                    style={{
                      opacity: isLoading ? 0.5 : 1,
                    }}
                  >
                    {cartProduct.quantity}
                  </span>
                  <button
                    disabled={isLoading}
                    className="action flex-row align-center justify-center"
                    onClick={() => AddProductToCart()}
                  >
                    <i className="far fa-plus" />
                  </button>
                </div>
              </div>
              <i
                className="far fa-times pointer text-gray"
                onClick={() => {
                  DeleteProductFromCart();
                }}
              />
            </>
          )}
        </div>
      ) : (
        <div className="product-card-container flex-col align-center justify-between">
          {disabled ? (
            <Stack spacing={1}>
              <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
              <Skeleton variant="circular" width={40} height={40} />
              <Skeleton variant="rectangular" width={210} height={60} />
              <Skeleton variant="rounded" width={210} height={60} />
            </Stack>
          ) : (
            <>
              <img src={getProductImage()} alt="" className="image" />
              <span
                className={`product-name width-100 align-start flex-row ${
                  product.name.length > 30 ? "px-13" : "px-15"
                }`}
                onClick={() => {
                  setProductModalVisible(true);
                }}
              >
                {product.name}
              </span>
              <div className="flex-row width-100 align-center justify-between">
                <span className="price px-17 text-dark">
                  ₦
                  {parseInt(product.amount).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
                <div className="flex-row align-center justify-center save">
                  <span className="icon">
                    <i className="far fa-heart" />
                  </span>
                </div>
              </div>
              <div className="flex-row align-center store">
                <span className="icon">
                  <i className="far fa-store" />
                </span>
                <span
                  className={`name capitalize ${
                    product.store_name.length > 15 ? "px-10" : "px-15"
                  }`}
                >
                  {product.store_name}
                </span>
              </div>
            </>
          )}
          <Modal
            open={isProductModalVisible}
            onClose={() => {
              setProductModalVisible(false);
            }}
          >
            <div className="product-modal flex-col">
              <img src={product.main_photo} alt="" className="image" />
              <div className="flex-row details align-center justify-between width-100">
                <div className="item flex-col align-center">
                  <span className="px-15 fw-600 text-dark">{product.name}</span>
                  <span className="px-12 text-dark-secondary">Name</span>
                </div>
                <div className="item flex-col align-center">
                  <span className="px-15 fw-600 text-dark">
                    ₦{getFinancialValueFromNumeric(product.amount)}
                  </span>
                  <span className="px-12 text-dark-secondary">Price</span>
                </div>
                <div className="item flex-col align-center">
                  <span className="px-15 fw-600 text-dark">
                    {product.store_name}
                  </span>
                  <span className="px-12 text-dark-secondary">Store</span>
                </div>
              </div>
              <div className="flex-row width-100 align-start justify-between body">
                <div className="flex-col toggle-cart align-center">
                  <button
                    disabled={isLoading}
                    className="action flex-row align-center justify-center pointer"
                    onClick={() => AddProductToCart()}
                  >
                    <i className="far fa-plus" />
                  </button>
                  <span
                    className="px-19 fw-600 amount"
                    style={{
                      opacity: isLoading ? 0.5 : 1,
                    }}
                  >
                    {getProductInCart()}
                  </span>
                  <button
                    disabled={isLoading || getProductInCart() === 0}
                    className="action flex-row align-center justify-center pointer"
                    onClick={() => RemoveProductFromCart()}
                  >
                    <i className="far fa-minus" />
                  </button>
                </div>
                &nbsp; &nbsp;
                <span className="description">{product.details}</span>
              </div>
              <div className="flex-row align-center justify-end  width-100">
                <div className="save flex-row align-center">
                  <i className="far fa-heart " />
                  &nbsp;
                  <span className=" px-14">Save for Later</span>
                </div>
              </div>
            </div>
          </Modal>
        </div>
      )}
    </>
  );
}
