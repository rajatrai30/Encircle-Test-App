// Add this function in a separate file or in the same file
export const getToken = async (messaging, options) => {
  try {
    const currentToken = await messaging.getToken(options);
    console.log("FCM Token:", currentToken);
    return currentToken;
  } catch (error) {
    console.error("Error getting FCM token:", error);
    throw error;
  }
};
