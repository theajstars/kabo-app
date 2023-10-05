import React, { useState, useEffect } from "react";

import { Link, useNavigate } from "react-router-dom";

import {
  Box,
  CardContent,
  Typography,
  TextField,
  Checkbox,
  Button,
  FormControlLabel,
} from "@mui/material";
import Cookies from "js-cookie";
import { useToasts } from "react-toast-notifications";
import { appConfig } from "../../Lib/appConfig";

import { PerformRequest } from "../../Lib/PerformRequest";
import { Endpoints } from "../../Lib/Endpoints";
import { DefaultResponse, LoginResponse } from "../../Lib/Responses";
import { validateEmail } from "../../Lib/Methods";
import ProgressCircle from "../../Misc/ProgressCircle";

import Logo from "../../Assets/IMG/Logo.png";

import "./styles.scss";
interface FormValues {
  email: string;
}
export default function ResetPassword() {
  const navigate = useNavigate();
  const { addToast, removeAllToasts } = useToasts();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<FormValues>({
    email: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    removeAllToasts();
    e.preventDefault();
    const { email } = formValues;
    const isEmailValid = validateEmail(email);
    if (isEmailValid) {
      setLoading(true);
      const r: DefaultResponse = await PerformRequest({
        method: "POST",
        data: { email },
        route: Endpoints.RecoverAccount,
      }).catch(() => setLoading(false));
      setLoading(false);
      if (r && r.data.status === "success") {
        console.log(r.data);
        addToast(r.data.message, { appearance: "success" });
      } else {
        addToast(r.data.message, { appearance: "error" });
      }
      console.log(r);
    }
    if (!isEmailValid) {
      addToast("Please enter a valid email!", { appearance: "error" });
    }
  };

  return (
    <div className="login-container flex-col width-100">
      <div className="content">
        <CardContent>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img src={Logo} alt="" className="logo" />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: 600, marginBottom: 1.5 }}
            >
              Recover your account
            </Typography>
            <Typography variant="body2">
              Please provide your email address
            </Typography>
          </Box>

          <form noValidate autoComplete="off" onSubmit={handleSubmit}>
            <TextField
              autoFocus
              fullWidth
              id="email"
              label="Email"
              size="small"
              type={"email"}
              value={formValues.email}
              onChange={(e) =>
                setFormValues({ ...formValues, email: e.target.value })
              }
            />
            <br />
            <br />

            <Button
              fullWidth
              size="large"
              sx={{
                height: "35px",
                fontSize: "15px",
                textTransform: "capitalize",
              }}
              disabled={isLoading}
              variant="contained"
              type="submit"
            >
              {isLoading ? <ProgressCircle /> : "Reset"}
            </Button>
          </form>
          <br />
          <div className="flex-row align-center justify-between">
            <span className="px-14">Don't have an account?</span>
            <Link className="text-blue-default" to="/register">
              Register
            </Link>
          </div>
        </CardContent>
      </div>
      <br />
      <div className="flex-row align-center justify-between">
        <Link className="text-blue-default" to="/login">
          Back to Login
        </Link>
      </div>
    </div>
  );
}
