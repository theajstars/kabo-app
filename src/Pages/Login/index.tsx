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
import { LoginResponse } from "../../Lib/Responses";
import { validateEmail } from "../../Lib/Methods";
import ProgressCircle from "../../Misc/ProgressCircle";

import Logo from "../../Assets/IMG/Logo.png";

import "./styles.scss";
interface FormValues {
  email: string;
  password: string;
  showPassword: boolean;
}
export default function Login() {
  const navigate = useNavigate();
  const { addToast, removeAllToasts } = useToasts();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<FormValues>({
    email: "",
    password: "",
    showPassword: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    removeAllToasts();
    e.preventDefault();
    const { email, password } = formValues;
    const isEmailValid = validateEmail(email);
    if (isEmailValid && password.length > 4) {
      setLoading(true);
      const r: LoginResponse = await PerformRequest({
        method: "POST",
        data: { email, passcode: password },
        route: Endpoints.LoginUser,
      }).catch(() => setLoading(false));
      setLoading(false);
      if (r && r.data.status === "success") {
        console.log(r.data);
        Cookies.set("token", r.data.token);
        const storeIdObject = r.data?.data?.store_id;
        if (storeIdObject) {
          const values = Object.values(storeIdObject);
          const id =
            values.filter((v) => v !== null && v !== undefined)[0] ?? "";
          Cookies.set("user_store_id", id);
        }

        addToast("Log in successful", { appearance: "success" });
        navigate("/dashboard");
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
    <div className="login-container flex-row width-100">
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

          <Box sx={{ mb: 6 }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: 600, marginBottom: 1.5 }}
            >
              Welcome to {appConfig.appName}!
            </Typography>
            <Typography variant="body2">
              Please sign-in to your account and start the adventure
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
            <TextField
              autoFocus
              fullWidth
              id="password"
              label="password"
              size="small"
              type={formValues.showPassword ? "text" : "password"}
              value={formValues.password}
              onChange={(e) =>
                setFormValues({ ...formValues, password: e.target.value })
              }
            />

            <br />
            <small
              className="px-12 pointer text-dark"
              onClick={() => {
                setFormValues({
                  ...formValues,
                  showPassword: !formValues.showPassword,
                });
              }}
            >
              {formValues.showPassword ? "Hide" : "Show"} Password &nbsp;
              {formValues.showPassword ? (
                <i className="far fa-eye-slash" />
              ) : (
                <i className="far fa-eye" />
              )}
            </small>
            <Box
              sx={{
                mt: 2,
                mb: 2,
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}
            >
              <FormControlLabel control={<Checkbox />} label="Remember Me" />
            </Box>

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
              {isLoading ? <ProgressCircle /> : "Login"}
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
    </div>
  );
}
