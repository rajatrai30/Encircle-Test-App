const { updateXY, deleteUser, addUserToBusy, getAnActiveUser, getFcmTokenBySocketId } = require("../controller/controller");
const { findAvailableUser } = require("../logic/findAvailableUser");
const { sendNotification } = require("./fcm");

const createChat = async (socket, data, user) => {
    const userWithLocation = {
        ...user,
        ...data,
    };
    await updateXY(user, userWithLocation);
    
    //which room to put user 
    const userNearBy = await findAvailableUser(userWithLocation);
    const room = userNearBy.length
        ? userNearBy[0].socketID //already created room by first user
        : userWithLocation.socketID; //new room as first user
    

    // const fcmTokenForSecondUser = "fAdKZe8f7-_7ZTeSOPnBnN:APA91bE6PeVwjosfcfp4M1OteHM-Za15x8nWIuQgSjxYSKJawN5OXcnzmjZMkiHaPmsSm7cZnzjs00X6Ag2Fhg268d6yBoqf3B5s1bGTz-4PISKxiX0SN9lu7f8tHWiJNvd-Jz3SCm5y";
    const fcmTokenForSecondUser = "eBGJIgQfa4Jc4iPq06fDKu:APA91bHGeyOzW3xLGnxvVjTYYHlalqrHaMi1TkIym1mBRPrt1QCJN5u3UMDLJFIXkHz2QkeAf6p_NxP7q5mIDyhrDxzNA6CN5VIo_WMKpkaI4nb9sqDOF1KfGLe0GFX6REyKbx_j3dlM"
    // const fcmTokenForSecondUser = "e452G-Jn597hZJ4KTBrtgH:APA91bHLIsmxMVnFCEtJN6b5Nkmpa1POCG2hWQLoDYGyGeMPVsx1AUme2RvPN8uWIYnNXZYCoFhg0m7D8DR6EvtNnLbGNmTEjaHqxVm_8eFwwgIWUcS4FUbLfYc7E7rWyZS-WHFV_Fop";
    // const fcmTokenForSecondUser = await getFcmTokenBySocketId(userWithLocation.socketID);

    // Send push notification to the second
    const titleToSecondUser = "New Chat Request";
    const bodyToSecondUser = "wants to chat with you";
    const imageToSecondUser = "https://rajat.engineer/static/media/profileImg.4a5ed4206aa46ec7703f.jpg";
    const click_action = "/";

    console.log("fcmToken: ", fcmTokenForSecondUser);

    sendNotification(fcmTokenForSecondUser, titleToSecondUser, bodyToSecondUser, imageToSecondUser, click_action);

   
    //move both users from active to busy if it's the second user entering the room
    //inform first user that he is connected to second user
    if(room!=userWithLocation.socketID){
        //2nd user who just entered the room
        await deleteUser({ socketID: user.socketID });
        await addUserToBusy(userWithLocation);
        //first user who is already in the room and has same socket id as the room name
        //first get the user from active user collection 
        const firstUser = await getAnActiveUser(room);
        await deleteUser({ socketID: room });
        await addUserToBusy(firstUser);

        // LOG CHECKING
        // const fcmTokenForSecondUser = "e452G-Jn597hZJ4KTBrtgH:APA91bHLIsmxMVnFCEtJN6b5Nkmpa1POCG2hWQLoDYGyGeMPVsx1AUme2RvPN8uWIYnNXZYCoFhg0m7D8DR6EvtNnLbGNmTEjaHqxVm_8eFwwgIWUcS4FUbLfYc7E7rWyZS-WHFV_Fop";
        // const fcmTokenForSecondUser = "fAdKZe8f7-_7ZTeSOPnBnN:APA91bE6PeVwjosfcfp4M1OteHM-Za15x8nWIuQgSjxYSKJawN5OXcnzmjZMkiHaPmsSm7cZnzjs00X6Ag2Fhg268d6yBoqf3B5s1bGTz-4PISKxiX0SN9lu7f8tHWiJNvd-Jz3SCm5y";


        // if (fcmTokenForSecondUser) {
        //     sendNotification(fcmTokenForSecondUser, titleToSecondUser, bodyToSecondUser, imageToSecondUser);
        // }

        //emitting to first user that second user is online 
        socket.to(room).emit("2nd_user", userWithLocation.socketID)
    }

    socket.join(room);
    await socket.emit("chat_room", {room, ...userWithLocation});
}

module.exports = {createChat}