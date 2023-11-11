import React, { useState, useEffect, useContext } from "react";

import { useNavigate, Link } from "react-router-dom";

import { useToasts } from "react-toast-notifications";
import Cookies from "js-cookie";
import {
  Button,
  MenuItem,
  TextField,
  Alert,
  Modal,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  Paper,
  TableContainer,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { GridColDef, GridColTypeDef } from "@mui/x-data-grid/models";

import { Order, OrderStatus, PaymentStatus, User } from "../../Lib/Types";

import { PerformRequest } from "../../Lib/PerformRequest";
import { Endpoints } from "../../Lib/Endpoints";
import { GetOrdersResponse, LoginResponse } from "../../Lib/Responses";
import MegaLoader from "../../Misc/MegaLoader";
import { AppContext } from "../DashboardContainer";
import ProgressCircle from "../../Misc/ProgressCircle";
import { OrderStatuses, PaymentStatuses } from "../../Lib/appConfig";

import "./styles.scss";

export default function Orders() {
  const userContext = useContext(AppContext);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [orders, setOrders] = useState<Order[]>([]);

  const [isShowOrderModal, setShowOrderModal] = useState<boolean>(false);
  const [currentOrder, setCurrentOrder] = useState<Order>();
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
        account: "customer",
        // page: paginationModel.page,
        // limit: paginationModel.pageSize,
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
      ...tableColProps,
      renderCell: (param) => {
        return <span>{param.row.store[0]?.name ?? ""}</span>;
      },
    },
    {
      field: "order_timestamp",
      headerName: "Date",
      ...tableColProps,
      renderCell: (param) => {
        return <span>{param.row.order_timestamp}</span>;
      },
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
                : ["Delivery", "Request", "Pending"].includes(
                    params.row.order_status
                  )
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
    {
      field: "reference_code",
      headerName: "Details",
      ...tableColProps,
      renderCell: (param) => {
        return (
          <Button
            variant="contained"
            color="primary"
            size="small"
            sx={{
              fontSize: "12px",
            }}
            onClick={() => {
              setCurrentOrder(param.row);
              setShowOrderModal(true);
            }}
          >
            View Details
          </Button>
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
                <>
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
                  <Modal
                    open={isShowOrderModal}
                    onClose={() => {
                      setShowOrderModal(false);
                    }}
                  >
                    <div className="order-modal">
                      <div className="width-100 flex-row align-center justify-between">
                        <span className="fw-500 px-15">Order Details</span>
                        <span
                          className="pointer fw-500"
                          onClick={() => {
                            setShowOrderModal(false);
                          }}
                        >
                          <i className="far fa-times" />
                        </span>
                      </div>
                      <br />
                      {currentOrder && (
                        <>
                          <TableContainer component={Paper}>
                            <Table aria-label="simple table">
                              <TableBody>
                                <TableRow>
                                  <TableCell>Order Status</TableCell>
                                  <TableCell>
                                    <span
                                      className={
                                        ["Successful", "Delivered"].includes(
                                          currentOrder?.order_status
                                        )
                                          ? "text-green-primary"
                                          : [
                                              "Delivery",
                                              "Request",
                                              "Pending",
                                            ].includes(
                                              currentOrder?.order_status
                                            )
                                          ? "text-blue-default"
                                          : "text-red-primary"
                                      }
                                    >
                                      {currentOrder?.order_status}
                                    </span>
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>Payment Status</TableCell>
                                  <TableCell>
                                    <span
                                      className={
                                        currentOrder.payment_status ===
                                        "Successful"
                                          ? "text-green-primary"
                                          : currentOrder.payment_status ===
                                            "Pending"
                                          ? "text-orange-primary"
                                          : "text-red-primary"
                                      }
                                    >
                                      {currentOrder.payment_status}
                                    </span>
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>Order Time</TableCell>
                                  <TableCell>
                                    <span>{currentOrder.order_timestamp}</span>
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>Reference Code</TableCell>
                                  <TableCell>
                                    <span>{currentOrder.reference_code}</span>
                                  </TableCell>
                                </TableRow>

                                {/* <TableRow>
                                  <TableCell>Store</TableCell>
                                  <TableCell>
                                    {currentOrder.store.map((s) => {
                                      return <span>{s.name}&nbsp;&nbsp;</span>;
                                    })}
                                  </TableCell>
                                </TableRow> */}
                              </TableBody>
                            </Table>
                          </TableContainer>
                          <br />
                          <br />
                          <div className="text-center px-15 fw-500">
                            Product Details
                          </div>
                          <br />
                          <TableContainer component={Paper}>
                            <Table aria-label="simple table">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Name</TableCell>
                                  <TableCell>Quantity</TableCell>
                                  <TableCell>Amount</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {currentOrder.product.map((product) => {
                                  return (
                                    <TableRow>
                                      <TableCell>
                                        <span>{product.name}</span>
                                      </TableCell>

                                      <TableCell>
                                        <span>{product.quantity}</span>
                                      </TableCell>
                                      <TableCell>
                                        <span>{product.amount}</span>
                                      </TableCell>
                                    </TableRow>
                                  );
                                })}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </>
                      )}
                    </div>
                  </Modal>
                </>
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
