import React, { useState, useEffect, useContext, useRef } from "react";

import { useNavigate, Link } from "react-router-dom";

import { useToasts } from "react-toast-notifications";
import Cookies from "js-cookie";
import { motion } from "framer-motion";
import CopyToClipboard from "react-copy-to-clipboard";
import {
  Container,
  TextField,
  TextFieldProps,
  Button,
  Alert,
} from "@mui/material";

import DefaultUserImage from "../../Assets/IMG/DefaultUserImage.png";

import { PerformRequest, UploadFile } from "../../Lib/PerformRequest";
import { Endpoints } from "../../Lib/Endpoints";
import {
  DefaultResponse,
  GetProductsResponse,
  LoginResponse,
  UploadFileResponse,
} from "../../Lib/Responses";
import MegaLoader from "../../Misc/MegaLoader";
import { AppContext } from "../DashboardContainer";
import ProgressCircle from "../../Misc/ProgressCircle";
import {
  getFinancialValueFromNumeric,
  validateEmail,
  validatePhoneNumber,
} from "../../Lib/Methods";

import "./styles.scss";
interface ProfileFormProps {
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  email: string;
  photo: string;
}
export default function Wallet() {
  const navigate = useNavigate();
  const userContext = useContext(AppContext);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const { addToast, removeAllToasts } = useToasts();

  const [isLoading, setLoading] = useState<boolean>(false);

  const textFieldProps: TextFieldProps = {
    variant: "outlined",
    size: "small",
    disabled: isLoading,
    sx: {
      mt: "30px",
    },
  };
  return (
    <Container maxWidth="lg">
      <div className="wallet-container flex-col width-100">
        {userContext?.user ? (
          <>
            <div className="top width-100 flex-col">
              <div className="flex-row width-100 align-center justify-between">
                <span className="text-dark fw-500 px-20">My Wallet</span>
              </div>
            </div>
            <div className="flex-col width-100 overview">
              <span className="text-darker px-15 fw-500">Wallet Overview</span>
              {userContext.wallet ? (
                <div className="flex-row width-100 items align-center justify-between">
                  <div className="flex-row width-100 align-center justify-between item">
                    <div className="left flex-row align-center">
                      <span className="icon flex-row align-center justify-center">
                        <i className="far fa-wallet" />
                      </span>
                      &nbsp; &nbsp;
                      <span className="px-14 fw-500 text-darker">
                        Available Balance
                      </span>
                    </div>
                    <span className="px-20 fw-600 text-blue-default text-darker">
                      ₦
                      {getFinancialValueFromNumeric(
                        userContext.wallet.available_balance
                      )}
                    </span>
                  </div>
                  &nbsp; &nbsp;
                  <div className="flex-row width-100 align-center justify-between item">
                    <div className="left flex-row align-center">
                      <span className="icon flex-row align-center justify-center">
                        <i className="far fa-coins" />
                      </span>
                      &nbsp; &nbsp;
                      <span className="px-14 fw-500 text-darker">
                        Ledger Balance
                      </span>
                    </div>

                    <span className="px-20 fw-600 text-blue-default text-darker">
                      ₦
                      {getFinancialValueFromNumeric(
                        userContext.wallet.ledger_balance
                      )}
                    </span>
                  </div>
                </div>
              ) : (
                <center>
                  <Alert severity="info">No wallet information found!</Alert>
                </center>
              )}
            </div>
            <div className="flex-row width-100 justify-between actions">
              <CopyToClipboard
                text={
                  userContext.wallet?.virtual_account.virtual_account_no ?? ""
                }
                onCopy={() => {
                  removeAllToasts();
                  addToast("Account copied to clipboard!", {
                    appearance: "success",
                  });
                }}
              >
                <div className="flex-col justify-between bank">
                  <span className="text-darker px-16 fw-500 label">
                    Virtual Account
                  </span>
                  <div className="flex-row align-center">
                    <span className="icon px-20 flex-row align-center justify-center">
                      <i className="far fa-university" />
                    </span>
                    &nbsp; &nbsp;
                    <span className="name">Access Bank</span>
                  </div>
                  <span className="account">Ajiboye Oluwaferanmi</span>
                  <span className="number text-blue-default">1219883420</span>
                </div>
              </CopyToClipboard>
            </div>
          </>
        ) : (
          <MegaLoader />
        )}
      </div>
    </Container>
  );
}
