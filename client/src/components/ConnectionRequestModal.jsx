import React from "react";
import { Button, Modal, Typography } from "@mui/material";

function ConnectionRequestModal({ show, onAccept, onClose, secondUser }) {
  return (
    <Modal open={show} onClose={onClose}>
      <div className="connection-request-modal">
        <Typography variant="h6">Connection Request</Typography>
        <Typography>Someone is trying to connect with you:</Typography>
        <Typography>{secondUser.name}</Typography>
        <Button onClick={onAccept} variant="contained" color="primary">
          Accept
        </Button>
      </div>
    </Modal>
  );
}

export default ConnectionRequestModal;
