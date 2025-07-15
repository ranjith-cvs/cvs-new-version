// components/common/FileDownload.js
import React from "react";
import { Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

const FileDownload = ({ fileUrl, fileName = "download", label = "Download" }) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName;
    link.click();
  };

  return (
    <Button
      variant="outlined"
      startIcon={<DownloadIcon />}
      onClick={handleDownload}
    >
      {label}
    </Button>
  );
};

export default FileDownload;
