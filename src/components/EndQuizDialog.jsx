import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import "./EndQuizDialog.css";

const EndQuizDialog = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        paper: { className: "custom-dialog" },
      }}
    >
      <DialogTitle className="custom-dialog-title">End Quiz</DialogTitle>
      <DialogContent className="custom-dialog-content">
        <DialogContentText className="custom-dialog-content-text">
          Are you sure you want to end the quiz?
        </DialogContentText>
      </DialogContent>
      <DialogActions className="custom-dialog-actions">
        <Button
          variant="outlined"
          onClick={onClose}
          className="custom-cancel-button"
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={onConfirm}
          className="custom-yes-button"
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EndQuizDialog;
