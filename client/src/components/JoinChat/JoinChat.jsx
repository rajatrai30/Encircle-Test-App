import React, { useEffect, useState } from "react";
import { useStore } from "../../zustand/store";
import shallow from "zustand/shallow";
import { Button, Grid, TextField } from "@mui/material";
// import Description from "../Description";
import "./JoinChat.css";

import Welcome from "../Welcome";
import User from "../User";
import { auth, getToken, messaging } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import { useParams } from "react-router";

export const JoinChat = () => {
  const [user] = useAuthState(auth);
  const [userCount, setUserCount] = useStore(
    (state) => [state.userCount, state.setUserCount],
    shallow
  );
  const setChat = useStore((state) => state.setChat);
  const socket = useStore((state) => state.socket);

  const { serviceName } = useParams();

  const [subjects, setSubjects] = useState([""]);
  const [time, setTime] = useState("");
  const [degree, setDegree] = useState("");
  const maxSubjects = 5;

  useEffect(() => {
    socket.on("user_count", (data) => {
      console.log("user count run in join chat");
      setUserCount(data);
    });
  }, [socket, setUserCount]);

  useEffect(() => {
    const storeFCMToken = async () => {
      try {
        const currentToken = await getToken(messaging, {
          vapidKey:
            "BG7RsoUEPCVeSSN9h8kTzKhKeGOAu2QnlFFneCaXKAf_iW0j_Vs-gGSw9gSt10TyD19H0GIdE65c81xsy44Bnsw",
        });

        console.log(currentToken);

        await socket.emit("store_fcm_token", { fcmToken: currentToken });
      } catch (error) {
        console.error("Error storing FCM token:", error);
      }
    };

    storeFCMToken();
  }, [socket]);

  const joinChat = async () => {
    if ("geolocation" in navigator) {
      // Validate if all required fields are filled
      if (!validateInputs()) {
        alert("Please fill in all required fields.");
        return;
      }
      if (!user) {
        alert("Please login to continue");
        return;
      }

      // Request notification permission
      try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          // Get FCM token
          const currentToken = await getToken(messaging, {
            vapidKey:
              "BG7RsoUEPCVeSSN9h8kTzKhKeGOAu2QnlFFneCaXKAf_iW0j_Vs-gGSw9gSt10TyD19H0GIdE65c81xsy44Bnsw",
          });

          console.log(currentToken);

          // Send FCM token to the server
          // await socket.emit("store_fcm_token", { fcmToken: currentToken });

          await navigator.geolocation.getCurrentPosition(async (pos) => {
            const location = {
              x: pos.coords.longitude,
              y: pos.coords.latitude,
            };

            // Combine user data with interests
            const userData = {
              x: location.x,
              y: location.y,
              subjects,
              fcmToken: currentToken,
              time,
              degree,
            };

            await socket.emit("create_chat", userData);
            setChat(true);
          });
        } else if (permission === "denied") {
          console.error("Notification permission denied.");
        }
      } catch (error) {
        console.error("Error requesting notification permission:", error);
      }
    } else {
      alert("Your location is not available");
    }
  };

  const updateSubject = (index, value) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[index] = value;
    setSubjects(updatedSubjects);
  };
  const addSubject = () => {
    if (subjects.length < maxSubjects) {
      setSubjects([...subjects, ""]);
    }
  };

  // Function to validate all required fields
  const validateInputs = () => {
    // Check if all subjects are filled
    if (subjects.some((subject) => subject.trim() === "")) {
      return false;
    }

    // Check if time and degree are filled
    if (time.trim() === "" || degree.trim() === "") {
      return false;
    }

    return true;
  };

  return (
    <Grid
      container
      spacing={0}
      className="JoinChat"
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
      <Grid
        item
        xs="auto"
        marginBottom="30px"
        className="text-[3rem] lg:text-[2rem]"
      >
        <>
          {serviceName && (
            <>
              <p className="text-bold text-[3rem] lg:text-[2rem]">
                Selected Service:{" "}
                {serviceName.charAt(0).toUpperCase() + serviceName.slice(1)}
              </p>
              {serviceName === "tutor" && (
                <>
                  <div className="flex justify-start items-start gap-4 my-6">
                    {subjects.map((subject, index) => (
                      <div key={index}>
                        <TextField
                          label={`Subject ${index + 1}`}
                          value={subject}
                          onChange={(e) => updateSubject(index, e.target.value)}
                          required
                          InputProps={{
                            style: { fontSize: "2rem" },
                          }}
                          InputLabelProps={{
                            style: { fontSize: "2rem" },
                          }}
                        />
                      </div>
                    ))}
                    {subjects.length < maxSubjects && (
                      <IconButton onClick={addSubject}>
                        <AddIcon
                          style={{
                            background: "#1976d2",
                            color: "white",
                            borderRadius: "60px",
                            height: "60px",
                            width: "60px",
                          }}
                        />
                      </IconButton>
                    )}
                  </div>
                  <div className="flex justify-start items-start gap-4 my-6">
                    <TextField
                      label="Degree Preferred"
                      value={degree}
                      onChange={(e) => setDegree(e.target.value)}
                      required
                      InputProps={{
                        style: { fontSize: "2rem" },
                      }}
                      InputLabelProps={{
                        style: { fontSize: "2rem" },
                      }}
                    />
                    <TextField
                      label="Time for Lecture"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      required
                      InputProps={{
                        style: { fontSize: "2rem" },
                      }}
                      InputLabelProps={{
                        style: { fontSize: "2rem" },
                      }}
                    />
                  </div>
                </>
              )}
              {serviceName === "plumber" && (
                <>
                  <div className="flex justify-start items-start gap-4 my-6">
                    {subjects.map((subject, index) => (
                      <div key={index}>
                        <TextField
                          label={`Plumbing Service ${index + 1}`}
                          value={subject}
                          onChange={(e) => updateSubject(index, e.target.value)}
                          required
                          className="JoinChatInput"
                          InputProps={{
                            style: { fontSize: "2rem" },
                          }}
                          InputLabelProps={{
                            style: { fontSize: "2rem" },
                          }}
                        />
                      </div>
                    ))}
                    {subjects.length < maxSubjects && (
                      <IconButton onClick={addSubject}>
                        <AddIcon
                          style={{
                            background: "#1976d2",
                            color: "white",
                            borderRadius: "60px",
                            height: "60px",
                            width: "60px",
                          }}
                        />
                      </IconButton>
                    )}
                  </div>
                  <div className="flex justify-start items-start gap-4 my-6">
                    <TextField
                      label="Experience Preferred"
                      value={degree}
                      onChange={(e) => setDegree(e.target.value)}
                      required
                      InputProps={{
                        style: { fontSize: "2rem" },
                      }}
                      InputLabelProps={{
                        style: { fontSize: "2rem" },
                      }}
                    />
                    <TextField
                      label="Time Preferred"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      required
                      InputProps={{
                        style: { fontSize: "2rem" },
                      }}
                      InputLabelProps={{
                        style: { fontSize: "2rem" },
                      }}
                    />
                  </div>
                </>
              )}
              {serviceName === "electrician" && (
                <>
                  <div className="flex justify-start items-start gap-4 my-6">
                    {subjects.map((subject, index) => (
                      <div key={index}>
                        <TextField
                          label={`Electrician Service ${index + 1}`}
                          value={subject}
                          onChange={(e) => updateSubject(index, e.target.value)}
                          required
                          className="JoinChatInput"
                          InputProps={{
                            style: { fontSize: "2rem" },
                          }}
                          InputLabelProps={{
                            style: { fontSize: "2rem" },
                          }}
                        />
                      </div>
                    ))}
                    {subjects.length < maxSubjects && (
                      <IconButton onClick={addSubject}>
                        <AddIcon
                          style={{
                            background: "#1976d2",
                            color: "white",
                            borderRadius: "60px",
                            height: "60px",
                            width: "60px",
                          }}
                        />
                      </IconButton>
                    )}
                  </div>
                  <div className="flex justify-start items-start gap-4 my-6">
                    <TextField
                      label="Experience Preferred"
                      value={degree}
                      onChange={(e) => setDegree(e.target.value)}
                      required
                      InputProps={{
                        style: { fontSize: "2rem" },
                      }}
                      InputLabelProps={{
                        style: { fontSize: "2rem" },
                      }}
                    />
                    <TextField
                      label="Time Preferred"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      required
                      InputProps={{
                        style: { fontSize: "2rem" },
                      }}
                      InputLabelProps={{
                        style: { fontSize: "2rem" },
                      }}
                    />
                  </div>
                </>
              )}
              {serviceName === "carpenter" && (
                <>
                  <div className="flex justify-start items-start gap-4 my-6">
                    {subjects.map((subject, index) => (
                      <div key={index}>
                        <TextField
                          label={`Carpenter Service ${index + 1}`}
                          value={subject}
                          onChange={(e) => updateSubject(index, e.target.value)}
                          required
                          className="JoinChatInput"
                          InputProps={{
                            style: { fontSize: "2rem" },
                          }}
                          InputLabelProps={{
                            style: { fontSize: "2rem" },
                          }}
                        />
                      </div>
                    ))}
                    {subjects.length < maxSubjects && (
                      <IconButton onClick={addSubject}>
                        <AddIcon
                          style={{
                            background: "#1976d2",
                            color: "white",
                            borderRadius: "60px",
                            height: "60px",
                            width: "60px",
                          }}
                        />
                      </IconButton>
                    )}
                  </div>
                  <div className="flex justify-start items-start gap-4 my-6">
                    <TextField
                      label="Experience Preferred"
                      value={degree}
                      onChange={(e) => setDegree(e.target.value)}
                      required
                      InputProps={{
                        style: { fontSize: "2rem" },
                      }}
                      InputLabelProps={{
                        style: { fontSize: "2rem" },
                      }}
                    />
                    <TextField
                      label="Time Preferred"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      required
                      InputProps={{
                        style: { fontSize: "2rem" },
                      }}
                      InputLabelProps={{
                        style: { fontSize: "2rem" },
                      }}
                    />
                  </div>
                </>
              )}
            </>
          )}
          <div className="flex justify-center items-center gap-4 my-4">
            <Button
              variant="contained"
              onClick={joinChat}
              className="w-72"
              style={{ fontSize: "2rem" }}
            >
              Start search
            </Button>
          </div>
        </>
      </Grid>
    </Grid>
  );
};
