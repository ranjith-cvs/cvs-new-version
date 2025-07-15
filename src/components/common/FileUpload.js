// components/common/FileUpload.js
import React from "react";
import { Button, Box } from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";

const FileUpload = ({ onFileSelect, accept = "*", label = "Upload File" }) => {
  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <Box>
      <input
        accept={accept}
        type="file"
        style={{ display: "none" }}
        id="upload-button-file"
        onChange={handleFileChange}
      />
      <label htmlFor="upload-button-file">
        <Button
          variant="contained"
          component="span"
          startIcon={<UploadIcon />}
        >
          {label}
        </Button>
      </label>
    </Box>
  );
};

export default FileUpload;
