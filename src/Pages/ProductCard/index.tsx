import { useState, useEffect, useContext } from "react";
import { useToasts } from "react-toast-notifications";

import DefaultImage from "../../Assets/IMG/DefaultProductImage.png";
import { Product } from "../../Lib/Types";

import "./styles.scss";

interface ProductCardProps {
  product: Product;
}
export default function ProductCard({ product }: ProductCardProps) {
  const { addToast, removeAllToasts } = useToasts();

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
  return (
    <div className="product-card-container flex-col align-center justify-between">
      <img src={getProductImage()} alt="" className="image" />
      <span
        className={`product-name width-100 align-start flex-row ${
          product.name.length > 30 ? "px-13" : "px-15"
        }`}
      >
        {product.name}
      </span>
      <div className="flex-row width-100 align-center justify-between">
        <span className="price px-17 text-dark">
          ₦{(155000).toLocaleString()}
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
    </div>
  );
}
