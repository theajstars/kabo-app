import React, { useState, useEffect, useContext } from "react";

import { useNavigate, Link, useParams } from "react-router-dom";

import { useToasts } from "react-toast-notifications";
import { Button, MenuItem, Grid, Alert, Pagination } from "@mui/material";
import Cookies from "js-cookie";

import {
  Order,
  OrderStatus,
  PaymentStatus,
  Product,
  SimpleSingleStore,
  Store,
  User,
} from "../../Lib/Types";

import "./styles.scss";
import { PerformRequest } from "../../Lib/PerformRequest";
import { Endpoints } from "../../Lib/Endpoints";
import {
  GetOrdersResponse,
  GetProductsResponse,
  GetSingleStoreResponse,
  LoginResponse,
} from "../../Lib/Responses";
import MegaLoader from "../../Misc/MegaLoader";
import { AppContext } from "../DashboardContainer";
import ProgressCircle from "../../Misc/ProgressCircle";
import { OrderStatuses, PaymentStatuses } from "../../Lib/appConfig";
import ProductCard from "../ProductCard";

export default function SingleStore() {
  const userContext = useContext(AppContext);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [store, setStore] = useState<SimpleSingleStore | null>(null);
  const [storeProducts, setStoreProducts] = useState<Product[]>([]);

  const [page, setPage] = useState<number>(1);
  const [productCount, setProductCount] = useState<number>(1);

  const params = useParams();
  const storeID = params.storeID;
  const getStore = async () => {
    const token = Cookies.get("token");
    setLoading(true);
    const r: GetSingleStoreResponse = await PerformRequest({
      route: Endpoints.GetOrders,
      method: "POST",
      data: {
        token: token,
        store_id: storeID,
      },
    }).catch(() => {
      setLoading(false);
    });
    console.log(r);
    setLoading(false);
    if (r.data && r.data.data) {
      setStore(r.data.data);
    }
  };
  const getStoreProducts = async () => {
    const token = Cookies.get("token");
    setLoading(true);
    const r: GetProductsResponse = await PerformRequest({
      route: Endpoints.GetProducts,
      method: "POST",
      data: {
        token: token,
        store_id: storeID,
        page,
        limit: 15,
      },
    }).catch(() => {
      setLoading(false);
    });
    console.log(r);
    setLoading(false);
    if (r.data && r.data.data) {
      setStoreProducts(r.data.data);
      setProductCount(r.data.counts);
    }
  };

  useEffect(() => {
    if (params.storeID) {
      getStore();
    }
  }, [params]);
  useEffect(() => {
    getStoreProducts();
  }, [page]);

  return (
    <div className="orders-container flex-col width-100">
      {userContext?.user && storeProducts ? (
        <>
          {isLoading}
          <div className="top width-100 flex-col">
            <div className="flex-row width-100 align-center justify-between">
              <span className="text-dark fw-500 px-20">Store Name</span>
              {/* <span className="text-dark fw-500 px-20">{store.name}</span> */}
            </div>
            <br />
          </div>
          {storeProducts.length === 0 ? (
            <Alert severity="info">No Products found!</Alert>
          ) : (
            <Grid
              container
              spacing={4}
              alignItems="center"
              justifyContent="center"
            >
              {storeProducts.map((product) => {
                return (
                  <Grid item>
                    <ProductCard product={product} disabled={false} />
                  </Grid>
                );
              })}
            </Grid>
          )}

          <br />
          <Pagination
            disabled={isLoading}
            count={Math.ceil(productCount / 15)}
            onChange={(e, p) => {
              setPage(p);
            }}
          />
        </>
      ) : (
        <MegaLoader />
      )}
    </div>
  );
}
