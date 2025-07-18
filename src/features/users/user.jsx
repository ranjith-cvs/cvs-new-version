import React, { useState, useEffect, useRef  } from "react";
import { Alert, Box, Snackbar,TableContainer,CircularProgress, Card} from "@mui/material";
import { Close,Done, ModeEditOutlineOutlined, DeleteOutlineOutlined } from "@mui/icons-material";
import getFetch from "../../services/commonApi";
// import '../style/covalsys.css'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// import { auditLog } from "../utils/auditLogService";
import CustomListTable from "../../utils/customListTable";
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { fetchRoleList, setSelectedRole } from "../../store/actions/roleAction";
import { fetchBranchList, setSelectedBranch } from "../../store/actions/branchAction";

const Users = () => {
  const didInit = useRef(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { settingsName, settingsStatus } = useSelector((state) => state.setting);
  const { selectedRoleId, roleList } = useSelector(state => state.role);
  console.log(roleList,"kkkkkkkkkkkkkkkkkkkkk")
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [snackOpen, setSnackOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [editData, seteditData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [isEditing, setisEditing] = useState(true);
  const [btnText, setbtnText] = useState("Submit");
  const [editingUserID, setEditingUserID] = useState('');
  const [deleteUser, setDeleteUser] = useState('');
   const [isLoading, setIsLoading] = useState(true);
  const [userRole, setRole] = useState([]);
  const [userDepart, setDepart] = useState([]);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [supplierData, setSupplierData] = useState([]);
  const [isDepartmentDisabled, setIsDepartmentDisabled] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [entityData, setEntityData] = useState([]);
  const [editingDocEntry, setEditingDocEntry] = useState('');
  

  const [formData, setFormData] = useState({
    userName: "",
    password: "",
    companyName: "",
    emailID: "",
    status: "",
    roleName: "",
    //departmentName:""    
  });

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    fetchInfo();
    dispatch(fetchBranchList());
    dispatch(fetchRoleList());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "userName") {
      const existingUser = data.find((user) => user.userName === value);
      if (existingUser) {
        setMessage("Username already exists");
        setSeverity("error");
        setSnackOpen(true);
        setFormData({
          ...formData,
          userName: "",
        });
      } else {
        setMessage("");
        setSeverity("");
        setSnackOpen(false);
        setFormData({
          ...formData,
          [name]: value,
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };


  const fetchInfo = () => {
    getFetch("Users", "GET")
      .then((data) => {
        setData(data);
        setIsLoading(false);
      })
      .catch((error) => {
        navigate('/app/error', {
          state: {
            errorMessage: data.message || "An error occurred.",
            errorCode: data.statusCode,
            errorName: data.errorName || "No additional information available."
          }
        });
        setIsLoading(false);
      });
  };

  

  const handleClickOpen = () => {
    setFormData([])
    setOpen(true);
    setbtnText("Submit");
    setIsUpdateMode(false);
    seteditData([]);
    setEntityData([])
    // RoleFetch();
  };

  const handleClickEdit = (e) => {
    let userUrl = `Users/Edit/?userID=${e}`;
    let entityUrl = `Entity/Edit/?userId=${e}`;
    setisEditing(false);
    setbtnText("Update");
    setOpen(true);
    setIsUpdateMode(true);
    setEditingUserID(e);
    setIsLoading(true);

    // Fetch both User and Entity data in parallel
    Promise.all([getFetch(userUrl, "GET"), getFetch(entityUrl, "GET")])
      .then(([userData, entityData]) => {
        console.log("User Data:", userData);
        console.log("Entity Data:", entityData);

        setFormData((prevFormData) => ({
          ...prevFormData,
          ...userData,
        }));

        if (entityData) {
          const entityArray = Object.values(entityData).filter(
            (item) => typeof item === "object" && item.entityName
          );
          setEntityData(entityArray); // Set entity data for editing
        }
        // Check roleName only for Users
        if (userData.roleName === "Supplier") {
          setIsDepartmentDisabled(false);
        } else {
          setIsDepartmentDisabled(true);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Fetch error:", error.message);
        navigate("ErrorPage");
        setIsLoading(false);
      });
  };


 
  const handleSubmit = (e) => {
    console.log("btn update");
    e.preventDefault();
    const isEdit = editingUserID != 0; // Check if userID exists
    const methodEdit = isEdit ? "PUT" : "POST"; // Set method based on userID existence
    formData.userID = isEdit ? editingUserID : 0; // Set userID to null if not editing
    setFormData(formData);
    const validationResult = validateFormData(formData); // validate the form data
    let url = `Users/POST`;
    if (validationResult.isValid) {
      const _data = { ...formData };

      if (methodEdit == "PUT") {
        url = `Users/PUT`;
        const roleID = userRole.find((item) => item.roleName === _data.roleName).roleID;
        _data.roleName = roleID.toString(); // Set roleID value instead of roleName
        // const depID = userDepart.find((item) => item.departmentName === _data.departmentName).departmentId;
        // _data.departmentName = depID.toString(); // Set DepartmentID value instead of roleName
      }
      setFormData((prevFormData) => ({ ...prevFormData, ..._data }));
      setIsLoading(false);
      getFetch(url, "POST", _data)
        .then((data) => {
          if (data.statusCode === 200 || data.statusCode === 204) {
            setMessage(data.message);
            const safeEntityData = Array.isArray(entityData) ? entityData : [];
            const userId = data.userID || safeEntityData[0]?.userId || formData.userID;
            if (data.statusCode === 200) {
              const emailPayload = {
                email: _data.emailID,
                password: _data.password,
                userName: _data.userName
              };
              const eamilbody = JSON.stringify(emailPayload)
              console.log("The user mail sending data", emailPayload)
              getFetch("Users/send-user-credentials", "POST", emailPayload)
                .then(res => console.log("Email sent:", res))
                .catch(err => console.error("Failed to send email:", err.message));
            }
            auditLog(userId, "User Admin")
            const updatedEntityData = safeEntityData.map((item) => {
              const matchedEntity = userDepart.find((dep) => dep.entityName == item.entityName);
              return {
                ...item,
                userId: userId,
                entityId: matchedEntity ? matchedEntity.entityId : "" // Assign entityID if found, else empty
              };
            });
            //auditLog(userId, "User Admin");
            const filteredEntityData = updatedEntityData.filter(item => item.docEntry === undefined || item.docEntry === null);
            if (filteredEntityData.length > 0) {
              getFetch("Entity", "POST", filteredEntityData)
                .then((responses) => {
                  console.log("Updated Entities:", responses);
                  setEntityData(responses); // Store updated entities
                })
                .catch((error) => console.error("Error updating entity:", error));
            }
            setSeverity("success");
            setSnackOpen(true);
            setTimeout(() => {
              setOpen(false);
              setIsLoading(false);
              fetchInfo();
              setEditingUserID(0);
            }, 1000);
          } else {
            setIsLoading(false);
            navigate("/app/error", {
              state: {
                errorMessage: data.message || "An error occurred.",
                errorCode: data.statusCode,
                errorName: data.errorName || "No additional information available.",
              },
            });
          }
        })
        .catch((error) => {
          setIsLoading(false);
          navigate('/app/error', {
            state: {
              errorMessage: error.message || "An error occurred.",
              errorCode: 500,
              errorName: error.errorName || "No additional information available."
            }
          });
        });
    }
    else {
      // handle validation errors
      setMessage(validationResult.message);
      setSeverity("warning");
      setSnackOpen(true);
      const timer = setTimeout(() => {
        // setOpen(false);
      }, 1000);

    }
  };

  const validateFormData = (formData) => {
    let isValid = true;
    let message = "";
    if (
      !formData.roleName != ""
    ) {
      isValid = false;
      message = "Select the Role";
    } else if (
      !formData.userName ||
      formData.userName.length < 3 ||
      formData.userName.length > 20
    ) {
      isValid = false;
      message = "Enter Username with a length between 3 and 20 characters.";
    } else if (!formData.companyName || formData.companyName.length < 3 || formData.companyName.length > 50
    ) {
      isValid = false;
      message = "Enter Company name with a length between 3 and 50 characters.";
    } else if (!formData.emailID || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailID)) {
      isValid = false;
      message = "Enter a valid email address.";
    } else if (!formData.password || formData.password.length < 4 || formData.password.length > 20) {
      isValid = false;
      message = "Enter Password with a length between 4 and 20 characters.";
    } else if ((settingsName.status.toString() == "Y") && isDepartmentDisabled) {

      if ((!Array.isArray(entityData) || entityData.length === 0)) {
        isValid = false;
        message = "Please select at least one entity.";
      } else if (!entityData.some((e) => e.entityDefWhs)) {
        isValid = false;
        message = "Please select a default entity.";
      }
    }

    return { isValid, message };
  };


  const handleSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackOpen(false);
  };

  const handleSearchInputChange = (value) => {
    setSearchQuery(value);
  };

  const columns = [
    {
      name: "User Name",
      selector: (row) => row.userName,
      sortable: true,
    },
    {
      name: "Company Name",
      selector: (row) => row.companyName,
      sortable: true,
    },
    {
      name: "Email ID",
      selector: (row) => row.emailID,
      sortable: true,
    },
    {
      name: "Active",
      selector: (row) => row.status,
      cell: (row) => (
        <div>
          {row.status === 'Y' ? (
            <Done sx={{ color: 'green' }} />
          ) : (
            <Close sx={{ color: 'red' }} />
          )}
        </div>
      ),
      sortable: true,
    },
    {
      name: "Role",
      selector: (row) => row.roleName,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div>
          <ModeEditOutlineOutlined
            onClick={() => {
              handleClickEdit(row.userID);
            }}
            style={{ cursor: 'pointer', color: '#050e60' }} />
          <DeleteOutlineOutlined
            onClick={() => {
              handleDelete(row.userID);
            }}
            style={{ cursor: 'pointer', color: 'red' }} />
          <Snackbar
            open={snackOpen}
            autoHideDuration={1000}
            onClose={handleSnackClose}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}>
            <Alert
              onClose={handleSnackClose}
              severity={severity}
              variant="filled"
              sx={{ width: "100%" }}>
              {message}
            </Alert>
          </Snackbar>
        </div>
      ),
    },
  ];


  const handleDelete = (id) => {
    let url = "Users/Delete?id=" + id;
    formData.roleID = formData.roleName.toString(); // Set roleID value instead of roleName
    getFetch(url, "POST")
      .then((data) => {
        if (data.statusCode === 203) {
          auditLog(id, "User Admin")
          setMessage(data.message);
          setSeverity("success");
          setSnackOpen(true);
          fetchInfo();
          setTimeout(() => {
            console.log("snackOpen state (after update):", snackOpen);
          }, 0);
        } else {
          setIsLoading(false);
          navigate('/app/error', {
            state: {
              errorMessage: data.message || "An error occurred.",
              errorCode: data.statusCode,
              errorName: data.errorName || "No additional information available."
            }
          });

        }
      })
      .catch((error) => {
        setMessage('Error deleting user');
        setSeverity('error');
        setSnackOpen(true);
      });
  };

  const getRoleName = (roleID) => {
    const role = userRole.find((item) => item.roleName == roleID);
    return role ? role.roleName : '';
  };

  const fetchSupplierInfo = () => {
    getFetch("SupplierList", "GET")
      .then((datas) => {
        setSupplierData(datas), console.log("Load Customer", datas);

      })
      .catch((error) => {
        console.error(error);
        // setIsLoading(false);
      });
  };

  // functionality for PoPover
  const handleCheckboxChange = (entity) => {
    setEntityData((prev) => {
      const exists = prev.some((e) => e.entityName === entity.entityName);

      if (exists) {
        // Remove entity if unchecked
        return prev.filter((e) => e.entityName !== entity.entityName);
      } else {
        // Add entity with duplicated userId
        return [
          ...prev,
          {
            userId: entity.userId, // Duplicated userId per selection
            entityName: entity.entityName,
            entityDefWhs: "", // Will be set by radio button later
          }
        ];
      }
    });
  };

  const handleRadioChange = (entity) => {
    setEntityData((prev) =>
      prev.map((e) =>
        e.entityName === entity.entityName
          ? { ...e, entityDefWhs: entity.entityName } // Save entityName in entityDefWhs
          : { ...e, entityDefWhs: "" } // Clear for others
      )
    );
  };

  const handleConfirm = () => {
    setPopoverOpen(false);
  }

  const handleIconClick = (event) => {
    setAnchorEl(event.currentTarget);
    setPopoverOpen(true); // Open popover

  };

  const handleIconClose = () => {
    setAnchorEl(null);
    setPopoverOpen(false);
    //setEntityData([]);     
  };


  return (
    <Box>
      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            width: "100vw",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 999,
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Card>
            <TableContainer >
              <CustomListTable
                columns={columns}
                data={data}
                pagination
                filterKeys={["userName", "companyName"]}
                searchQuery={searchQuery}
                onSearchChange={(e) => handleSearchInputChange(e.target.value)}
                isItem={true}
              />
            </TableContainer>
          </Card>
        </>
      )}
    </Box>
  );
};

export default Users;
