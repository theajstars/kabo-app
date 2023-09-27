import React, { useState, useEffect, useContext, useRef } from "react";

import { useNavigate, Link } from "react-router-dom";

import { Button, Box, TextField, MenuItem } from "@mui/material";
import { useToasts } from "react-toast-notifications";
import Cookies from "js-cookie";

import Logo from "../../Assets/IMG/Logo.png";

import "./styles.scss";
import { PerformRequest, UploadFile } from "../../Lib/PerformRequest";
import { Endpoints } from "../../Lib/Endpoints";
import { Product, Store, Category, SubCategory } from "../../Lib/Types";
import {
  CreateProductResponse,
  GetCategoriesResponse,
  GetStoreListResponse,
  GetSubCategoriesResponse,
  UploadFileResponse,
} from "../../Lib/Responses";
import MegaLoader from "../../Misc/MegaLoader";
import { AppContext } from "../DashboardContainer";
import ProgressCircle from "../../Misc/ProgressCircle";

interface NewProductProps {
  name: string;
  amount?: number;
  quantity?: number;
  weight?: number;

  category?: string;
  subCategory?: string;
  details?: string;
  main_photo?: string;
}
export default function NewProduct() {
  const navigate = useNavigate();
  const productImageRef = useRef<HTMLInputElement>(null);
  const userContext = useContext(AppContext);
  const { addToast, removeAllToasts } = useToasts();
  const [isLoading, setLoading] = useState<boolean>(false);

  const [storeList, setStoreList] = useState<Store[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

  const [product, setProduct] = useState<NewProductProps>({
    name: "",

    category: "",
    subCategory: "",
    main_photo: "",
  });
  const [productFile, setProductFile] = useState<File>();
  const [isImageUploading, setImageUploading] = useState<boolean>(false);
  const token = Cookies.get("token");

  const getCategories = async () => {
    const r: GetCategoriesResponse = await PerformRequest({
      route: Endpoints.GetProductCategory,
      method: "POST",
      data: { token },
    });
    if (r.data && r.data.data) {
      setCategories(r.data.data);
    }
  };
  const getSubCategories = async (categoryID: string) => {
    const r: GetSubCategoriesResponse = await PerformRequest({
      route: Endpoints.GetSubCategory,
      method: "POST",
      data: { token, category_id: categoryID, sub_category_id: "" },
    });
    if (r.data && r.data.data) {
      setSubCategories(r.data.data);
    }
  };
  useEffect(() => {
    getCategories();
  }, []);

  const ClearForm = () => {
    setLoading(true);
    setProductFile(undefined);
    setProduct({
      name: "",
      amount: 0,
      quantity: 0,
      weight: 0,
      details: "",
      category: "",
      subCategory: "",
      main_photo: "",
    });
    setLoading(false);
  };
  const CreateNewProduct = async () => {
    const {
      name,
      category,
      subCategory,
      main_photo,
      amount,
      quantity,
      weight,
      details,
    } = product;
    if (
      name.length === 0 ||
      category?.length === 0 ||
      subCategory?.length === 0 ||
      main_photo?.length === 0 ||
      details?.length === 0 ||
      !amount ||
      !weight ||
      !quantity ||
      amount < 1 ||
      weight < 0
    ) {
      addToast("Please fill the form correctly", { appearance: "warning" });
    } else {
      const data = {
        token: token,
        store_id: userContext?.store?.store_id,
        name,
        quantity,
        amount,
        details,
        weight,
        category_id: category,
        sub_category_id: subCategory,
        main_photo,
        active: "Yes",
      };
      const r: CreateProductResponse = await PerformRequest({
        method: "POST",
        data,
        route: Endpoints.CreateNewProduct,
      });
      if (r.data && r.data.status === "success") {
        addToast(r.data.message, { appearance: "success" });
        ClearForm();
      } else {
        addToast("An error occurred", { appearance: "error" });
      }
    }
  };
  return (
    <div className="new-product-container flex-col width-100">
      <input
        type="file"
        accept="image/*"
        ref={productImageRef}
        onChange={(e) => {
          const FileList = e.target.files ?? [];
          const file = FileList[0];
          if (file) {
            removeAllToasts();
            const type = file.type;
            const fileType = type.substring(0, type.indexOf("/")); //Should return "image"
            if (fileType !== "image") {
              addToast("Please upload an image file!", {
                appearance: "warning",
              });
            } else {
              setImageUploading(true);
              removeAllToasts();
              UploadFile(file)
                .catch(() => {
                  setImageUploading(false);
                })
                .then((res: UploadFileResponse) => {
                  if (res.data && res.data.status === "success") {
                    setProductFile(file);
                    setProduct({ ...product, main_photo: res.data.file_url });
                  }
                  if (res.data && res.data.status === "failed") {
                    addToast(res.data.message, { appearance: "error" });
                  }
                })
                .finally(() => {
                  setImageUploading(false);
                });
            }
          }
        }}
        className="display-none"
      />
      {userContext ? (
        <>
          <div className="top width-100 flex-col">
            <div className="flex-row width-100 align-center justify-between">
              <span className="text-dark fw-500 px-20">New Product</span>
              <Button
                href="/dashboard/products"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/dashboard/products");
                }}
                sx={{ height: "35px", fontSize: "12px" }}
                variant="contained"
                type="button"
              >
                Back to Products
              </Button>
            </div>
          </div>

          <Box
            component="form"
            sx={{
              "& > :not(style)": { m: 1, width: "25ch" },
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              label="Name"
              spellCheck={false}
              variant="outlined"
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
            />
            <TextField
              variant="outlined"
              label="Amount"
              type="number"
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
              value={product.amount}
              onChange={(e) =>
                setProduct({ ...product, amount: parseInt(e.target.value) })
              }
            />
          </Box>
          <Box
            component="form"
            sx={{
              "& > :not(style)": { m: 1, width: "25ch" },
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              variant="outlined"
              label="Quantity"
              type="number"
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
              value={product.quantity}
              onChange={(e) =>
                setProduct({ ...product, quantity: parseInt(e.target.value) })
              }
            />
            <TextField
              variant="outlined"
              label="Weight (KG)"
              type="number"
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
              value={product.weight}
              onChange={(e) =>
                setProduct({ ...product, weight: parseInt(e.target.value) })
              }
            />
          </Box>
          <TextField
            select
            disabled
            label="Store"
            sx={{
              width: "51.5ch",
            }}
            value={userContext.store?.store_id}
          >
            <MenuItem value={userContext.store?.store_id}>
              {userContext.store?.name}
            </MenuItem>
          </TextField>
          <TextField
            spellCheck={false}
            onChange={(e) => {
              setProduct({ ...product, details: e.target.value });
              console.log(e.target.value);
            }}
            label="Product Details"
            value={product.details}
            rows={4}
            sx={{
              m: 1,
              width: "51.5ch",
            }}
            multiline
          />
          <Box
            component="form"
            sx={{
              "& > :not(style)": { m: 1, width: "25ch" },
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              select
              label="Category"
              value={product.category}
              onChange={(e) => {
                setProduct({ ...product, category: e.target.value });
                if (e.target.value && e.target.value.length > 0) {
                  getSubCategories(e.target.value);
                }
              }}
            >
              {categories.map((category) => (
                <MenuItem
                  key={category.category_id}
                  value={category.category_id}
                >
                  {category.category_name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Sub Category"
              disabled={product.category?.length === 0}
              value={product.subCategory}
              onChange={(e) => {
                setProduct({ ...product, subCategory: e.target.value });
                console.log(e.target.value);
              }}
            >
              {subCategories.map((subcat) => (
                <MenuItem
                  key={subcat.sub_category_id}
                  value={subcat.sub_category_id}
                >
                  {subcat.sub_category_name}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <br />
          <Box
            component="form"
            sx={{
              "& > :not(style)": { m: 1, width: "51ch" },
            }}
            noValidate
            autoComplete="off"
          >
            <div className="flex-col width-100 align-center align-start">
              <div className="pointer flex-row align-center">
                {productFile && (
                  <img
                    src={URL.createObjectURL(productFile)}
                    alt=""
                    className="product-image"
                  />
                )}{" "}
                &nbsp; {isImageUploading && <ProgressCircle />}
              </div>
              &nbsp;
              <div className="flex-row align-center">
                <span
                  className="pointer text-blue-default"
                  onClick={() => productImageRef.current?.click()}
                >
                  Select Image
                </span>
              </div>
            </div>
          </Box>
          <br />
          <Button
            onClick={CreateNewProduct}
            sx={{ height: "35px", width: "150px", fontSize: "12px" }}
            variant="contained"
            type="button"
            disabled={isLoading || isImageUploading}
          >
            {isLoading || isImageUploading ? <ProgressCircle /> : "Create"}
          </Button>
          <br />
        </>
      ) : (
        <MegaLoader />
      )}
    </div>
  );
}
