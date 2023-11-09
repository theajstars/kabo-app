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
      {/* <Box sx={{ width: "100%" }}> */}
      <Paper
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
        elevation={3}
      >
        <BottomNavigation
          value={currentPage}
          onChange={(event, newValue) => {
            setCurrentPage(newValue);
            console.log(newValue);
          }}
        >
          {RouteList.map((route) => {
            return (
              <BottomNavigationAction
                label={route.label}
                value={route.route}
                icon={<route.icon />}
              />
            );
          })}
        </BottomNavigation>
      </Paper>
      {/* </Box> */}
    </div>
  );
}
