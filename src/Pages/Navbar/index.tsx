import React, { useState, useEffect, useContext } from "react";

import { Link, useNavigate } from "react-router-dom";

import {
  Box,
  Drawer,
  Button,
  List,
  ListItem,
  Divider,
  ListItemButton,
  ListItemText,
} from "@mui/material";

import Logo from "../../Assets/IMG/Logo.png";

import { AppContext } from "../DashboardContainer";
import { RouteList } from "../../Lib/Routelist";

import "./styles.scss";

type DrawerAnchorType = "top" | "left" | "bottom" | "right";

export default function Navbar() {
  const navigate = useNavigate();
  const userContext = useContext(AppContext);

  const screenWidth = window.innerWidth;
  const cartProducts = userContext?.cart;

  return (
    <>
      {screenWidth > 700 ? (
        <div className="navbar-container flex-row align-center width-100 justify-between">
          <div className="items flex-row align-center">
            <Link to="/dashboard">
              <img src={Logo} alt="" />
            </Link>
            {RouteList.map((route) => {
              if (route.route === "cart") {
                return (
                  <>
                    <Link
                      className="item text-blue-default"
                      to={`/dashboard/${route.route}`}
                    >
                      {route.label}
                    </Link>
                    <span className="cart-tag">
                      {cartProducts ? cartProducts.quantity ?? 0 : 0}
                    </span>
                  </>
                );
              }
              return (
                <Link
                  className="item text-blue-default"
                  to={`/dashboard/${route.route}`}
                >
                  {route.label}
                </Link>
              );
            })}
          </div>
          <span
            className="flex-row align-center text-blue-default pointer"
            onClick={() => {
              userContext?.logout();
            }}
          >
            Logout &nbsp; <i className="fal fa-sign-out" />
          </span>
        </div>
      ) : (
        <TemporaryDrawer />
      )}
    </>
  );
}

function TemporaryDrawer() {
  const userContext = useContext(AppContext);
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer =
    (anchor: DrawerAnchorType, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setState({ ...state, [anchor]: open });
    };

  const list = (anchor: DrawerAnchorType) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <Link to="/dashboard">
        <img className="small-nav-logo" src={Logo} alt="" />
      </Link>
      <List>
        {RouteList.map((route) => (
          <ListItem key={route.label} disablePadding>
            <ListItemButton href={`/dashboard/${route.route}`}>
              <ListItemText primary={route.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              userContext?.logout();
            }}
          >
            <ListItemText primary={"Logout"} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <div>
      <React.Fragment>
        {!state.left && (
          <span
            className="pointer toggle-nav flex-row align-center"
            onClick={toggleDrawer("left", true)}
          >
            <i className="far fa-bars text-dark" />
          </span>
        )}
        <Drawer
          anchor={"left"}
          open={state["left"]}
          onClose={toggleDrawer("left", false)}
        >
          {list("left")}
        </Drawer>
      </React.Fragment>
      <br />
    </div>
  );
}
