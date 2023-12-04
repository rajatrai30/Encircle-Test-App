const { getUsers } = require("../controller/controller");

const distance = (lat1, lon1, lat2, lon2) => {
  // ... (same as your existing distance function)
  var p = 0.017453292519943295;
  var c = Math.cos;
  var a =
    0.5 -
    c((lat2 - lat1) * p) / 2 +
    (c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))) / 2;

  return 12742 * Math.asin(Math.sqrt(a)) * 1000;
};

const getFCMTokenOfClosestUser = async (user) => {
  const allActiveUser = await getUsers();

  const closestUser = allActiveUser.reduce(
    (closest, dbUser) => {
      console.log("DB User:", dbUser);
      const dist = distance(
        parseFloat(user.y),
        parseFloat(user.x),
        parseFloat(dbUser.y),
        parseFloat(dbUser.x)
      );

      if (
        dist < 15 &&
        dbUser.socketID !== user.socketID &&
        dist < closest.distance
      ) {
        closest.distance = dist;
        closest.fcmToken = dbUser.fcmToken;
      }

      return closest;
    },
    { distance: Infinity, fcmToken: null }
  );

  console.log("Closest User:", closestUser);

  // Check if a valid FCM token is found
  if (closestUser.fcmToken !== null) {
    console.log("Found FCM Token:", closestUser.fcmToken);
    return closestUser.fcmToken;
  } else {
    console.log("FCM token not found for the closest user.");
    return null;
  }
};

module.exports = { getFCMTokenOfClosestUser }; 