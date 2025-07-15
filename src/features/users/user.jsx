import React, { useState, useEffect } from "react";
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, MenuItem, Paper, Snackbar, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, TextField, CircularProgress, Select, InputLabel, Autocomplete, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, InputAdornment, Checkbox, Popover, Typography, Divider, } from "@mui/material";
import { Close, CloseOutlined,  Done, InfoOutlined, ModeEditOutlineOutlined,DeleteOutlineOutlined } from "@mui/icons-material";
import getFetch from "../../services/commonApi";
import { useNavigate } from "react-router-dom";
// import '../style/covalsys.css'
import { useDispatch, useSelector } from "react-redux";
// import { auditLog } from "../utils/auditLogService";
import CustomListTable from "../../utils/customListTable";
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

const Users = () => {
  const navigate = useNavigate();
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

  const [formData, setFormData] = useState({
    userName: "",
    password: "",
    companyName: "",
    emailID: "",
    status: "",
    roleName: "",
    //departmentName:""    
  });

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
  const { settingsName, settingsStatus } = useSelector((state) => state.setting);

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

  useEffect(() => {
    fetchInfo();
    RoleFetch();
    DepartFetch();
  }, []);

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


  const handleClose = () => {
    setOpen(false);
    setSnackOpen(false);
    setFormData({
      userName: "",
      password: "",
      companyName: "",
      emailID: "",
      status: "",
      roleName: "",
      departmentName: ""
    });
    setEditingUserID(0);
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

      if(methodEdit=="PUT"){
        url=`Users/PUT`;
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

  const RoleFetch = () => {
    getFetch("Users/Role", "GET").then((data) => {
      console.log("Roles", data);
      setRole(data);
    });
  };

  const DepartFetch = () => {
    getFetch("Entity/Get", "GET").then((data) => {
      console.log("Department", data);
      setDepart(data);
    });
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

  // const filteredData = data.filter((item) => {
  //   if (selectedType && item.type !== selectedType) return false;
  //   // if (searchQuery) {
  //   //   return Object.values(item).some(
  //   //     (value) =>
  //   //       value !== null &&
  //   //       value !== undefined &&
  //   //       value.toString().toLowerCase().includes(searchQuery.toLowerCase())
  //   //   );
  //   // }
  //   // return true;
  // });

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
          <Dialog
            open={open}
            height="100%"
            //onClose={handleSnackClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            PaperProps={{
              style: {
                maxHeight: 'none', // Disable max-height
              },
            }}>
            <DialogTitle id="alert-dialog-title">
              <Grid container>
                <Grid md={10}>
                  {btnText === "Submit" ? "Create New User" : "Update User"}
                </Grid>
                <Grid md={2}>
                  <CancelOutlinedIcon onClick={handleClose} sx={{color:"red",float:"right"}} />
                </Grid>
              </Grid>
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description"></DialogContentText>
              <form onSubmit={handleSubmit} autoComplete="off">
                <Box
                  display="flex"
                  flexDirection="row"
                  height="100%"
                  width="100%"
                  whiteSpace={100}
                >
                  <Box flex={1}>
                    <Box sx={{ marginTop: "10px" }}>
                      <Autocomplete
                        size="small"
                        options={userRole}
                        getOptionLabel={(option) => option.roleName}
                        key={userRole.roleID}
                        value={
                          formData.roleName
                            ? userRole.find((item) => item.roleName === formData.roleName)
                            : formData.roleName
                        }
                        onChange={(event, value) => {
                          setFormData({ ...formData, roleName: value.roleID.toString() });
                          if (value.roleName === "Supplier") {
                            fetchSupplierInfo(); // Disable department field if role is Supplier

                          }

                          if (value.roleID.toString() == "3") {
                            setIsDepartmentDisabled(false);
                          }
                          else {
                            setIsDepartmentDisabled(true);
                          }
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Role"
                            variant="outlined"
                            fullWidth
                          />
                        )}
                      />
                    </Box>
                    {/* Conditionally render the department field */}
                    {/* ||formData.roleName!=="Supplier" */}
                    <Box sx={{ marginTop: "10px" }}>
                      {formData.roleName === "3" ? (
                        <Autocomplete
                          size="small"
                          options={supplierData}
                          getOptionLabel={(option) => option.supName}
                          value={
                            formData.userName
                              ? supplierData.find((item) => item.supName === formData.userName)
                              : formData.userName
                          }
                          onChange={(event, value) => {
                            setFormData({ ...formData, userName: value.supCode.toString() });
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="User Name"
                              variant="outlined"
                              fullWidth
                            />
                          )}
                        />

                      ) : (
                        <TextField
                          size="small"
                          fullWidth
                          label="User Name"
                          value={formData.userName}
                          onChange={handleChange}
                          name="userName"
                          variant="outlined"
                        />
                      )}
                    </Box>
                    <Box sx={{ marginTop: "10px" }}>
                      <TextField
                        size="small"
                        fullWidth
                        label="Email ID"
                        name="emailID"
                        onChange={handleChange}
                        value={formData.emailID}
                      />
                    </Box>

                    <Box sx={{ marginTop: "10px" }}>
                      <TextField
                        size="small"
                        fullWidth
                        label="Company Name"
                        name="companyName"
                        value={formData.companyName}
                        //defaultValue={editData.length > 0 && editData[0].CompanyName !== "" ? editData[0].CompanyName : ""}
                        onChange={handleChange}
                      />
                    </Box>

                    <Box sx={{ marginTop: "10px" }}>
                      <TextField
                        size="small"
                        type="password"
                        fullWidth
                        label="Password"
                        name="password"
                        onChange={handleChange}
                        value={formData.password}
                      />
                    </Box>
                    {(formData.roleName !== "3" || formData.roleName != "Supplier") && isDepartmentDisabled && settingsName.status != 'N' && (
                      //  (settingsName.status.toString() == "Y") &&
                      <Box sx={{ marginTop: "10px" }}>
                        <TextField
                          size="small"
                          label="Entity"
                          variant="outlined"
                          fullWidth
                          name="entityDefWhs"
                          value={Array.isArray(entityData) && entityData.length > 0
                            ? entityData.find((e) => e.entityDefWhs)?.entityDefWhs || ""
                            : ""}
                          InputProps={{
                            readOnly: true,
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton onClick={handleIconClick}>
                                  <InfoOutlined />
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />


                        {/* Popover (Lightweight Popup) */}
                        <Popover
                          open={popoverOpen}
                          anchorEl={anchorEl}
                          onClose={() => { }}
                          anchorOrigin={{
                            vertical: "center",
                            horizontal: "right",
                          }}
                          transformOrigin={{
                            vertical: "center",
                            horizontal: "left",
                          }}
                          sx={{
                            width: 350,
                            p: 2,
                            ml: 10,
                          }}
                        >
                          <Box p={2} sx={{ position: "relative" }}>
                            {/* Close Button */}
                            <IconButton
                              onClick={handleIconClose}
                              sx={{
                                position: "absolute",
                                top: 8,
                                right: 8,
                                p: 0.5,
                              }}
                            >
                              <CloseOutlined />
                            </IconButton>

                            {/* Title */}
                            <Typography variant="h6" align="center" mb={2}>
                              Select Entities
                            </Typography>

                            {/* Table for structured layout */}
                            <TableContainer component={Paper} elevation={0}>
                              <Table size="small" padding="none">
                                {/* Table Header */}
                                <TableHead>
                                  <TableRow sx={{ height: "28px" }}> {/* Forces small height */}
                                    <TableCell sx={{ fontWeight: "bold", padding: "2px 6px" }}>Entity Name</TableCell>
                                    <TableCell sx={{ fontWeight: "bold", textAlign: "center", padding: "2px 6px" }}>
                                      Select
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: "bold", textAlign: "center", padding: "2px 6px" }}>
                                      Default
                                    </TableCell>
                                  </TableRow>
                                </TableHead>

                                {/* Table Body */}
                                <TableBody sx={{ "& .MuiTableRow-root": { height: "20px" } }}>
                                  {userDepart.map((item) => (
                                    <TableRow key={item.entityId} sx={{ height: "20px" }}> {/* Forces row height */}

                                      {/* Entity Name */}
                                      <TableCell sx={{ padding: "0px 4px", fontSize: "0.85rem" }}>
                                        {item.entityName}
                                      </TableCell>

                                      {/* Checkbox for selection */}
                                      <TableCell align="center" sx={{ padding: "0px 4px" }}>
                                        <Checkbox
                                          size="small"
                                          sx={{ p: 0, m: 0 }} // Remove padding/margin
                                          checked={Array.isArray(entityData) && entityData.some((e) => e.entityName === item.entityName)}
                                          onChange={() => handleCheckboxChange(item)} />
                                      </TableCell>

                                      {/* Radio Button for default selection */}
                                      <TableCell align="center" sx={{ padding: "0px 4px" }}>
                                        <Radio
                                          size="small"
                                          sx={{ p: 0, m: 0 }} // Remove padding/margin
                                          checked={Array.isArray(entityData) && entityData.some((e) => e.entityDefWhs === item.entityName)}
                                          onChange={() => handleRadioChange(item)}
                                        />
                                      </TableCell>

                                    </TableRow>
                                  ))}
                                </TableBody>

                              </Table>
                            </TableContainer>

                            {/* Action Buttons */}
                            <Divider sx={{ mt: 1, mb: 1 }} />
                            <Box display="flex" justifyContent="flex-end">
                              <Button size="small" variant="contained" onClick={handleConfirm}>
                                Confirm
                              </Button>
                            </Box>
                          </Box>
                        </Popover>
                      </Box>
                    )}


                    {isUpdateMode && (
                      <Box sx={{ marginTop: "10px" }}>
                        <FormControl component="fieldset">
                          <FormLabel component="legend">Status</FormLabel>
                          <RadioGroup
                            row
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                          >
                            <FormControlLabel value="Y" control={<Radio />} label="Active" />
                            <FormControlLabel value="N" control={<Radio />} label="Inactive" />
                          </RadioGroup>
                        </FormControl>
                      </Box>
                    )}

                    <Box sx={{ marginTop: "10px" }}>
                      <Button
                        type="Submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2, textTransform: "none" }}
                      >
                        {btnText}
                      </Button>
                    </Box>
                  </Box>
                  <Snackbar
                    open={snackOpen}
                    autoHideDuration={1000}
                    onClose={handleSnackClose}
                    anchorOrigin={{ vertical: "top", horizontal: "right" }}
                  >
                    <Alert
                      onClose={handleSnackClose}
                      severity={severity}
                      variant="filled"
                      sx={{ width: "100%" }}
                    >
                      {message}
                    </Alert>
                  </Snackbar>
                </Box>
              </form>
            </DialogContent>
            <DialogActions></DialogActions>
          </Dialog>
          {/* <CovHeaderCard headerName="User Details" btnEvent={handleClickOpen} btnName="Add User" /> */}
          <TableContainer>
             <CustomListTable 
                columns={columns}
                data={data}
                pagination
                filterKeys={["userName", "companyName"]}
                searchQuery={searchQuery}
                onSearchChange={(e) => handleSearchInputChange(e.target.value)}
                isItem={true}
             />
            {/* <DataTable className="TableContainer"           
              columns={columns}
              data={filteredData}
              pagination
              customStyles={customStyles}
              //paginationComponent={CustomMaterialPagination}
              fixedHeader={true}
              paginationRowsPerPageOptions={[10, 20, 40, 50, 100]}
              fixedHeaderScrollHeight="50vh"
              highlightOnHover
              subHeader
              subHeaderComponent={
                <Grid md={4}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Search"
                    name="Search"
                    autoComplete="off"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                  />
                </Grid>
              }
            /> */}
          </TableContainer>
        </>
      )}
    </Box>
  );
};

export default Users;
