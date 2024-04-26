import React, { useEffect, useState } from "react";
import { useStore } from "../../zustand/store";
import shallow from "zustand/shallow";
import {
  Button,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import "./JoinChat.css";

import Welcome from "../Welcome/Welcome";
import User from "../User/User";
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
  const maxSubjects = 3;

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
        // alert("Please fill in all required fields.");
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
    // if (subjects.some((subject) => subject.trim() === "")) {
    //   alert("Please select all subjects.");
    //   return false;
    // }
    const uniqueSubjects = [...new Set(subjects)]; // Get unique subjects
    // proivde code to detect identical subjects
    // console.log(uniqueSubjects);
    if (uniqueSubjects.length !== subjects.length) {
      alert("Duplicate sub-servcies are not allowed.");
      return false;
    }

    // if (uniqueSubjects.length !== maxSubjects) {
    //   alert("Please select three different sub-services.");
    //   return false;
    // }

    // Check if subject, time and degree are filled
    if (
      subjects.some((subject) => subject.trim() === "") ||
      time.trim() === "" ||
      degree.trim() === ""
    ) {
      alert("Please fill in all required fields.");
      return false;
    }
    // if (time.trim() === "" || degree.trim() === "") {
    //   alert("Please fill in all required fields.");
    //   return false;
    // }
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
      style={{ minHeight: "106vh" }}
    >
      <Grid item xs="auto" marginBottom="30px">
        {/* <h1 className="font-bold text-[4rem]">
          Welcome to Encircle App
        </h1> */}
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
        marginTop="30px"
        style={{ margin: "21px" }}
        className="JoinChatServiceIcon"
      >
        <>
          {serviceName && (
            <>
              <p className="font-bold text-[4rem] mb-10">
                Selected Service:{" "}
                {serviceName.charAt(0).toUpperCase() + serviceName.slice(1)}
              </p>
              {serviceName === "tutor" && (
                <>
                  <div className="flex flex-col justify-start items-start gap-2 my-2">
                    {subjects.map((_, index) => (
                      <div
                        key={index}
                        className="flex flex-col justify-start items-start gap-2 my-2"
                      >
                        <FormControl fullWidth>
                          <InputLabel
                            id={`subject-label-${index}`}
                            style={{ fontSize: "2.5rem" }}
                          >
                            Subject {index + 1}
                          </InputLabel>
                          <Select
                            labelId={`subject-label-${index}`}
                            id={`subject-select-${index}`}
                            label={`Subject ${index + 1}`}
                            value={subjects[index]}
                            onChange={(e) =>
                              updateSubject(index, e.target.value)
                            }
                            required
                            style={{ fontSize: "2.5rem", minWidth: "200px" }}
                            inputProps={{ style: { fontSize: "2.5rem" } }}
                          >
                            <MenuItem
                              value="Java"
                              style={{ fontSize: "2.5rem" }}
                            >
                              Java
                            </MenuItem>
                            <MenuItem
                              value="Python"
                              style={{ fontSize: "2.5rem" }}
                            >
                              Python
                            </MenuItem>
                            <MenuItem
                              value="Kotlin"
                              style={{ fontSize: "2.5rem" }}
                            >
                              Kotlin
                            </MenuItem>
                            <MenuItem
                              value="DSA"
                              style={{ fontSize: "2.5rem" }}
                            >
                              DSA
                            </MenuItem>
                            <MenuItem value="ML" style={{ fontSize: "2.5rem" }}>
                              ML
                            </MenuItem>
                            <MenuItem
                              value="Maths"
                              style={{ fontSize: "2.5rem" }}
                            >
                              Maths
                            </MenuItem>
                            <MenuItem
                              value="English"
                              style={{ fontSize: "2.5rem" }}
                            >
                              English
                            </MenuItem>
                            <MenuItem
                              value="Science"
                              style={{ fontSize: "2.5rem" }}
                            >
                              Science
                            </MenuItem>
                            <MenuItem
                              value="Biology"
                              style={{ fontSize: "2.5rem" }}
                            >
                              Biology
                            </MenuItem>
                          </Select>
                        </FormControl>
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
                  <div className="flex flex-col justify-start items-start gap-8 my-6">
                    <FormControl fullWidth>
                      <InputLabel
                        id="Degree-label"
                        style={{ fontSize: "2.5rem" }}
                      >
                        Degree Preferred
                      </InputLabel>
                      <Select
                        label="Degree Preferred"
                        labelId="Degree-label"
                        id="Degree-label"
                        value={degree}
                        onChange={(e) => setDegree(e.target.value)}
                        required
                        style={{ fontSize: "2.5rem", minWidth: "200px" }}
                        inputProps={{ style: { fontSize: "2.5rem" } }}
                      >
                        <MenuItem value="BE" style={{ fontSize: "2.5rem" }}>
                          BE
                        </MenuItem>
                        <MenuItem value="ME" style={{ fontSize: "2.5rem" }}>
                          ME
                        </MenuItem>
                        <MenuItem value="MTech" style={{ fontSize: "2.5rem" }}>
                          MTech
                        </MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl fullWidth>
                      <InputLabel
                        id="Time-label"
                        style={{ fontSize: "2.5rem" }}
                      >
                        Time for Lecture
                      </InputLabel>
                      <Select
                        label="Time for Lecture"
                        labelId="Time-label"
                        id="Time-label"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        required
                        style={{ fontSize: "2.5rem", minWidth: "200px" }}
                        inputProps={{ style: { fontSize: "2.5rem" } }}
                      >
                        <MenuItem value="7" style={{ fontSize: "2.5rem" }}>
                          7
                        </MenuItem>
                        <MenuItem value="8" style={{ fontSize: "2.5rem" }}>
                          8
                        </MenuItem>
                        <MenuItem value="9" style={{ fontSize: "2.5rem" }}>
                          9
                        </MenuItem>
                        <MenuItem value="10" style={{ fontSize: "2.5rem" }}>
                          10
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </>
              )}
              {serviceName === "plumber" && (
                <>
                  <div className="flex flex-col justify-start items-start gap-2 my-2">
                    {subjects.map((_, index) => (
                      <div
                        key={index}
                        className="flex flex-col justify-start items-start gap-2 my-2"
                      >
                        <FormControl fullWidth>
                          <InputLabel
                            id={`plumbing-label-${index}`}
                            style={{ fontSize: "2.5rem" }}
                          >
                            Plumbing {index + 1}
                          </InputLabel>
                          <Select
                            labelId={`plumbing-label-${index}`}
                            id={`plumbing-select-${index}`}
                            label={`Plumbing ${index + 1}`}
                            value={subjects[index]}
                            onChange={(e) =>
                              updateSubject(index, e.target.value)
                            }
                            required
                            style={{ fontSize: "2.5rem", minWidth: "200px" }}
                            inputProps={{ style: { fontSize: "2.5rem" } }}
                          >
                            <MenuItem
                              value="Leak Repair"
                              style={{ fontSize: "2.5rem" }}
                            >
                              Leak Repair
                            </MenuItem>
                            <MenuItem
                              value="Pipe Installation"
                              style={{ fontSize: "2.5rem" }}
                            >
                              Pipe Installation
                            </MenuItem>
                            <MenuItem
                              value="Drain Cleaning"
                              style={{ fontSize: "2.5rem" }}
                            >
                              Drain Cleaning
                            </MenuItem>
                            <MenuItem
                              value="Water Heater Installation"
                              style={{ fontSize: "2.5rem" }}
                            >
                              Water Heater Installation
                            </MenuItem>
                            <MenuItem
                              value="Fixture Installation"
                              style={{ fontSize: "2.5rem" }}
                            >
                              Fixture Installation
                            </MenuItem>
                            <MenuItem
                              value="Gas Line Installation"
                              style={{ fontSize: "2.5rem" }}
                            >
                              Gas Line Installation
                            </MenuItem>
                          </Select>
                        </FormControl>
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
                  <div className="flex flex-col justify-start items-start gap-8 my-6">
                    <FormControl fullWidth>
                      <InputLabel
                        id="PlumbingExperience-label"
                        style={{ fontSize: "2.5rem" }}
                      >
                        Experience Preferred
                      </InputLabel>
                      <Select
                        label="Experience Preferred"
                        labelId="PlumbingExperience-label"
                        id="PlumbingExperience-label"
                        value={degree}
                        onChange={(e) => setDegree(e.target.value)}
                        required
                        style={{ fontSize: "2.5rem", minWidth: "200px" }}
                        inputProps={{ style: { fontSize: "2.5rem" } }}
                      >
                        <MenuItem
                          value="Beginner"
                          style={{ fontSize: "2.5rem" }}
                        >
                          Beginner
                        </MenuItem>
                        <MenuItem
                          value="Intermediate"
                          style={{ fontSize: "2.5rem" }}
                        >
                          Intermediate
                        </MenuItem>
                        <MenuItem
                          value="Advanced"
                          style={{ fontSize: "2.5rem" }}
                        >
                          Advanced
                        </MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl fullWidth>
                      <InputLabel
                        id="PlumbingTime-label"
                        style={{ fontSize: "2.5rem" }}
                      >
                        Time Preferred
                      </InputLabel>
                      <Select
                        label="Time Preferred"
                        labelId="PlumbingTime-label"
                        id="PlumbingTime-label"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        required
                        style={{ fontSize: "2.5rem", minWidth: "200px" }}
                        inputProps={{ style: { fontSize: "2.5rem" } }}
                      >
                        <MenuItem value="7" style={{ fontSize: "2.5rem" }}>
                          7
                        </MenuItem>
                        <MenuItem value="8" style={{ fontSize: "2.5rem" }}>
                          8
                        </MenuItem>
                        <MenuItem value="9" style={{ fontSize: "2.5rem" }}>
                          9
                        </MenuItem>
                        <MenuItem value="10" style={{ fontSize: "2.5rem" }}>
                          10
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </>
              )}
              {serviceName === "electrician" && (
                <>
                  <div className="flex flex-col justify-start items-start gap-2 my-2">
                    {subjects.map((_, index) => (
                      <div
                        key={index}
                        className="flex flex-col justify-start items-start gap-2 my-2"
                      >
                        <FormControl>
                          <InputLabel
                            id={`electrician-label-${index}`}
                            style={{ fontSize: "2.5rem" }}
                          >
                            Electrician {index + 1}
                          </InputLabel>
                          <Select
                            labelId={`electrician-label-${index}`}
                            id={`electrician-select-${index}`}
                            label={`Electrician ${index + 1}`}
                            value={subjects[index]}
                            onChange={(e) =>
                              updateSubject(index, e.target.value)
                            }
                            required
                            style={{ fontSize: "2.5rem", minWidth: "200px" }}
                            inputProps={{ style: { fontSize: "2.5rem" } }}
                          >
                            <MenuItem
                              value="Lighting Installation"
                              style={{ fontSize: "2.5rem" }}
                            >
                              Lighting Installation
                            </MenuItem>
                            <MenuItem
                              value="Electrical Panel Upgrades"
                              style={{ fontSize: "2.5rem" }}
                            >
                              Electrical Panel Upgrades
                            </MenuItem>
                            <MenuItem
                              value="Appliance Installation"
                              style={{ fontSize: "2.5rem" }}
                            >
                              Appliance Installation
                            </MenuItem>
                            <MenuItem
                              value="Data and Communication Wiring"
                              style={{ fontSize: "2.5rem" }}
                            >
                              Data and Communication Wiring
                            </MenuItem>
                            <MenuItem
                              value="Emergency Electrical Services"
                              style={{ fontSize: "2.5rem" }}
                            >
                              Emergency Electrical Services
                            </MenuItem>
                            <MenuItem
                              value="Electrical Wiring Installation"
                              style={{ fontSize: "2.5rem" }}
                            >
                              Electrical Wiring Installation
                            </MenuItem>
                          </Select>
                        </FormControl>
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
                  <div className="flex flex-col justify-start items-start gap-8 my-6">
                    <FormControl fullWidth>
                      <InputLabel
                        id="ElectricianExperience-label"
                        style={{ fontSize: "2.5rem" }}
                      >
                        Experience Preferred
                      </InputLabel>
                      <Select
                        label="Experience Preferred"
                        labelId="ElectricianExperience-label"
                        id="ElectricianExperience-label"
                        value={degree}
                        onChange={(e) => setDegree(e.target.value)}
                        required
                        style={{ fontSize: "2.5rem", minWidth: "200px" }}
                        inputProps={{ style: { fontSize: "2.5rem" } }}
                      >
                        <MenuItem
                          value="Beginner"
                          style={{ fontSize: "2.5rem" }}
                        >
                          Beginner
                        </MenuItem>
                        <MenuItem
                          value="Intermediate"
                          style={{ fontSize: "2.5rem" }}
                        >
                          Intermediate
                        </MenuItem>
                        <MenuItem
                          value="Advanced"
                          style={{ fontSize: "2.5rem" }}
                        >
                          Advanced
                        </MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl fullWidth>
                      <InputLabel
                        id="ElectricianTime-label"
                        style={{ fontSize: "2.5rem" }}
                      >
                        Time Preferred
                      </InputLabel>
                      <Select
                        label="Time Preferred"
                        labelId="ElectricianTime-label"
                        id="ElectricianTime-label"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        required
                        style={{ fontSize: "2.5rem", minWidth: "200px" }}
                        inputProps={{ style: { fontSize: "2.5rem" } }}
                      >
                        <MenuItem value="7" style={{ fontSize: "2.5rem" }}>
                          7
                        </MenuItem>
                        <MenuItem value="8" style={{ fontSize: "2.5rem" }}>
                          8
                        </MenuItem>
                        <MenuItem value="9" style={{ fontSize: "2.5rem" }}>
                          9
                        </MenuItem>
                        <MenuItem value="10" style={{ fontSize: "2.5rem" }}>
                          10
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </>
              )}
              {serviceName === "carpenter" && (
                <>
                  <div className="flex flex-col justify-start items-start gap-2 my-2">
                    {subjects.map((_, index) => (
                      <div
                        key={index}
                        className="flex flex-col justify-start items-start gap-2 my-2"
                      >
                        <FormControl>
                          <InputLabel
                            id={`carpenter-label-${index}`}
                            style={{ fontSize: "2.5rem" }}
                          >
                            Carpenter {index + 1}
                          </InputLabel>
                          <Select
                            labelId={`carpenter-label-${index}`}
                            id={`carpenter-select-${index}`}
                            label={`Carpenter ${index + 1}`}
                            value={subjects[index]}
                            onChange={(e) =>
                              updateSubject(index, e.target.value)
                            }
                            required
                            style={{ fontSize: "2.5rem", minWidth: "200px" }}
                            inputProps={{ style: { fontSize: "2.5rem" } }}
                          >
                            <MenuItem
                              value="Custom Furniture"
                              style={{ fontSize: "2.5rem" }}
                            >
                              Custom Furniture
                            </MenuItem>
                            <MenuItem
                              value="Cabinet Installation"
                              style={{ fontSize: "2.5rem" }}
                            >
                              Cabinet Installation
                            </MenuItem>
                            <MenuItem
                              value="Door and Window Installation"
                              style={{ fontSize: "2.5rem" }}
                            >
                              Door and Window Installation
                            </MenuItem>
                            <MenuItem
                              value="Flooring Installation"
                              style={{ fontSize: "2.5rem" }}
                            >
                              Flooring Installation
                            </MenuItem>
                            <MenuItem
                              value="Staircase Construction"
                              style={{ fontSize: "2.5rem" }}
                            >
                              Staircase Construction
                            </MenuItem>
                          </Select>
                        </FormControl>
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
                  <div className="flex flex-col justify-start items-start gap-8 my-6">
                    <FormControl fullWidth>
                      <InputLabel
                        id="CarpenterExperience-label"
                        style={{ fontSize: "2.5rem" }}
                      >
                        Experience Preferred
                      </InputLabel>
                      <Select
                        label="Experience Preferred"
                        labelId="CarpenterExperience-label"
                        id="CarpenterExperience-label"
                        value={degree}
                        onChange={(e) => setDegree(e.target.value)}
                        required
                        style={{ fontSize: "2.5rem", minWidth: "200px" }}
                        inputProps={{ style: { fontSize: "2.5rem" } }}
                      >
                        <MenuItem
                          value="Beginner"
                          style={{ fontSize: "2.5rem" }}
                        >
                          Beginner
                        </MenuItem>
                        <MenuItem
                          value="Intermediate"
                          style={{ fontSize: "2.5rem" }}
                        >
                          Intermediate
                        </MenuItem>
                        <MenuItem
                          value="Advanced"
                          style={{ fontSize: "2.5rem" }}
                        >
                          Advanced
                        </MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl fullWidth>
                      <InputLabel
                        id="ElectricianTime-label"
                        style={{ fontSize: "2.5rem" }}
                      >
                        Time Preferred
                      </InputLabel>
                      <Select
                        label="Time Preferred"
                        labelId="CarpenterTime-label"
                        id="CarpenterTime-label"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        required
                        style={{ fontSize: "2.5rem", minWidth: "200px" }}
                        inputProps={{ style: { fontSize: "2.5rem" } }}
                      >
                        <MenuItem value="7" style={{ fontSize: "2.5rem" }}>
                          7
                        </MenuItem>
                        <MenuItem value="8" style={{ fontSize: "2.5rem" }}>
                          8
                        </MenuItem>
                        <MenuItem value="9" style={{ fontSize: "2.5rem" }}>
                          9
                        </MenuItem>
                        <MenuItem value="10" style={{ fontSize: "2.5rem" }}>
                          10
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </>
              )}
              {serviceName === "maid" && (
                <>
                  <div className="flex flex-col justify-start items-start gap-2 my-2">
                    {subjects.map((_, index) => (
                      <div
                        key={index}
                        className="flex flex-col justify-start items-start gap-2 my-2"
                      >
                        <FormControl>
                          <InputLabel
                            id={`maid-label-${index}`}
                            style={{ fontSize: "2.5rem" }}
                          >
                            Maid {index + 1}
                          </InputLabel>
                          <Select
                            labelId={`maid-label-${index}`}
                            id={`maid-select-${index}`}
                            label={`Maid ${index + 1}`}
                            value={subjects[index]}
                            onChange={(e) =>
                              updateSubject(index, e.target.value)
                            }
                            required
                            style={{ fontSize: "2.5rem", minWidth: "200px" }}
                            inputProps={{ style: { fontSize: "2.5rem" } }}
                          >
                            <MenuItem
                              value="General Cleaning"
                              style={{ fontSize: "2.5rem" }}
                            >
                              General Cleaning
                            </MenuItem>
                            <MenuItem
                              value="Kitchen Cleaning"
                              style={{ fontSize: "2.5rem" }}
                            >
                              Kitchen Cleaning
                            </MenuItem>
                            <MenuItem
                              value="Bathroom Cleaning"
                              style={{ fontSize: "2.5rem" }}
                            >
                              Bathroom Cleaning
                            </MenuItem>
                            <MenuItem
                              value="Bedroom Cleaning"
                              style={{ fontSize: "2.5rem" }}
                            >
                              Bedroom Cleaning
                            </MenuItem>
                            <MenuItem
                              value="Laundry and Ironing"
                              style={{ fontSize: "2.5rem" }}
                            >
                              Laundry and Ironing
                            </MenuItem>
                          </Select>
                        </FormControl>
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
                  <div className="flex flex-col justify-start items-start gap-8 my-6">
                    <FormControl fullWidth>
                      <InputLabel
                        id="MaidExperience-label"
                        style={{ fontSize: "2.5rem" }}
                      >
                        Experience Preferred
                      </InputLabel>
                      <Select
                        label="Experience Preferred"
                        labelId="MaidExperience-label"
                        id="MaidExperience-label"
                        value={degree}
                        onChange={(e) => setDegree(e.target.value)}
                        required
                        style={{ fontSize: "2.5rem", minWidth: "200px" }}
                        inputProps={{ style: { fontSize: "2.5rem" } }}
                      >
                        <MenuItem
                          value="Beginner"
                          style={{ fontSize: "2.5rem" }}
                        >
                          Beginner
                        </MenuItem>
                        <MenuItem
                          value="Intermediate"
                          style={{ fontSize: "2.5rem" }}
                        >
                          Intermediate
                        </MenuItem>
                        <MenuItem
                          value="Advanced"
                          style={{ fontSize: "2.5rem" }}
                        >
                          Advanced
                        </MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl fullWidth>
                      <InputLabel
                        id="MaidTime-label"
                        style={{ fontSize: "2.5rem" }}
                      >
                        Time Preferred
                      </InputLabel>
                      <Select
                        label="Time Preferred"
                        labelId="MaidTime-label"
                        id="MaidTime-label"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        required
                        style={{ fontSize: "2.5rem", minWidth: "200px" }}
                        inputProps={{ style: { fontSize: "2.5rem" } }}
                      >
                        <MenuItem value="7" style={{ fontSize: "2.5rem" }}>
                          7
                        </MenuItem>
                        <MenuItem value="8" style={{ fontSize: "2.5rem" }}>
                          8
                        </MenuItem>
                        <MenuItem value="9" style={{ fontSize: "2.5rem" }}>
                          9
                        </MenuItem>
                        <MenuItem value="10" style={{ fontSize: "2.5rem" }}>
                          10
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </>
              )}
              {serviceName === "yoga" && (
                <>
                  <div className="flex flex-col justify-start items-start gap-2 my-2">
                    {subjects.map((_, index) => (
                      <div
                        key={index}
                        className="flex flex-col justify-start items-start gap-2 my-2"
                      >
                        <FormControl>
                          <InputLabel
                            id={`yoga-label-${index}`}
                            style={{ fontSize: "2.5rem" }}
                          >
                            Yoga {index + 1}
                          </InputLabel>
                          <Select
                            labelId={`yoga-label-${index}`}
                            id={`yoga-select-${index}`}
                            label={`Yoga ${index + 1}`}
                            value={subjects[index]}
                            onChange={(e) =>
                              updateSubject(index, e.target.value)
                            }
                            required
                            style={{ fontSize: "2.5rem", minWidth: "200px" }}
                            inputProps={{ style: { fontSize: "2.5rem" } }}
                          >
                            <MenuItem
                              value="Yoga Classes"
                              style={{ fontSize: "2.5rem" }}
                            >
                              Yoga Classes
                            </MenuItem>
                            <MenuItem
                              value="Private Sessions"
                              style={{ fontSize: "2.5rem" }}
                            >
                              Private Sessions
                            </MenuItem>
                            <MenuItem
                              value="Yoga Workshops and Retreats"
                              style={{ fontSize: "2.5rem" }}
                            >
                              Yoga Workshops and Retreats
                            </MenuItem>
                            <MenuItem
                              value="Yoga Therapy"
                              style={{ fontSize: "2.5rem" }}
                            >
                              Yoga Therapy
                            </MenuItem>
                            <MenuItem
                              value="Online Yoga Classes"
                              style={{ fontSize: "2.5rem" }}
                            >
                              Online Yoga Classes
                            </MenuItem>
                          </Select>
                        </FormControl>
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
                  <div className="flex flex-col justify-start items-start gap-8 my-6">
                    <FormControl fullWidth>
                      <InputLabel
                        id="YogaExperience-label"
                        style={{ fontSize: "2.5rem" }}
                      >
                        Experience Preferred
                      </InputLabel>
                      <Select
                        label="Experience Preferred"
                        labelId="YogaExperience-label"
                        id="YogaExperience-label"
                        value={degree}
                        onChange={(e) => setDegree(e.target.value)}
                        required
                        style={{ fontSize: "2.5rem", minWidth: "200px" }}
                        inputProps={{ style: { fontSize: "2.5rem" } }}
                      >
                        <MenuItem
                          value="Beginner"
                          style={{ fontSize: "2.5rem" }}
                        >
                          Beginner
                        </MenuItem>
                        <MenuItem
                          value="Intermediate"
                          style={{ fontSize: "2.5rem" }}
                        >
                          Intermediate
                        </MenuItem>
                        <MenuItem
                          value="Advanced"
                          style={{ fontSize: "2.5rem" }}
                        >
                          Advanced
                        </MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl fullWidth>
                      <InputLabel
                        id="MaidTime-label"
                        style={{ fontSize: "2.5rem" }}
                      >
                        Time Preferred
                      </InputLabel>
                      <Select
                        label="Time Preferred"
                        labelId="YogaTime-label"
                        id="YogaTime-label"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        required
                        style={{ fontSize: "2.5rem", minWidth: "200px" }}
                        inputProps={{ style: { fontSize: "2.5rem" } }}
                      >
                        <MenuItem value="7" style={{ fontSize: "2.5rem" }}>
                          7
                        </MenuItem>
                        <MenuItem value="8" style={{ fontSize: "2.5rem" }}>
                          8
                        </MenuItem>
                        <MenuItem value="9" style={{ fontSize: "2.5rem" }}>
                          9
                        </MenuItem>
                        <MenuItem value="10" style={{ fontSize: "2.5rem" }}>
                          10
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </>
              )}
            </>
          )}
          <div className="flex justify-center items-center gap-4 my-4 mt-24">
            <Button
              variant="contained"
              onClick={joinChat}
              style={{
                fontSize: "3rem",
                width: "35rem",
                height: "8rem",
                borderRadius: "25px",
                // marginTop: "17rem",
              }}
            >
              Start search
            </Button>
          </div>
        </>
      </Grid>
    </Grid>
  );
};
