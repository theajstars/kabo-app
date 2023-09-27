import React, { useState, useEffect, useContext } from "react";

import { useNavigate, Link } from "react-router-dom";

import { useToasts } from "react-toast-notifications";
import Cookies from "js-cookie";
import { Modal, TextField, MenuItem } from "@mui/material";

import { TeamMember } from "../../Lib/Types";

import "./styles.scss";
import { PerformRequest } from "../../Lib/PerformRequest";
import { Endpoints } from "../../Lib/Endpoints";
import { DefaultResponse, GetTeamResponse } from "../../Lib/Responses";
import MegaLoader from "../../Misc/MegaLoader";
import { AppContext } from "../DashboardContainer";
import { DataGrid } from "@mui/x-data-grid";
import { GridColDef, GridColTypeDef } from "@mui/x-data-grid/models";
import { Button } from "@mui/material";
import ProgressCircle from "../../Misc/ProgressCircle";
import { validateEmail } from "../../Lib/Methods";

interface MemberFormProps {
  email?: string;
  role?: string;
}

export default function Team() {
  const navigate = useNavigate();
  const userContext = useContext(AppContext);
  const { addToast, removeAllToasts } = useToasts();

  const [isLoading, setLoading] = useState<boolean>(false);
  const [team, setTeam] = useState<TeamMember[]>([]);

  const [isModalShowing, setModalShowing] = useState<boolean>(false);

  const [memberForm, setMemberForm] = useState<MemberFormProps>({
    email: "",
    role: "admin",
  });
  // Product Search Params Begin
  const [rowCount, setRowCount] = useState<number>(0);
  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: 10,
    page: 0,
  });
  // Product Search Params End
  const getTeamMembers = async () => {
    const token = Cookies.get("token");
    setLoading(true);
    const r: GetTeamResponse = await PerformRequest({
      route: Endpoints.GetTeam,
      method: "POST",
      data: {
        token: token,
        store: Cookies.get("user_store_id"),
        page: paginationModel.page,
        limit: paginationModel.pageSize,
      },
    }).catch(() => {
      setLoading(false);
    });
    setLoading(false);
    if (r.data && r.data.data) {
      setTeam(r.data.data);
      setRowCount(r.data.counts);
    }
  };
  useEffect(() => {
    getTeamMembers();
  }, [paginationModel]);

  const tableColProps: GridColTypeDef = {
    flex: 1,
  };
  const tableColumns: GridColDef<TeamMember>[] = [
    {
      field: "fullname",
      headerName: "Name",
      // ...tableColProps,
      width: 220,
    },

    {
      field: "email",
      headerName: "Email Address",
      ...tableColProps,
    },
    {
      field: "role",
      headerName: "Role",
      ...tableColProps,
      renderCell: (params) => {
        return <span className="capitalize">{params.row.role}</span>;
      },
    },
    {
      field: "phone",
      headerName: "Phone",
      ...tableColProps,
    },
    {
      field: "priviledge",
      headerName: "Priviledge",
      ...tableColProps,
      renderCell: (params) => {
        return (
          <span
            className={
              params.row.priviledge === "Yes"
                ? "text-green-primary"
                : "text-red-primary"
            }
          >
            {params.row.active === "Yes" ? "Yes" : "No"}
          </span>
        );
      },
    },
  ];

  const ClearMemberForm = () => {
    setMemberForm({
      ...memberForm,
      email: "",
    });
  };
  const AddMember = async () => {
    const { role, email } = memberForm;
    if (role && email) {
      const isEmailValid = validateEmail(email);
      if (!isEmailValid) {
        addToast("Please enter a valid email!", { appearance: "warning" });
      } else {
        setLoading(true);
        const token = Cookies.get("token");
        const r: DefaultResponse = await PerformRequest({
          method: "POST",
          route: Endpoints.AddTeamMember,
          data: {
            token,
            email,
            role,
          },
        }).catch(() => {
          setLoading(false);
        });
        setLoading(false);
        if (r.data && r.data.status === "success") {
          addToast("Added successfully!", { appearance: "success" });
          ClearMemberForm();
          setModalShowing(false);
          getTeamMembers();
        } else {
          addToast(r.data.message, { appearance: "error" });
        }
      }
    }
  };
  return (
    <div className="team-container flex-col width-100">
      {userContext?.user ? (
        <>
          <div className="top width-100 flex-col">
            <div className="flex-row width-100 align-center justify-between">
              <span className="text-dark fw-500 px-20">Team</span>
              <Button
                onClick={() => {
                  setModalShowing(true);
                }}
                sx={{ height: "35px", fontSize: "12px" }}
                variant="contained"
                type="button"
              >
                Add Member
              </Button>
            </div>
          </div>
          {isLoading ? (
            <ProgressCircle />
          ) : (
            <DataGrid
              loading={isLoading}
              className="table"
              columns={tableColumns}
              rows={team}
              getRowId={(row) => row.email}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              pageSizeOptions={[5, 10, 25]}
              rowCount={rowCount}
            />
          )}
        </>
      ) : (
        <MegaLoader />
      )}
      <Modal
        open={isModalShowing}
        onClose={() => {
          setModalShowing(false);
        }}
        className="modal"
      >
        <div className="add-team flex-col">
          <div className="header width-100 text-center flex-row align-center justify-center">
            <span className="text-white px-14">Add Team Member</span>
          </div>
          <div className="body flex-col align-center">
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              disabled={isLoading}
              size="small"
              spellCheck={false}
              value={memberForm.email}
              onChange={(e) => {
                setMemberForm({ ...memberForm, email: e.target.value });
              }}
              sx={{
                mb: "20px",
              }}
            />

            <TextField
              fullWidth
              select
              label="Role"
              variant="outlined"
              disabled={isLoading}
              size="small"
              spellCheck={false}
              value={memberForm.role}
              onChange={(e) => {
                setMemberForm({ ...memberForm, role: e.target.value });
              }}
              sx={{
                mb: "20px",
              }}
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="rider">Rider</MenuItem>
            </TextField>

            <Button
              type="button"
              disabled={isLoading}
              variant="contained"
              color="primary"
              sx={{ width: "120px" }}
              onClick={AddMember}
            >
              {isLoading ? <ProgressCircle /> : "Add"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
