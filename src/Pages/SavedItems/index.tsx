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
import { Product, SavedItem } from "../../Lib/Types";

export default function SavedItems() {
  const navigate = useNavigate();
  const { addToast, removeAllToasts } = useToasts();
  const userContext = useContext(AppContext);

  const [isLoading, setLoading] = useState<boolean>(false);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  // Begin Product Search and Filter
  const [page, setPage] = useState<number>(1);
  // End Product Search and Filter

  const paginateProducts = async () => {
    if (userContext && userContext.getSavedItems) {
      setLoading(true);
      await userContext.getSavedItems({
        page,
        limit: 15,
      });
      setLoading(false);
    }
  };
  useEffect(() => {
    if (userContext && userContext.savedItems) {
      setSavedItems(userContext.savedItems);
    }
  }, [userContext]);
  useEffect(() => {
    paginateProducts();
  }, [page]);

  return (
    <div
      className="dashboard-container flex-col width-100"
      style={{
        opacity: isLoading ? 0.5 : 1,
        cursor: isLoading ? "not-allowed" : "",
      }}
    >
      {userContext?.user && userContext.savedItems ? (
        <>
          <div className="flex-col width-100 align-center justify-center">
            <span className="text-center px-22 fw-600 text-dark">
              Saved Items
            </span>
            <br />
          </div>
          <br />
          {userContext.savedItems.length === 0 && !isLoading ? (
            <Alert severity="info">No Products found!</Alert>
          ) : (
            <>
              <Grid
                container
                spacing={4}
                alignItems="center"
                justifyContent="center"
              >
                {userContext.savedItems.map((saved, index) => {
                  return (
                    <Grid item>
                      <ProductCard product={saved} disabled={isLoading} />
                    </Grid>
                  );
                })}
              </Grid>
              <br />
              <br />
              <Pagination
                disabled={isLoading}
                count={Math.ceil(userContext.savedItemsCount / 15)}
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
