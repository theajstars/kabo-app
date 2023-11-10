import React, { useState, useEffect, useContext } from "react";

import { Link, useNavigate } from "react-router-dom";

import {
  Box,
  Drawer,
  Badge,
  List,
  ListItem,
  Divider,
  ListItemButton,
  ListItemText,
  Paper,
  Chip,
} from "@mui/material";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";

import Logo from "../../Assets/IMG/Logo.png";

import { AppContext } from "../DashboardContainer";
import { RouteList } from "../../Lib/Routelist";
import WalletIcon from "@mui/icons-material/AccountBalanceWallet";

import "./styles.scss";

export default function BottomTabs() {
  const navigate = useNavigate();
  const userContext = useContext(AppContext);

  const cartProducts = userContext?.cart;
  console.log(cartProducts);
  const [currentPage, setCurrentPage] = useState<string>("");

  return (
    <div className="bottom-tabs-container flex-row align-center width-100 justify-between">
      <BottomNavigation
        value={currentPage}
        sx={{
          width: "100%",
        }}
        onChange={(event, route) => {
          setCurrentPage(route);
          console.log(route);
          navigate(`/dashboard/${route}`);
        }}
      >
        {RouteList.map((route) => {
          if (route.route !== "stores") {
            return (
              <BottomNavigationAction
                sx={{
                  width: "10px",
                  fontSize: "4px",
                }}
                value={route.route}
                icon={<route.icon />}
              />
            );
          }
        })}
      </BottomNavigation>
    </div>
  );
}
