import React, { useState, useEffect, useContext } from "react";

import { useNavigate, Link } from "react-router-dom";

import { useToasts } from "react-toast-notifications";
import Cookies from "js-cookie";
import { Container, TextField, TextFieldProps } from "@mui/material";

import { Product, User } from "../../Lib/Types";

import ProductsIcon from "../../Assets/IMG/ProductsIconDark.svg";
import OrdersIcon from "../../Assets/IMG/OrdersIconDark.svg";

import Logo from "../../Assets/IMG/Logo.png";

import "./styles.scss";
import { PerformRequest } from "../../Lib/PerformRequest";
import { Endpoints } from "../../Lib/Endpoints";
import { GetProductsResponse, LoginResponse } from "../../Lib/Responses";
import MegaLoader from "../../Misc/MegaLoader";
import { AppContext } from "../DashboardContainer";
import { DataGrid } from "@mui/x-data-grid";
import { GridColDef, GridColTypeDef } from "@mui/x-data-grid/models";
import { Button } from "@mui/material";
import ProgressCircle from "../../Misc/ProgressCircle";
import { validateEmail } from "../../Lib/Methods";

interface ProfileFormProps {
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  email: string;
  photo: string;
}
export default function Profile() {
  const navigate = useNavigate();
  const userContext = useContext(AppContext);
  const { addToast, removeAllToasts } = useToasts();

  const [isLoading, setLoading] = useState<boolean>(false);

  const [profileForm, setProfileForm] = useState<ProfileFormProps>({
    firstName: "",
    lastName: "",
    address: "",
    phone: "",
    email: "",
    photo: "",
  });
  const SubmitProfile = async () => {
    console.log(profileForm);
    removeAllToasts();
    const { firstName, lastName, address, email, phone } = profileForm;
    const isEmailValid = validateEmail(email);
    if (
      firstName.length === 0 ||
      lastName.length === 0 ||
      address.length === 0 ||
      phone.length !== 11 ||
      !isEmailValid
    ) {
      addToast("Please fill the form correctly!", { appearance: "error" });
    } else {
      const token = Cookies.get("token");
      setLoading(true);
      const r: GetProductsResponse = await PerformRequest({
        route: Endpoints.UpdateAccount,
        method: "POST",
        data: {
          token: token,
          data: {
            token,
            email,
            firstName,
            lastName,
            address,
          },
        },
      }).catch(() => {
        setLoading(false);
      });
      setLoading(false);
      if (userContext) {
        userContext?.getUser();
      }
    }
  };

  useEffect(() => {
    if (userContext) {
      if (userContext.user) {
        const { user } = userContext;
        setProfileForm({
          firstName: user?.othernames,
          lastName: user?.lastname,
          email: user.email,
          address: user.address,
          phone: user.phone,
          photo: user.photo,
        });
      }
    }
  }, [userContext]);

  const textFieldProps: TextFieldProps = {
    variant: "outlined",
    size: "small",
    sx: {
      mt: "30px",
    },
  };
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case "firstName":
        setProfileForm({ ...profileForm, firstName: value });
        break;
      case "lastName":
        setProfileForm({ ...profileForm, lastName: value });
        break;
      case "address":
        setProfileForm({ ...profileForm, address: value });
        break;
      case "phone":
        setProfileForm({ ...profileForm, phone: value });
        break;
      case "email":
        setProfileForm({ ...profileForm, email: value });
        break;
    }
  };
  return (
    <Container maxWidth="lg">
      <div className="profile-container flex-col width-100">
        {userContext?.user ? (
          <>
            <div className="top width-100 flex-col">
              <div className="flex-row width-100 align-center justify-between">
                <span className="text-dark fw-500 px-20">
                  Profile Information
                </span>
              </div>
            </div>
            {isLoading ? (
              <ProgressCircle />
            ) : (
              <div className="profile flex-col width-100">
                <div className="flex-row align-center width-10 justify-between profile-row">
                  <TextField
                    name="firstName"
                    value={profileForm.firstName}
                    placeholder="First Name"
                    label="First Name"
                    onChange={handleFormChange}
                    {...textFieldProps}
                    fullWidth
                  />
                  &nbsp; &nbsp; &nbsp; &nbsp;
                  <TextField
                    name="lastName"
                    value={profileForm.lastName}
                    placeholder="Last Name"
                    label="Last Name"
                    onChange={handleFormChange}
                    {...textFieldProps}
                    fullWidth
                  />
                </div>
                <div className="flex-row align-center width-10 justify-between profile-row">
                  <TextField
                    name="phone"
                    value={profileForm.phone}
                    placeholder="Phone"
                    label="Phone"
                    onChange={handleFormChange}
                    {...textFieldProps}
                    fullWidth
                  />
                  &nbsp; &nbsp; &nbsp; &nbsp;
                  <TextField
                    name="email"
                    value={profileForm.email}
                    placeholder="Email Address"
                    label="Email Address"
                    onChange={handleFormChange}
                    {...textFieldProps}
                    fullWidth
                  />
                </div>
                <div className="flex-row align-center width-10 justify-between profile-row">
                  <TextField
                    name="address"
                    value={profileForm.address}
                    placeholder="Store Address"
                    label="Store Address"
                    onChange={handleFormChange}
                    {...textFieldProps}
                    fullWidth
                  />
                </div>

                <br />
                <Button
                  onClick={(e) => {
                    SubmitProfile();
                  }}
                  sx={{ height: "35px", fontSize: "12px" }}
                  variant="contained"
                  type="button"
                >
                  Submit
                </Button>
              </div>
            )}
          </>
        ) : (
          <MegaLoader />
        )}
      </div>
    </Container>
  );
}
