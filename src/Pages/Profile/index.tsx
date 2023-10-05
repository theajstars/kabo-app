import React, { useState, useEffect, useContext, useRef } from "react";

import { useNavigate, Link } from "react-router-dom";

import { useToasts } from "react-toast-notifications";
import Cookies from "js-cookie";
import { motion } from "framer-motion";
import { Container, TextField, TextFieldProps, Button } from "@mui/material";

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
import { validateEmail, validatePhoneNumber } from "../../Lib/Methods";

import "./styles.scss";
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
  const inputFileRef = useRef<HTMLInputElement>(null);
  const { addToast, removeAllToasts } = useToasts();

  const [isLoading, setLoading] = useState<boolean>(false);
  const [isHoverAvatar, setHoverAvatar] = useState<boolean>(false);

  const [userImage, setUserImage] = useState<File | null>(null);
  const [imageUploading, setImageUploading] = useState<boolean>(false);
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
    const isPhoneValid = validatePhoneNumber(phone);
    if (
      firstName.length === 0 ||
      lastName.length === 0 ||
      address.length === 0 ||
      !isPhoneValid ||
      !isEmailValid
    ) {
      addToast("Please fill the form correctly!", { appearance: "error" });
    } else {
      const token = Cookies.get("token");
      setLoading(true);
      const r: DefaultResponse = await PerformRequest({
        route: Endpoints.UpdateAccount,
        method: "POST",
        data: {
          token,
          email,
          othernames: firstName,
          lastname: lastName,
          address,
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

  const getUserImage: any = () => {
    if (userContext && userContext.user) {
      const photo = userContext.user.photo ?? "";
      if (photo.length > 0) {
        return photo;
      } else {
        return DefaultUserImage;
      }
    }
  };
  const UploadUserImage = async (file: File) => {
    setImageUploading(true);
    const r: UploadFileResponse = await UploadFile(file).catch(() => {
      setImageUploading(false);
      addToast("An error occurred!", { appearance: "error" });
    });

    console.log("Upload response", r);
    if (r.data && r.data.status === "success") {
      const r2: DefaultResponse = await PerformRequest({
        route: Endpoints.UpdateAccount,
        method: "POST",
        data: {
          token: Cookies.get("token"),
          photo: r.data.file_url,
        },
      }).catch(() => {
        setImageUploading(false);
      });
      console.log("Profile response", r2);
      setImageUploading(false);
    }
  };
  useEffect(() => {
    console.log(userImage);
  }, [userImage]);
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
    disabled: isLoading,
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
            <input
              type="file"
              accept=".png, .jpg, .jpeg"
              className="display-none"
              ref={inputFileRef}
              onChange={(e) => {
                const fileList = e.target.files;
                const file = fileList ? fileList[0] : undefined;
                if (file) {
                  setUserImage(file);
                }
              }}
            />
            <div className="top width-100 flex-col">
              <div className="flex-row width-100 align-center justify-between">
                <span className="text-dark fw-500 px-20">
                  Profile Information
                </span>
              </div>
            </div>
            <div className="profile flex-col width-100">
              <div className="flex-row align-center">
                <div
                  className="avatar pointer flex-col"
                  style={{
                    backgroundImage: `url(${
                      userImage
                        ? URL.createObjectURL(userImage)
                        : getUserImage()
                    })`,
                  }}
                  onMouseEnter={() => {
                    setHoverAvatar(true);
                  }}
                  onMouseLeave={() => {
                    setHoverAvatar(false);
                  }}
                  onClick={() => {
                    inputFileRef.current?.click();
                  }}
                >
                  <motion.span
                    initial={false}
                    animate={{
                      display: isHoverAvatar ? "flex" : "none",
                    }}
                    className="align-center justify-center"
                  >
                    Upload New
                  </motion.span>
                </div>
                &nbsp; &nbsp; &nbsp;
                <Button
                  type="button"
                  color="primary"
                  variant="contained"
                  onClick={() => {
                    if (userImage) {
                      UploadUserImage(userImage);
                    }
                  }}
                  sx={{
                    height: "35px",
                    width: "150px",
                    fontSize: "12px",
                  }}
                  disabled={isLoading || imageUploading || userImage === null}
                >
                  {isLoading || imageUploading ? (
                    <ProgressCircle />
                  ) : (
                    "Upload Image"
                  )}{" "}
                </Button>
              </div>

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
                  placeholder="Address"
                  label="Address"
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
                disabled={isLoading}
                sx={{ height: "35px", fontSize: "12px" }}
                variant="contained"
                type="button"
              >
                {isLoading ? <ProgressCircle /> : "Submit"}
              </Button>
            </div>
          </>
        ) : (
          <MegaLoader />
        )}
      </div>
    </Container>
  );
}
