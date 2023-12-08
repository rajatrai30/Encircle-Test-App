import React from "react";
import { Grid, Typography, Button } from "@mui/material";

function ConnectionInfo({ secondUser, onClickChat }) {
  return (
    <Grid
      container
    //   className="StartIcon"
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
    >
      {/* <Typography
        style={{
          fontSize: "2.4rem",
          fontWeight: "bold",
        }}
      >
        Your Connection established with {secondUser}
      </Typography> */}
      <Grid xs={2} item>
        <Button
          style={{
            fontSize: "2.5rem",
            width: "19rem",
            height: "8rem",
            borderRadius: "25px",
          }}
          variant="contained"
          color="primary"
          size="small"
          onClick={onClickChat}
        >
          Chat
        </Button>
      </Grid>
    </Grid>
  );
}

export default ConnectionInfo;
