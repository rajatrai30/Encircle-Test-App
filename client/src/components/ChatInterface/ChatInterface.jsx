import React from "react";
import { Typography, Grid, List } from "@mui/material";
import { FormControl, IconButton, ListItem, TextField } from "@mui/material";
import "./ChatInterface.css"; // Import the CSS file
import SendIcon from "@mui/icons-material/Send";
import Anon from "../../assets/ChatIcon/AnonUser.png";

function ChatInterface({
  scrollRef,
  listAllMessage,
  sendMessage,
  handleTyping,
  handleKeyPress,
  msg,
  chatAlive,
  isTyping,
  secondUser,
}) {
  return (
    <>
      <Grid
        container
        spacing={4}
        alignItems="center"
        // style={{
        //   marginTop: "2rem",
        // }}
      >
        <Grid id="chat-window" xs={12} item>
          <div className="ChatAnonymousUserUserComponent mb-4 p-4">
            <div className="ChatAnonymousUserAvatarColumn">
              <img src={Anon} alt="User Avatar" />
            </div>
            <div className="ChatAnonymousUserInfoColumn">
              <h2>{secondUser}</h2>
              {isTyping ? (
                <Typography
                  style={{
                    fontSize: "2rem",
                    fontWeight: "bold",
                    color: "rgb(42 85 101)",
                  }}
                >
                  Other user is typing...
                </Typography>
              ) : null}
              {/* <p>{email}</p> */}
            </div>
            {/* <div>
    <img src={ServiceIcon} alt="EnCircle" className="HomeIcon" />
    </div> */}
          </div>
          <List id="chat-window-messages">
            {listAllMessage}
            <ListItem ref={scrollRef}></ListItem>
          </List>
        </Grid>
        <Grid xs={10} item>
          <FormControl fullWidth>
            <TextField
              onChange={(e) => handleTyping(e)}
              onKeyPress={(e) => handleKeyPress(e)}
              value={msg}
              label="Start Chat"
              variant="outlined"
              disabled={!chatAlive}
              InputProps={{
                style: { fontSize: "2.4rem" },
              }}
              InputLabelProps={{
                style: { fontSize: "2.4rem", color: "rgb(42 85 101)" },
              }}
              style={{
                color: "rgb(42 85 101)",
              }}
            />
          </FormControl>
        </Grid>
        <Grid xs={2} item>
          <IconButton
            onClick={sendMessage}
            aria-label="send"
            color="primary"
            disabled={!chatAlive}
            style={{
              color: "rgb(42 85 101)",
            }}
          >
            <SendIcon
              style={{
                height: "60px",
                width: "60px",
              }}
            />
          </IconButton>
        </Grid>
      </Grid>
    </>
  );
}

export default ChatInterface;
