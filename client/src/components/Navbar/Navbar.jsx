import { AppBar, Icon, Toolbar, Typography } from "@mui/material";
// import MarkUnreadChatAltIcon from "@mui/icons-material/MarkUnreadChatAlt";
import CircleIcon from "@mui/icons-material/Circle";
import React from "react";
// import { Box } from "@mui/system";
import { useStore } from "../../zustand/store";
import "./Navbar.css";

// GOOGLE SIGN IN SERVICES
import GoogleSignin from "../../img/btn_google_signin_dark_pressed_web.png";
import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export const Navbar = () => {
  const [user] = useAuthState(auth);

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  const signOut = () => {
    auth.signOut();
  };
  const userCount = useStore((state) => state.userCount);

  return (
    // <Box sx={{ flexGrow: 1 }} color="#242443">
    <AppBar position="static" className="NavRoot" style={{position:"fixed", top:"0", left:"auto", right:"0"}}>
      <Toolbar className="NavContainer">
        {/* <Icon
          variant="h2"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MarkUnreadChatAltIcon />
        </Icon> */}
        <Typography
          variant="h2"
          color="inherit"
          component="div"
          sx={{ flexGrow: 1 }}
        >
          Encircle
        </Typography>
        <div className="flex justify-start items-center gap-4">
          <Icon edge="end" aria-label="online">
            <CircleIcon sx={{ color: "green" }} />
          </Icon>
          <Typography variant="h3" component="div">
            Online: {userCount}
          </Typography>
          <Typography>
            {user ? (
              <button onClick={signOut} className="sign-out" type="button">
                Sign Out
              </button>
            ) : (
              <button className="sign-in">
                <img
                  onClick={googleSignIn}
                  src={GoogleSignin}
                  alt="sign in with google"
                  type="button"
                />
              </button>
            )}
          </Typography>
        </div>
      </Toolbar>
    </AppBar>
    // </Box>
  );
};
