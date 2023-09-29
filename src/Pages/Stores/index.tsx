import React, { useState, useEffect, useContext } from "react";

import { useNavigate, Link } from "react-router-dom";

import { useToasts } from "react-toast-notifications";
import {
  Grid,
  Alert,
  Container,
  Pagination,
  Stack,
  Skeleton,
} from "@mui/material";
import Cookies from "js-cookie";

import { Product, Store, User } from "../../Lib/Types";

import ProductsIcon from "../../Assets/IMG/ProductsIconDark.svg";
import DefaultStoreImage from "../../Assets/IMG/DefaultStoreImage.png";

import Logo from "../../Assets/IMG/Logo.png";

import "./styles.scss";
import { PerformRequest } from "../../Lib/PerformRequest";
import { Endpoints } from "../../Lib/Endpoints";
import {
  GetProductsResponse,
  GetStoreListResponse,
  LoginResponse,
} from "../../Lib/Responses";
import MegaLoader from "../../Misc/MegaLoader";
import { AppContext } from "../DashboardContainer";
import { DataGrid } from "@mui/x-data-grid";
import { GridColDef, GridColTypeDef } from "@mui/x-data-grid/models";
import ProgressCircle from "../../Misc/ProgressCircle";

export default function Stores() {
  const navigate = useNavigate();
  const userContext = useContext(AppContext);
  const { addToast, removeAllToasts } = useToasts();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);

  // Product Search Params Begin
  const [rowCount, setRowCount] = useState<number>(0);
  // Product Search Params End

  const getStores = async (page: number) => {
    if (userContext && userContext.getStores) {
      setLoading(true);
      await userContext.getStores({
        page: page,
        limit: 10,
      });
      setLoading(false);
    }
  };

  return (
    <div className="stores-container flex-col width-100">
      {userContext?.user && userContext.stores ? (
        <Container maxWidth="lg">
          <>
            <div className="top width-100 flex-col">
              <div className="flex-row width-100 align-center justify-between">
                <span className="text-dark fw-500 px-20">Stores</span>
              </div>
            </div>

            {/* <div className="flex-row align-center width-100 justify-center store-loader">
               <span>Fetching Stores</span>
               &nbsp; &nbsp; &nbsp;  <ProgressCircle />
             
            </div> */}

            {userContext &&
            userContext.stores &&
            userContext.stores.length === 0 ? (
              <Alert severity="info">No stores found!</Alert>
            ) : (
              <Grid
                container
                spacing={7}
                alignItems="center"
                justifyContent="center"
              >
                {userContext.stores.map((store) => {
                  return (
                    <Grid item>
                      <Link
                        className="store-card flex-col align-center"
                        to={`/dashboard/store/${store.store_id}`}
                        onClick={(e) => {
                          if (isLoading) {
                            e.preventDefault();
                          }
                        }}
                      >
                        {isLoading ? (
                          <Stack spacing={1}>
                            <Skeleton
                              variant="text"
                              sx={{ fontSize: "1rem" }}
                            />
                            <Skeleton
                              variant="circular"
                              width={40}
                              height={40}
                            />
                            <Skeleton
                              variant="rectangular"
                              width={210}
                              height={60}
                            />
                            <Skeleton
                              variant="rounded"
                              width={210}
                              height={60}
                            />
                          </Stack>
                        ) : (
                          <>
                            <img
                              src={
                                store.photo
                                  ? store.photo.length > 0
                                    ? store.photo
                                    : DefaultStoreImage
                                  : DefaultStoreImage
                              }
                              alt=""
                              className="image"
                            />
                            <span className="px-15 text-dark">
                              {store.name}
                            </span>
                            <span className="px-15location text-blue-default">
                              <i className="far fa-map-marker-alt" />
                              &nbsp; &nbsp;
                              {store.city && store.city.length > 0
                                ? store.city
                                : "Not applicable"}
                            </span>
                          </>
                        )}
                      </Link>
                    </Grid>
                  );
                })}
              </Grid>
            )}
            <br />
            <div className="flex-row width-100 align-center justify-center">
              <Pagination
                disabled={isLoading}
                count={Math.ceil(userContext.storeCount / 10)}
                onChange={(e, p) => {
                  getStores(p);
                }}
              />
            </div>
            <br />
          </>
        </Container>
      ) : (
        <MegaLoader />
      )}
    </div>
  );
}
