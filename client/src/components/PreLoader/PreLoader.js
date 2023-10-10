import React from "react";
import "./PreLoader.css";
import Lottie from "lottie-react";
import animationData from "../../assets/Lotties/radar2.json";

const PreLoader = () => {
  return (
    <div className="flex flex-row items-center justify-center preloader">
      <div className="flex flex-col items-center justify-center">
        <Lottie className="w-72 h-72" animationData={animationData} />
      </div>
    </div>
  );
};

export default PreLoader;
