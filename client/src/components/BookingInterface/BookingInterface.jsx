import React from "react";
import { Button, Grid } from "@mui/material";
import "./BookingInterface.css";

function BookingInterface() {
  return (
    <>
      <Grid
        container
        spacing={4}
        alignItems="center"
        display="flex"
        justifyContent="center"
        // style={{
        //   marginTop: "2rem",
        // }}
      >
        <Grid
          id="chat-window"
          xs={12}
          container
          spacing={4}
          alignItems="center"
          display="flex"
          justifyContent="center"
          item
        >
          <Button
            style={{
              fontSize: "3rem",
              width: "35rem",
              height: "8rem",
              borderRadius: "25px",
              marginTop: "10px",
              background:"#fff"
            }}
            variant="outlined"
            color="primary"
            size="small"
          >
            ComingSoon
          </Button>{" "}
        </Grid>
      </Grid>
    </>
  );
}
export default BookingInterface;

// import React from "react";
// import { Typography, Grid, List } from "@mui/material";
// import { FormControl, IconButton, ListItem, TextField } from "@mui/material";
// import "./BookingInterface.css"; // Import the CSS file
// import SendIcon from "@mui/icons-material/Send";

// function BookingInterface({
//   scrollRef,
//   listAllMessage,
//   sendMessage,
//   handleTyping,
//   handleKeyPress,
//   msg,
//   chatAlive,
//   isTyping,
// }) {
//   return (
//     <>
//       <Grid
//         container
//         spacing={4}
//         alignItems="center"
//         // style={{
//         //   marginTop: "2rem",
//         // }}
//       >
//         <Grid id="chat-window" xs={12} item>
//           <List id="chat-window-messages">
//             {listAllMessage}
//             <ListItem ref={scrollRef}></ListItem>
//           </List>
//         </Grid>
//         <Grid xs={10} item>
//           <FormControl fullWidth>
//             <TextField
//               onChange={(e) => handleTyping(e)}
//               onKeyPress={(e) => handleKeyPress(e)}
//               value={msg}
//               label="Start Chat"
//               variant="outlined"
//               disabled={!chatAlive}
//               InputProps={{
//                 style: { fontSize: "2.4rem" },
//               }}
//               InputLabelProps={{
//                 style: { fontSize: "2.4rem" },
//               }}
//             />
//           </FormControl>
//         </Grid>
//         <Grid xs={2} item>
//           <IconButton
//             onClick={sendMessage}
//             aria-label="send"
//             color="primary"
//             disabled={!chatAlive}
//           >
//             <SendIcon
//               style={{
//                 height: "60px",
//                 width: "60px",
//               }}
//             />
//           </IconButton>
//         </Grid>
//         {isTyping ? (
//           <Typography
//             marginLeft={4}
//             style={{
//               fontSize: "2rem",
//             }}
//           >
//             Other user is typing ...{" "}
//           </Typography>
//         ) : null}
//       </Grid>
//     </>
//   );
// }

// export default BookingInterface;
