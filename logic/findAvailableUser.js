const { getUsers } = require("../controller/controller");

const distance = (lat1, lon1, lat2, lon2) => {
    var p = 0.017453292519943295;   
    var c = Math.cos;
    var a = 0.5 - c((lat2 - lat1) * p)/2 + 
            c(lat1 * p) * c(lat2 * p) * 
            (1 - c((lon2 - lon1) * p))/2;
  
    return 12742 * Math.asin(Math.sqrt(a))*1000; 
  }

const findAvailableUser = async (user) => {
    const allActiveUser = await getUsers();

    const closeByUser = allActiveUser.filter((dbUser) => {
        const dist = distance(
            parseFloat(user.y),
            parseFloat(user.x),
            parseFloat(dbUser.y),
            parseFloat(dbUser.x)
        );
        // const hasMatchingInterests = interests && dbUser.interests === interests;
        // return dist < 15 && dbUser.socketID !== user.socketID && hasMatchingInterests;
        // return dist<15 && dbUser.socketID != user.socketID && dbUser.interests == user.interests && dbUser.time == user.time && dbUser.degree == user.degree;

        const hasMatchingSubject = user.subjects && user.subjects.some((subject) => dbUser.subjects.includes(subject));
        return dist < 15 && dbUser.socketID !== user.socketID && hasMatchingSubject;
    });

    return closeByUser;
};

module.exports = { findAvailableUser };
