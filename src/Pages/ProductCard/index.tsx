import { useState, useEffect, useContext } from "react";
import { useToasts } from "react-toast-notifications";

import DefaultImage from "../../Assets/IMG/beans.jpg";

import "./styles.scss";

export default function ProductCard() {
  const { addToast, removeAllToasts } = useToasts();

  const product = {
    name: "Bean Chilli Pilly Bean Chilli dilly",
    store: "Store Braavo",
  };
  console.log(product.name.length);
  console.log(product.store.length);
  return (
    <div className="product-card-container flex-col align-center justify-between">
      <img src={DefaultImage} alt="" className="image" />
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
          className={`name ${product.store.length > 15 ? "px-10" : "px-15"}`}
        >
          {product.store}
        </span>
      </div>
    </div>
  );
}
