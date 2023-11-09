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
  Chip,
} from "@mui/material";

import Logo from "../../Assets/IMG/Logo.png";

import { AppContext } from "../DashboardContainer";
import { RouteList } from "../../Lib/Routelist";

import "./styles.scss";

type DrawerAnchorType = "top" | "left" | "bottom" | "right";

export default function BottomTabs() {
  const navigate = useNavigate();
  const userContext = useContext(AppContext);

  const cartProducts = userContext?.cart;
  console.log(cartProducts);
  const screenWidth = window.innerWidth;

  return (
    <div className="bottom-tabs-container flex-row align-center width-100 justify-between"></div>
  );
}
