import React, { useEffect, useState, useContext } from "react";
import { Button, FormControl, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput, Paper, TextField } from "@mui/material";
import { FormControlLabel, Checkbox, Typography } from '@mui/material';
import { Box } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { AccountCircle, VisibilityOff, Visibility } from '@mui/icons-material';
// import getFetch from "../utils/api";
import { UserContext } from "../context/UserContext";
// import MessageDialog from "../components/messageDialog";
// import { useDispatch, useSelector } from "react-redux";
// import { getSettingsDetails } from "../action/settingsAction";

const KanbanLogin = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    userID: 0,
    userName: '',
    password: '',
    companyName: '',
    emailID: '',
    status: '',
    roleName: '',
    model: [],
  });
  const [rememberMe, setRememberMe] = useState(false);
  const { setUser } = useContext(UserContext);
  const [alert, setAlert] = useState({ open: false, message: "", severity: "success" });
  const dispatch = useDispatch();
  const { settingsName } = useSelector((state) => state.settings);

  useEffect(() => {
    dispatch(getSettingsDetails()); // Fetch settings on page load
  }, [dispatch]);


  // Textfields change events
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRemember = (event) => {
    const isChecked = event.target.checked; // Get the checked state
    setRememberMe(isChecked); // Update rememberMe state
    if (isChecked) {
      localStorage.setItem('emailID', formData.emailID);
      localStorage.setItem('password', formData.password);
    } else {
      localStorage.removeItem('emailID');
      localStorage.removeItem('password');
    }
  };

  // Login page background UI styles
  const boxStyle = {
    backgroundImage: `url(../images/Login.jpg)`,
    height: '100vh',
    justifyContent: "center",
    alignItems: "center",
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  useEffect(() => {
    const storedEmail = localStorage.getItem("emailID") || "";
    const storedPassword = localStorage.getItem("password") || "";
    const DocEntry = localStorage.getItem("docEntry") || "";
    const EntityId = localStorage.getItem("entityId") || "";
    const storedEntityName = localStorage.getItem("entityName") || "";
    const storedEntityDefWhs = localStorage.getItem("entityDefWhs") || "";


    const entityNamesList = storedEntityName
      ? storedEntityName.split(",").map(name => name.trim()).filter(name => name && name !== "null")
      : [];

    const entityDefWhsList = storedEntityDefWhs
      ? storedEntityDefWhs.split(",").map(whs => whs.trim()).filter(whs => whs && whs !== "null")
      : [];

    const docList = DocEntry
      ? DocEntry.split(",").map(doc => doc.trim()).filter(doc => doc && doc !== "null")
      : [];

    //  Ensure `entityDefWhsList` has the same length as `entityNamesList`
    while (entityDefWhsList.length < entityNamesList.length) {
      entityDefWhsList.push(null); // Use `null` for consistency
    }

    // Construct `model` array dynamically, ensuring `null` is correctly handled
    const initialModel = entityNamesList.length > 0
      ? entityNamesList.map((name, index) => ({
        entityName: name || null,  // Ensure valid values or `null`
        entityDefWhs: entityDefWhsList[index] || null,
      }))
      : null; // If empty, set `model` to `null`

    if (storedEmail && storedPassword) {
      setFormData({
        userID: 0,
        userName: "",
        password: storedPassword,
        companyName: "",
        emailID: storedEmail,
        status: "",
        roleName: "",
        //model: initialModel, // Correct format
      });
      setRememberMe(true);
    }
  }, []);

  // Show password events
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const forgotPass = (e) => {
    e.preventDefault();
    if (!formData.emailID) {
      setAlert({ open: true, message: "Please enter the EmailID.", severity: "error" });
      return;
    }
    const url = `EmailSending?email=` + formData.emailID;
    getFetch(url, "POST")
      .then((data) => {
        setAlert({ open: true, message: "Password reset link has been sent to your email address.", severity: "success" });
      })
      .catch((error) => {
        console.error("Error sending email:", error);
        setAlert({ open: true, message: "Failed to send password reset email.", severity: "error" });
      });
  };

  // Submit button event
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.emailID || !formData.password) {
      setAlert({ open: true, message: "Please enter both EmailID and Password.", severity: "error" });
      return;
    }
    console.log("Log in data", formData);

    getFetch("loginPage", "POST", formData)
      .then((data) => {

        if (data.statusCode === 200) {
          console.log("login response", data);

          setAlert({ open: true, message: "Login Successful", severity: "success" });
          if (data._userlog.length > 0) {
            const roleID = data._userlog[0].roleName; // Fetch roleID
            const userName = data._userlog[0].userName;
            const userID = data._userlog[0].userID;
            const doc = data._userlog[0].model.map(item => item.docEntry);
            const entityNames = data._userlog[0].model.map(item => item.entityName);

            let entityId = null;
            let entityDefWhs = null;

            // session storage function
            sessionStorage.setItem('auth', 'true');
            const expiry = new Date().getTime() + 3 * 60 * 1000;
            sessionStorage.setItem('expiry', expiry.toString());
            //  session storage end 

            //  If roleID is not "3", fetch entity-related values
            if (roleID !== 3 || settingsName.status !== 'Y') {
              const validEntity = data._userlog[0].model.find(item => item.entityDefWhs && item.entityDefWhs.trim() !== "");
              if (validEntity) {
                entityId = validEntity.entityId;
                entityDefWhs = validEntity.entityDefWhs;
                console.log("Branch type", validEntity.branchType);
                localStorage.setItem("branchType", validEntity.branchType);
                localStorage.setItem("entityId", entityId);
                localStorage.setItem("entityDefWhs", entityDefWhs);
              }
            }
            setUser({
              userName,
              userID,
              roleID,
              docEntry: doc,
              ...(roleID !== 3 && {
                entityId,
                entityName: entityNames,
                entityDefWhs,
              }),
            });

            // Store user details in localStorage
            localStorage.setItem("name", userName);
            localStorage.setItem("id", userID);
            localStorage.setItem("roleID", roleID);
            localStorage.setItem("docEntry", JSON.stringify(doc));

            if (roleID !== "3" || settingsName.status !== 'Y') {
              localStorage.setItem("entityName", JSON.stringify(entityNames));
            }
          }

          const redirectBasedOnRole = () => {
            const target = data._userlog[0].roleName !== "3" ? "/app/Dashboard" : "/app/SupplierDemandPlan";
            navigate(target);
          };
          setTimeout(redirectBasedOnRole, 1000);

          // setTimeout(() => {
          //   const path = "/app/Dashboard"; //= roleID === "3" ? "/app/SupplierDemandPlan" :
          //   navigate(path);
          // }, 1000);

        } else {
          setAlert({ open: true, message: "Invalid EmailID or Password", severity: "error" });
        }

      })
      .catch((error) => {
        console.error('Login page error:', error.message);
        navigate('/ErrorPage');
      });
  };

  //Alert message pop close event
  const handleClose = () => setAlert({ open: false, message: "", severity: "" });

  return (
    <>
      <Box style={boxStyle}>
        <form>
          <Grid container spacing={1} height="100vh">
            <Grid xs={0} md={4}></Grid>
            <Grid xs={12} md={4} marginTop={10}>
              <Box component={Paper} sx={{ border: '2px solid white', borderRadius: '5px' }}>
                <AccountCircle sx={{ width: '100px', height: '100px', position: 'absolute', color: 'gray', marginLeft: '13%', marginTop: '-57px' }} />
                <Box sx={{ margin: '50px 10px 0px 10px' }}>
                  <TextField size='small' autoComplete="off" fullWidth label='Email ID' name='emailID' variant="outlined" value={formData.emailID} onChange={handleChange} />
                </Box>
                <Box sx={{ margin: '30px 10px 0px 10px' }}>
                  <FormControl size='small' variant="outlined" fullWidth>
                    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-password"
                      type={showPassword ? 'text' : 'password'}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Password"
                      name='password'
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </FormControl>
                  <Box sx={{ margin: '20px 10px 0px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={rememberMe}
                          onChange={handleRemember}
                          name="rememberMe"
                          color="primary"
                        />
                      }
                      label="Remember Me"
                    />
                    <Typography variant="body2" color="primary" style={{ cursor: 'pointer' }} onClick={forgotPass}>
                      Forgot Password?
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ margin: '0px 10px 0px 10px' }}>
                  <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} onClick={handleSubmit}>Submit</Button>
                </Box>
              </Box>
              <MessageDialog
                snackOpen={alert.open}
                message={alert.message}
                severity={alert.severity}
                onClose={handleClose}
              />
            </Grid>
            <Grid xs={0} md={4}></Grid>
          </Grid>
        </form>
      </Box>
    </>
  );
};

export default KanbanLogin;