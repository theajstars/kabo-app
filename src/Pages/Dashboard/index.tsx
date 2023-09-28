import React, { useState, useEffect, useContext } from "react";

import { useNavigate, Link } from "react-router-dom";

import { Alert, AlertTitle, Button, Grid, Pagination } from "@mui/material";
import { useToasts } from "react-toast-notifications";
import Cookies from "js-cookie";

import Logo from "../../Assets/IMG/Logo.png";

import "./styles.scss";
import MegaLoader from "../../Misc/MegaLoader";
import { AppContext } from "../DashboardContainer";
import ProductCard from "../ProductCard";
import { PerformRequest } from "../../Lib/PerformRequest";
import { Endpoints } from "../../Lib/Endpoints";
import { GetProductsResponse } from "../../Lib/Responses";
import { Product } from "../../Lib/Types";

export default function Dashboard() {
  const navigate = useNavigate();
  const { addToast, removeAllToasts } = useToasts();
  const userContext = useContext(AppContext);

  const [isLoading, setLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);
  // Begin Product Search and Filter
  const [productQuery, setProductQuery] = useState<string>("");
  const [productCategory, setProductCategory] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  // End Product Search and Filter

  const paginateProducts = async () => {
    if (userContext && userContext.getProducts) {
      setLoading(true);
      await userContext.getProducts({
        page,
        limit: 15,
        category_id: productCategory,
      });
      setLoading(false);
    }
  };
  useEffect(() => {
    if (userContext && userContext.products) {
      setProducts(userContext.products);
    }
  }, [userContext]);
  useEffect(() => {
    paginateProducts();
  }, [page]);
  const getProductByCategory = async () => {
    if (userContext && userContext.getProducts) {
      setLoading(true);
      await userContext.getProducts({
        page,
        limit: 15,
        category_id: productCategory,
      });
      setLoading(false);
    }
  };
  useEffect(() => {
    getProductByCategory();
  }, [productCategory]);

  const searchProducts = async () => {
    const token = Cookies.get("token");
    if (productQuery.length > 0) {
      setLoading(true);
      const r: GetProductsResponse = await PerformRequest({
        route: Endpoints.SearchStores,
        method: "POST",
        data: { token, query: productQuery },
      }).catch(() => {
        setLoading(false);
      });
      if (r.data && r.data.status === "success") {
        setProducts(r.data.data);
      } else {
        if (r.data && r.data.status === "failed") {
          setProducts([]);
        }
      }
      setLoading(false);
    } else {
      if (userContext && userContext?.getProducts && userContext.products) {
        setLoading(true);
        await userContext.getProducts({ page, limit: 15 });
        setProducts(userContext?.products);
        setLoading(false);
      }
    }
  };
  return (
    <div
      className="dashboard-container flex-col width-100"
      style={{
        opacity: isLoading ? 0.5 : 1,
        cursor: isLoading ? "not-allowed" : "",
      }}
    >
      {userContext?.user ? (
        <>
          <div className="flex-col width-100 align-center justify-center">
            <span className="text-center px-22 fw-600 text-dark">Products</span>
            <br />
            <div className="flex-row align-center justify-center ">
              <div className="flex-row align-end search">
                <div className="flex-col">
                  <small className="px-12">&nbsp;Category</small>
                  <select
                    disabled={isLoading}
                    className="select"
                    value={productCategory}
                    onChange={(e) => setProductCategory(e.target.value)}
                  >
                    <option value="">None</option>
                    {userContext?.categories?.map((category, index) => {
                      return (
                        <option value={category.category_id}>
                          {category.category_name}
                        </option>
                      );
                    })}
                  </select>
                </div>
                &nbsp; &nbsp; &nbsp; &nbsp;
                <input
                  className="input"
                  spellCheck={false}
                  value={productQuery}
                  disabled={isLoading}
                  onKeyUp={(e) => {
                    if (e.keyCode === 13 && productQuery.length > 0) {
                      searchProducts();
                    }
                  }}
                  placeholder="Search all products..."
                  onChange={(e) => {
                    setProductQuery(e.target.value);
                  }}
                />
                &nbsp; &nbsp; &nbsp; &nbsp;
                <Button
                  sx={{
                    width: "120px",
                    fontSize: "14px",
                    height: "32px",
                  }}
                  disabled={isLoading}
                  type="button"
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    searchProducts();
                  }}
                >
                  {productQuery.length === 0 ? "Refresh" : "Search"}
                </Button>
              </div>
            </div>
          </div>
          <br />
          {products.length === 0 && !isLoading ? (
            <Alert severity="info">No Products found!</Alert>
          ) : (
            <>
              <Grid
                container
                spacing={4}
                alignItems="center"
                justifyContent="center"
              >
                {products.map((product, index) => {
                  return (
                    <Grid item>
                      <ProductCard product={product} disabled={isLoading} />
                    </Grid>
                  );
                })}
              </Grid>
              <br />
              <br />
              <Pagination
                disabled={isLoading}
                count={Math.ceil(userContext.productCount / 15)}
                onChange={(e, p) => {
                  setPage(p);
                }}
              />
            </>
          )}
          <br />
        </>
      ) : (
        <MegaLoader />
      )}
    </div>
  );
}
