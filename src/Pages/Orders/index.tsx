import React, { useState, useEffect, useContext } from "react";

import { useNavigate, Link } from "react-router-dom";

import { useToasts } from "react-toast-notifications";
import Cookies from "js-cookie";

import { Order, OrderStatus, PaymentStatus, User } from "../../Lib/Types";

import "./styles.scss";
import { PerformRequest } from "../../Lib/PerformRequest";
import { Endpoints } from "../../Lib/Endpoints";
import { GetOrdersResponse, LoginResponse } from "../../Lib/Responses";
import MegaLoader from "../../Misc/MegaLoader";
import { AppContext } from "../DashboardContainer";
import { DataGrid } from "@mui/x-data-grid";
import { GridColDef, GridColTypeDef } from "@mui/x-data-grid/models";
import { Button, MenuItem, TextField, Alert } from "@mui/material";
import ProgressCircle from "../../Misc/ProgressCircle";
import { OrderStatuses, PaymentStatuses } from "../../Lib/appConfig";

export default function Orders() {
  const userContext = useContext(AppContext);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [orders, setOrders] = useState<Order[]>([]);

  // Order Search Params Begin
  const [orderStatus, setOrderStatus] = useState<OrderStatus>("");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("");
  const [rowCount, setRowCount] = useState<number>(0);
  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: 10,
    page: 0,
  });
  // Order Search Params End
  const getOrders = async () => {
    const token = Cookies.get("token");
    setLoading(true);
    const r: GetOrdersResponse = await PerformRequest({
      route: Endpoints.GetOrders,
      method: "POST",
      data: {
        token: token,
        account: "panel",
        page: paginationModel.page,
        limit: paginationModel.pageSize,
        payment_status: paymentStatus,
        order_status: orderStatus,
      },
    }).catch(() => {
      setLoading(false);
    });
    console.log(r);
    setLoading(false);
    if (r.data && r.data.data) {
      setOrders(r.data.data);
      setRowCount(r.data.counts);
    }
  };
  const ClearFilters = () => {
    setOrderStatus("");
    setPaymentStatus("");
  };
  useEffect(() => {
    getOrders();
  }, [paginationModel, orderStatus, paymentStatus]);

  const tableColProps: GridColTypeDef = {
    flex: 1,
  };
  const tableColumns: GridColDef<Order>[] = [
    {
      field: "name",
      headerName: "Store Name",
      // ...tableColProps,
      width: 150,
      renderCell: (param) => {
        return <span>{param.row.store[0]?.name ?? ""}</span>;
      },
    },

    {
      field: "order_timestamp",
      headerName: "Order Time",
      ...tableColProps,
    },
    {
      field: "payment_timestamp",
      headerName: "Payment Time",
      ...tableColProps,
    },
    {
      field: "order_status",
      headerName: "Order Status",
      ...tableColProps,
      renderCell: (params) => {
        return (
          <span
            className={
              ["Successful", "Delivered"].includes(params.row.order_status)
                ? "text-green-primary"
                : ["Delivery", "Request"].includes(params.row.order_status)
                ? "text-blue-default"
                : "text-red-primary"
            }
          >
            {params.row.order_status}
          </span>
        );
      },
    },
    {
      field: "payment_status",
      headerName: "Payment Status",
      ...tableColProps,
      renderCell: (params) => {
        return (
          <span
            className={
              params.row.payment_status === "Successful"
                ? "text-green-primary"
                : params.row.payment_status === "Pending"
                ? "text-orange-primary"
                : "text-red-primary"
            }
          >
            {params.row.payment_status}
          </span>
        );
      },
    },
  ];
  return (
    <div className="orders-container flex-col width-100">
      {userContext?.user ? (
        <>
          <div className="top width-100 flex-col">
            <div className="flex-row width-100 align-center justify-between">
              <span className="text-dark fw-500 px-20">Orders</span>
            </div>
            <br />
            <div className="flex-row width-100 align-center filter">
              <div>
                <TextField
                  select
                  className="filter-select"
                  disabled={isLoading}
                  label="Order Status"
                  variant="outlined"
                  size="small"
                  sx={{
                    width: "160px",
                  }}
                  value={orderStatus}
                  onChange={(e) =>
                    setOrderStatus(e.target.value as OrderStatus)
                  }
                >
                  {OrderStatuses.map((status) => {
                    return <MenuItem value={status}>{status}</MenuItem>;
                  })}
                  <MenuItem value={""}>None</MenuItem>
                </TextField>

                <TextField
                  select
                  className="filter-select"
                  disabled={isLoading}
                  label="Payment Status"
                  variant="outlined"
                  size="small"
                  sx={{
                    width: "160px",
                  }}
                  value={paymentStatus}
                  onChange={(e) =>
                    setPaymentStatus(e.target.value as PaymentStatus)
                  }
                >
                  {PaymentStatuses.map((status) => {
                    return <MenuItem value={status}>{status}</MenuItem>;
                  })}
                  <MenuItem value={""}>None</MenuItem>
                </TextField>
              </div>
              <Button
                onClick={ClearFilters}
                variant="contained"
                color="primary"
                sx={{
                  width: "140px",
                  height: "40px",
                }}
                disabled={
                  isLoading ||
                  (orderStatus.length === 0 && paymentStatus.length === 0)
                }
              >
                Clear
              </Button>
            </div>
          </div>
          <br />
          {isLoading ? (
            <ProgressCircle />
          ) : (
            <>
              {orders.length === 0 ? (
                <>
                  <br />
                  <Alert severity="info">No orders found!</Alert>
                </>
              ) : (
                <DataGrid
                  loading={isLoading}
                  className="table"
                  columns={tableColumns}
                  rows={orders}
                  getRowId={(row) => row.reference_code}
                  paginationModel={paginationModel}
                  onPaginationModelChange={setPaginationModel}
                  pageSizeOptions={[5, 10, 25]}
                  rowCount={rowCount}
                />
              )}
            </>
          )}
        </>
      ) : (
        <MegaLoader />
      )}
    </div>
  );
}
