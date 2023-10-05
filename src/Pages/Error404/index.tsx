import React, { useState, useEffect, useContext, useRef } from "react";

import { useNavigate, Link } from "react-router-dom";

import { useToasts } from "react-toast-notifications";
import Cookies from "js-cookie";
import { motion } from "framer-motion";
import CopyToClipboard from "react-copy-to-clipboard";
import {
  Container,
  Grid,
  FormControl,
  InputLabel,
  Button,
  Alert,
  Select,
  MenuItem,
} from "@mui/material";

import { PerformRequest } from "../../Lib/PerformRequest";
import { Endpoints } from "../../Lib/Endpoints";
import { DefaultResponse } from "../../Lib/Responses";
import MegaLoader from "../../Misc/MegaLoader";
import { AppContext } from "../DashboardContainer";
import ProgressCircle from "../../Misc/ProgressCircle";
import { getFinancialValueFromNumeric } from "../../Lib/Methods";

import "./styles.scss";

export default function Error404() {
  const navigate = useNavigate();
  const { addToast, removeAllToasts } = useToasts();

  return (
    <>
      <div className="error-404-container flex-col width-100 align-center justify-center">
        <span className="icon">
          <i className="far fa-meh-rolling-eyes" />
        </span>
        <span className="px-30 fw-500 text-darker text">Page Not Found!</span>
        <button
          onClick={() => {
            navigate("/dashboard");
          }}
        >
          Back to Dashboard
        </button>
      </div>
      <div className="error-404-bg"></div>
    </>
  );
}
