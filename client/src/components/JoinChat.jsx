import React, { useEffect, useState } from "react";
import { useStore } from "../zustand/store";
import shallow from "zustand/shallow";
import { Button, Grid, TextField } from "@mui/material";
import Description from "./Description";

import Welcome from "../components/Welcome";
import User from "../components/User";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";



export const JoinChat = () => {
    const [user] = useAuthState(auth);
    const [userCount, setUserCount] = useStore(
        (state) => [state.userCount, state.setUserCount],
        shallow
    );
    const setChat = useStore((state) => state.setChat);
    const socket = useStore((state) => state.socket);

    // const [interests, setInterests] = useState("");
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

    const joinChat = async () => {
        if ("geolocation" in navigator) {
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
                    time,
                    degree,
                };

                await socket.emit("create_chat", userData);
                setChat(true);
            });
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
    

    return (
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            style={{ minHeight: "100vh" }}
        >
            <Grid item xs="auto" marginBottom="30px">
                <h1 className="text-bold text-[4rem] lg:text-[3rem]">Welcome to Encircle Test App</h1>
                {!user ? (
                    <Welcome/>
                ) : (
                    <User
                        avatar={user.photoURL}
                        name={user.displayName}
                        email={user.email}
                    />
                )}
            </Grid>
            <Grid item xs="auto" marginBottom="30px">
                <Description />
            </Grid>
            <Grid>
            {!user ? (
                    <p className="text-bold text-[2rem] lg:text-[2rem]">Please sign in to start a chat.</p>
                ) : (
                    <div>
                        {/* Add a text input for interests */}
                        {subjects.map((subject, index) => (
                            <div key={index}>
                                <TextField
                                    label={`Subject ${index + 1}`}
                                    value={subject}
                                    onChange={(e) => updateSubject(index, e.target.value)}
                                />
                            </div>
                        ))}
                        {subjects.length < maxSubjects && (
                            <IconButton onClick={addSubject}>
                                <AddIcon />
                            </IconButton>
                        )}
                        {/* Add a text input for degree */}
                        <TextField
                            label="Degree Preferred"
                            value={degree}
                            onChange={(e) => setDegree(e.target.value)}
                        />
                        <TextField
                            label="Time for Lecture"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                        />

                        <Button variant="contained" onClick={joinChat} className="w-56">
                            Start chat
                        </Button>
                    </div>
                )}
            </Grid>
        </Grid>
    );
};
