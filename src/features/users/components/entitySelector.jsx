import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, MenuItem, Paper, Snackbar, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, TextField, CircularProgress, Select, InputLabel, Autocomplete, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, InputAdornment, Checkbox, Popover, Typography, Divider, Paper } from "@mui/material";
import Icons from "../../components/common/iconMap";

const entitySelector = () => {
  const [userRole, setRole] = useState([]);
  const [userDepart, setDepart] = useState([]);
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
    companyName: "",
    emailID: "",
    status: "",
    roleName: "",
    //departmentName:""    
  });
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

  return (
    <>
      <Dialog
        open={open}
        height="100%"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <Grid container>
            <Grid md={10}>
              {btnText === "Submit" ? "Create New User" : "Update User"}
            </Grid>
            <Grid md={2}>
              <CancelOutlinedIcon onClick={handleClose} sx={{ color: "red", float: "right" }} />
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

                {/* {(formData.roleName !== "3" || formData.roleName != "Supplier") && isDepartmentDisabled && settingsName.status != 'N' && ( */}
                {/* //  (settingsName.status.toString() == "Y") && */}
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
                {/* )} */}
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
    </>
  )
}

export default entitySelector;