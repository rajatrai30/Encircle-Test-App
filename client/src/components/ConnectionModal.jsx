import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";

function ConnectionModal({
  open,
  onClose,
  onAccept,
  onReject,
  secondUserData,
}) {
  return (
    <Dialog open={open} onClose={onReject}>
      <DialogTitle>Connection Request</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Do you want to connect with Anonymous User? <br />
          User Details: {secondUserData}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onReject} color="secondary">
          Reject
        </Button>
        <Button onClick={onAccept} color="primary">
          Accept
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConnectionModal;
