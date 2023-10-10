import React from "react";
import GoogleSignin from "../img/btn_google_signin_dark_pressed_web.png";
import { auth } from "../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const Welcome = () => {
  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  return (
    <main className="welcome flex flex-col items-center justify-center">
      <h2 className="text-[4rem] lg:text-[2rem]">EnCircle Test App</h2>
      <p className="text-[2rem] lg:text-[1rem]">In this test App, we try to get data(userdata) of <br/> the user who is present in our nearby location</p>
      <button className="sign-in">
        <img
          onClick={googleSignIn}
          src={GoogleSignin}
          alt="sign in with google"
          type="button"
        />
      </button>
    </main>
  );
};

export default Welcome;
