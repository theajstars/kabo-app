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
  Modal,
} from "@mui/material";

import dayjs, { Dayjs } from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { PerformRequest } from "../../Lib/PerformRequest";
import { Endpoints } from "../../Lib/Endpoints";
import { DefaultResponse } from "../../Lib/Responses";
import MegaLoader from "../../Misc/MegaLoader";
import { AppContext } from "../DashboardContainer";
import ProgressCircle from "../../Misc/ProgressCircle";
import { getFinancialValueFromNumeric } from "../../Lib/Methods";

import "./styles.scss";

interface BankForm {
  number: string;
  bankCode: string;
}
interface WalletTransferForm {
  amount: string;
  walletID: string;
}
interface GenerateVirtualAccountForm {
  bvn: any;
  firstname: string;
  lastname: string;
  dateOfBirth: Dayjs | null;
}
export default function Wallet() {
  const navigate = useNavigate();
  const userContext = useContext(AppContext);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const { addToast, removeAllToasts } = useToasts();

  const [value, setValue] = React.useState<Dayjs | null>();

  const [isLoading, setLoading] = useState<boolean>(false);
  const [isVirtualAccountModalShowing, setVirtualAccountModalShowing] =
    useState<boolean>(false);

  const [virtualAccountForm, setVirtualAccountForm] =
    useState<GenerateVirtualAccountForm>({
      bvn: "",
      lastname: "",
      firstname: "",
      dateOfBirth: dayjs("2022-04-17"),
    });
  const [isBankUploading, setBankUploading] = useState<boolean>(false);

  const [isEditBankDetails, setEditBankDetails] = useState<boolean>(false);
  const [bankForm, setBankForm] = useState<BankForm>({
    number: "",
    bankCode: "",
  });
  const [walletTransferForm, setWalletTransferForm] =
    useState<WalletTransferForm>({
      amount: "",
      walletID: "",
    });

  const GenerateVirtualAccount = async () => {
    removeAllToasts();
    const { bvn, dateOfBirth, firstname, lastname } = virtualAccountForm;
    if (bvn.toString().length !== 11) {
      addToast("Please enter a valid BVN", { appearance: "error" });
    }
    if (firstname.length === 0 || lastname.length === 0) {
      addToast("Please enter your full name", { appearance: "error" });
    }
    if (
      bvn.toString().length === 11 &&
      firstname.length !== 0 &&
      lastname.length !== 0
    ) {
      const dob = `${dateOfBirth?.date()}-${
        dateOfBirth?.month ? dateOfBirth.month() + 1 : "01"
      }-${dateOfBirth?.year()}`;
      const form = {
        token: Cookies.get("token"),
        wallet_id: userContext?.wallet?.wallet_id,
        dob,
        lastname,
        firstname,
      };
      setVirtualAccountLoading(true);
      const r: DefaultResponse = await PerformRequest({
        route: Endpoints.GenerateVirtualAccount,
        data: form,
        method: "POST",
      }).catch(() => {
        setVirtualAccountLoading(false);
      });
      setVirtualAccountLoading(false);
      const { status, message } = r.data;
      if (status) {
        addToast(message, { appearance: "info" });
      } else {
        addToast("An error occurred", { appearance: "error" });
      }
      console.log(form);
    }
  };
  const [isVirtualAccountLoading, setVirtualAccountLoading] =
    useState<boolean>(false);
  const doesVirtualAccountExist = false;
  // const doesVirtualAccountExist = userContext?.wallet?.virtual_account
  //   .virtual_account_no
  //   ? userContext.wallet.virtual_account.virtual_account_no.length > 0
  //   : false;
  const getUserBankInformation = (param: "name" | "number") => {
    if (userContext?.user) {
      const { bank_name, account_no } = userContext.user.bank_details;
      switch (param) {
        case "name":
          return bank_name && bank_name.length > 0
            ? bank_name
            : "Bank not added";
          break;
        case "number":
          return account_no && account_no.length > 0
            ? account_no
            : "Bank not added";
          break;
      }
    } else {
      return "Bank not added";
    }
  };

  const UpdateBankAccount = async () => {
    const { number, bankCode } = bankForm;
    removeAllToasts();
    if (number.length !== 10) {
      addToast("Please enter a valid account number", { appearance: "error" });
    }
    if (bankCode.length === 0) {
      addToast("Please select a bank!", { appearance: "error" });
    }
    if (bankCode.length !== 0 && number.length === 10) {
      setBankUploading(true);
      const r: DefaultResponse = await PerformRequest({
        route: Endpoints.UpdateBankAccount,
        method: "POST",
        data: {
          token: Cookies.get("token"),
          bank_code: bankCode,
          account_no: number,
        },
      }).catch(() => {
        setBankUploading(false);
      });
      setBankUploading(false);
      console.log(r);
      if (r && r.data) {
        const { status } = r.data;
        if (status === "success") {
          setEditBankDetails(false);
        }
        addToast(r.data.message, {
          appearance: status === "success" ? "success" : "error",
        });
      }
    }
  };

  const [isWalletTransferModalShown, setWalletTransferModalShown] =
    useState<boolean>(false);
  const PerformWalletTransfer = async () => {
    const { amount, walletID } = walletTransferForm;
    removeAllToasts();
    if (walletID.length === 0) {
      addToast("Please enter the Wallet ID", { appearance: "error" });
    }
    if (isNaN(parseInt(amount)) || parseInt(amount) < 100) {
      addToast("Minimum transfer amount is ₦100", { appearance: "error" });
    }
    if (parseInt(amount) >= 100 && walletID.length > 0) {
      setLoading(true);
      const r: DefaultResponse = await PerformRequest({
        route: Endpoints.ProcessWalletTransfer,
        data: { wallet_id: walletID, amount, token: Cookies.get("token") },
        method: "POST",
      }).catch(() => {
        setLoading(false);
      });
      setLoading(false);
      const status = r.data && r.data.status ? r.data.status : "error";
      addToast(r.data.message, {
        appearance: status === "success" ? "success" : "error",
      });

      console.log(r);
    }
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
            {/* <div className="flex-row width-100 justify-between actions"> */}
            <Grid
              container
              className="actions"
              justifyContent="space-between"
              spacing={3}
            >
              {doesVirtualAccountExist ? (
                <Grid item className="actions-grid-item">
                  <CopyToClipboard
                    text={
                      userContext.wallet?.virtual_account.virtual_account_no ??
                      " "
                    }
                    onCopy={() => {
                      removeAllToasts();
                      addToast("Account number copied to clipboard!", {
                        appearance: "success",
                      });
                    }}
                  >
                    <div className="flex-col justify-between bank">
                      <span className="text-darker px-16 fw-500 label">
                        Virtual Account Details
                      </span>
                      <div className="flex-row align-center">
                        <span className="icon px-20 flex-row align-center justify-center">
                          <i className="far fa-university" />
                        </span>
                        &nbsp; &nbsp;
                        <span className="name">
                          {
                            userContext.wallet?.virtual_account
                              .virtual_account_bank_name
                          }
                        </span>
                      </div>
                      <span className="account">
                        {
                          userContext.wallet?.virtual_account
                            .virtual_account_name
                        }
                      </span>
                      <span className="number text-blue-default">
                        {userContext.wallet?.virtual_account.virtual_account_no}
                      </span>
                    </div>
                  </CopyToClipboard>
                </Grid>
              ) : (
                <>
                  <Modal
                    open={isVirtualAccountModalShowing}
                    onClose={() => {
                      setVirtualAccountModalShowing(false);
                    }}
                  >
                    <div className="generate-virtual-account flex-col">
                      <div className="flex-row justify-between align-center">
                        <span className="px-500">Generate Virtual Account</span>
                        <span
                          className="pointer px-17"
                          onClick={() => {
                            console.log(userContext.user);
                            setVirtualAccountModalShowing(false);
                          }}
                        >
                          <i className="far fa-times" />
                        </span>
                      </div>

                      <div className="flex-row width-100 justify-between">
                        <input
                          type="text"
                          value={virtualAccountForm.firstname}
                          onChange={(e) => {
                            setVirtualAccountForm({
                              ...virtualAccountForm,
                              firstname: e.target.value,
                            });
                          }}
                          spellCheck={false}
                          className="input input-half"
                          placeholder="Enter Firstname..."
                        />
                        <input
                          type="text"
                          value={virtualAccountForm.lastname}
                          onChange={(e) => {
                            setVirtualAccountForm({
                              ...virtualAccountForm,
                              lastname: e.target.value,
                            });
                          }}
                          spellCheck={false}
                          className="input input-half"
                          placeholder="Enter Lastname..."
                        />
                      </div>
                      <input
                        type="number"
                        value={virtualAccountForm.bvn}
                        onChange={(e) => {
                          setVirtualAccountForm({
                            ...virtualAccountForm,
                            bvn: e.target.value,
                          });
                        }}
                        spellCheck={false}
                        className="input"
                        placeholder="BVN"
                      />
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={["DatePicker"]}>
                          <DatePicker
                            label="Basic date picker"
                            value={virtualAccountForm.dateOfBirth}
                            onChange={(e) =>
                              setVirtualAccountForm({
                                ...virtualAccountForm,
                                dateOfBirth: e,
                              })
                            }
                          />
                        </DemoContainer>
                      </LocalizationProvider>
                      <Button
                        color="primary"
                        variant="contained"
                        disabled={isVirtualAccountLoading}
                        onClick={GenerateVirtualAccount}
                      >
                        {isVirtualAccountLoading ? (
                          <ProgressCircle />
                        ) : (
                          "Generate Virtual Account"
                        )}
                      </Button>
                    </div>
                  </Modal>
                  <Grid item className="actions-grid-item">
                    <div className="flex-col justify-between user-bank">
                      <span className="text-darker px-16 fw-500 label">
                        Virtual Account Details
                      </span>
                      <span className="px-15 fw-500">
                        No virtual account found!
                      </span>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          setVirtualAccountModalShowing(true);
                        }}
                      >
                        Create Virtual Account
                      </Button>
                    </div>
                  </Grid>
                </>
              )}
              <Grid item className="actions-grid-item">
                <div className="flex-col justify-between transfer">
                  <div className="flex-row align-center">
                    <span className="text-white px-16 fw-500 label">
                      Wallet Transfer
                    </span>
                    &nbsp; &nbsp;
                    <span className="icon px-20 flex-row align-center justify-center text-white">
                      <i className="far fa-shopping-bag" />
                    </span>
                  </div>
                  <span className="px-15 text-white">
                    Transfer funds from your wallet to another wallet
                  </span>
                  <button
                    className="pay"
                    onClick={() => {
                      setWalletTransferModalShown(true);
                    }}
                    disabled={isLoading}
                  >
                    Continue
                    {/* {isLoading ? <ProgressCircle /> : "Continue"} */}
                  </button>
                </div>
                <Modal
                  open={isWalletTransferModalShown}
                  onClose={() => {
                    setWalletTransferModalShown(false);
                  }}
                >
                  <div className="wallet-transfer-modal flex-col">
                    <div className="flex-row justify-between align-center">
                      <span className="px-500">Transfer from Wallet</span>
                      <span
                        className="pointer px-17"
                        onClick={() => {
                          setWalletTransferModalShown(false);
                        }}
                      >
                        <i className="far fa-times" />
                      </span>
                    </div>
                    <>
                      <input
                        type="text"
                        placeholder="Input Wallet ID"
                        className="input"
                        value={walletTransferForm.walletID}
                        onChange={(e) => {
                          setWalletTransferForm({
                            ...walletTransferForm,
                            walletID: e.target.value,
                          });
                        }}
                      />
                      <input
                        type="number"
                        value={walletTransferForm.amount}
                        onChange={(e) => {
                          setWalletTransferForm({
                            ...walletTransferForm,
                            amount: e.target.value,
                          });
                        }}
                        placeholder="Enter Amount"
                        className="input"
                      />
                    </>

                    <button
                      className="pay"
                      onClick={() => {
                        PerformWalletTransfer();
                      }}
                      disabled={isLoading}
                    >
                      {isLoading ? <ProgressCircle /> : "Continue"}
                    </button>
                  </div>
                </Modal>
              </Grid>
              <Grid item className="actions-grid-item">
                <div className="flex-col justify-between user-bank">
                  <div className="flex-row width-100 justify-between align-center">
                    <span className="text-darker px-16 fw-500 label">
                      Bank Details
                    </span>
                    <span
                      className="text-darker px-16 fw-500 text-green-primary flex-row align-center pointer"
                      onClick={() => {
                        setEditBankDetails(!isEditBankDetails);
                      }}
                    >
                      {isEditBankDetails ? (
                        <>Cancel &nbsp;</>
                      ) : (
                        <>
                          Edit &nbsp;
                          <i className="far fa-pencil" />
                        </>
                      )}
                    </span>
                  </div>
                  {isEditBankDetails ? (
                    <>
                      <input
                        type="number"
                        className="number"
                        placeholder="Account number"
                        maxLength={10}
                        value={bankForm.number}
                        onChange={(e) => {
                          setBankForm({
                            ...bankForm,
                            number: e.target.value,
                          });
                        }}
                      />
                      <FormControl fullWidth size="small">
                        <InputLabel id="demo-simple-select-label">
                          Select Bank
                        </InputLabel>
                        <Select
                          label="Select Bank"
                          placeholder="Select Bank"
                          value={bankForm.bankCode}
                          onChange={(e) => {
                            setBankForm({
                              ...bankForm,
                              bankCode: e.target.value,
                            });
                          }}
                        >
                          <MenuItem value="">None</MenuItem>
                          {userContext.banks.map((bank) => {
                            return (
                              <MenuItem value={bank.bank_code}>
                                {bank.bank_name}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                      <button
                        className="submit"
                        type="button"
                        onClick={() => UpdateBankAccount()}
                        disabled={isBankUploading}
                      >
                        {isBankUploading ? <ProgressCircle /> : "Submit"}
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="flex-row align-center">
                        <span className="name">
                          {getUserBankInformation("name")}
                        </span>
                      </div>
                      <span className="text-blue-default">
                        {getUserBankInformation("number")}
                      </span>
                    </>
                  )}
                </div>
              </Grid>
            </Grid>
            {/* </div> */}
          </>
        ) : (
          <MegaLoader />
        )}
      </div>
    </Container>
  );
}
