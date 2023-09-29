import React, { useState, useEffect, useContext } from "react";

import { useNavigate, Link, useParams } from "react-router-dom";

import { useToasts } from "react-toast-notifications";
import Cookies from "js-cookie";

import {
  Order,
  OrderStatus,
  PaymentStatus,
  SimpleSingleStore,
  Store,
  User,
} from "../../Lib/Types";

import "./styles.scss";
import { PerformRequest } from "../../Lib/PerformRequest";
import { Endpoints } from "../../Lib/Endpoints";
import {
  GetOrdersResponse,
  GetSingleStoreResponse,
  LoginResponse,
} from "../../Lib/Responses";
import MegaLoader from "../../Misc/MegaLoader";
import { AppContext } from "../DashboardContainer";
import { DataGrid } from "@mui/x-data-grid";
import { GridColDef, GridColTypeDef } from "@mui/x-data-grid/models";
import { Button, MenuItem, TextField, Alert } from "@mui/material";
import ProgressCircle from "../../Misc/ProgressCircle";
import { OrderStatuses, PaymentStatuses } from "../../Lib/appConfig";

export default function SingleStore() {
  const userContext = useContext(AppContext);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [store, setStore] = useState<SimpleSingleStore | null>(null);

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
  useEffect(() => {
    if (params.storeID) {
      getStore();
    }
  }, [params]);

  return (
    <div className="orders-container flex-col width-100">
      {userContext?.user && store ? (
        <>
          <div className="top width-100 flex-col">
            <div className="flex-row width-100 align-center justify-between">
              <span className="text-dark fw-500 px-20">{store.name}</span>
            </div>
            <br />
          </div>
          <br />
        </>
      ) : (
        <MegaLoader />
      )}
    </div>
  );
}
