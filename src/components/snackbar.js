import React from "react";
import { Snackbar } from "@mui/material";
const Toaster = ({ open, handleClose, message }) => {
  return (
    <div>
      <Snackbar
        open={open}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        autoHideDuration={2000}
        onClose={handleClose}
        message={message}
        sx={{ backgroundColor: "#000000" }}
      />
    </div>
  );
};

export default Toaster;
