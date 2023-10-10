import { Grid, Typography } from "@mui/material";
import React from "react";

const Description = () => {
  return (
    <>
      {/* <Typography variant="h5" fontSize={20}>
                In this App we are trying to connect with the users who <br/>
                are present in our nearby radius of 15m..
            </Typography> */}
      <p className="text-[2rem] lg:text-[1rem] flex items-center justify-center">
        In this App we are trying to connect with the users who <br />
        are present in our nearby radius of 15m..
      </p>
    </>
  );
};

export default Description;
