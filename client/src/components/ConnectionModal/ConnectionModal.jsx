import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";

import "./ConnectionModal.css";

function ConnectionModal({
  open,
  onClose,
  onAccept,
  onReject,
  secondUserData,
}) {
  return (
    <Dialog open={open} onClose={onReject}>
      <DialogTitle style={{ fontSize: "3rem" }}>New Connection Request</DialogTitle>
      <DialogContent>
        <DialogContentText style={{ fontSize: "2rem" }}>
          Do you want to connect with Anonymous User? <br />
          User Details: {secondUserData}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onReject} color="secondary" style={{ fontSize: "2rem" }}>
          Reject
        </Button>
        <Button onClick={onAccept} color="primary" style={{ fontSize: "2rem" }}>
          Accept
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConnectionModal;
