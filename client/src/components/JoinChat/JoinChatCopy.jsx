import { Grid } from "@mui/material";
import Welcome from "../Welcome";
import User from "../User";
import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Logo from "../Logo/Logo";
import { Link } from "react-router-dom";
import Tutor from "../../assets/ServiceIcons/Tutor.png";
import Plumber from "../../assets/ServiceIcons/Plumber.png";
import Electrician from "../../assets/ServiceIcons/Electrician.png";
import Carpenter from "../../assets/ServiceIcons/Carpenter.png";
import "./JoinChatCopy.css";

export const JoinChatCopy = () => {
  const [user] = useAuthState(auth);

  const services = [
    { name: "Tutor", icon: Tutor, link: "/start/tutor" },
    { name: "Plumber", icon: Plumber, link: "/start/plumber" },
    { name: "Electrician", icon: Electrician, link: "/start/electrician" },
    { name: "Carpenter", icon: Carpenter, link: "/start/carpenter" },
  ];

  return (
    <Grid
      container
      className="StartIcon"
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "100vh" }}
    >
      <Grid item xs="auto" marginBottom="30px">
        <h1 className="text-bold text-[4rem] lg:text-[3rem]">
          Welcome to Encircle Test App
        </h1>
        {!user ? (
          <Welcome />
        ) : (
          <User
            avatar={user.photoURL}
            name={user.displayName}
            email={user.email}
          />
        )}
      </Grid>
      {/* <Grid item xs="auto" marginBottom="30px">
        <Description />
      </Grid> */}
      <Grid>
        {!user ? (
          <p className="text-bold text-[3rem] lg:text-[2rem]">
            Please sign in.
          </p>
        ) : (
          <>
            <div>
              <p className="text-bold text-[3rem] lg:text-[2rem]">
                Please Select the Service of Your Choice
              </p>
              <div className="flex justify-center items-center gap-10">
                {services.map((service, index) => (
                  <Link to={service.link} key={index}>
                    <Logo
                      IconImage={service.icon}
                      logoName={service.name}
                      IconLink={service.link}  // Ensure IconLink is set to the correct route
                      service={service.name.toLowerCase()}
                    />
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </Grid>
    </Grid>
  );
};
