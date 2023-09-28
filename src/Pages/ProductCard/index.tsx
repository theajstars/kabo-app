import { useState, useEffect, useContext } from "react";

import { Modal, Skeleton, Stack } from "@mui/material";
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

interface ProductCardProps {
  product: Product;
  disabled: boolean;
}
export default function ProductCard({ product, disabled }: ProductCardProps) {
  const { addToast, removeAllToasts } = useToasts();
  const userContext = useContext(AppContext);
  const [isProductModalVisible, setProductModalVisible] =
    useState<boolean>(false);
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

  const AddProductToCart = async () => {
    console.log(product);
    const token = Cookies.get("token");
    const r: DefaultResponse = await PerformRequest({
      route: Endpoints.AddProductToCart,
      method: "POST",
      data: {
        token,
        id: product.id,
        quantity: 1,
      },
    });
    if (r && r.data.status === "success") {
      addToast("Product Added", { appearance: "success" });
      if (userContext && userContext.reloadCart) {
        userContext.reloadCart();
      }
    } else {
      addToast(r.data.message, { appearance: "error" });
    }
  };
  return (
    <div className="product-card-container flex-col align-center justify-between">
      {disabled ? (
        <Stack spacing={1}>
          {/* For variant="text", adjust the height via font-size */}
          <Skeleton variant="text" sx={{ fontSize: "1rem" }} />

          {/* For other variants, adjust the size with `width` and `height` */}
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
              <span
                className="action flex-row align-center justify-center pointer"
                onClick={() => AddProductToCart()}
              >
                <i className="far fa-plus" />
              </span>
              <span className="px-19 fw-600 amount">0</span>
              <span className="action flex-row align-center justify-center pointer">
                <i className="far fa-minus" />
              </span>
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
  );
}
