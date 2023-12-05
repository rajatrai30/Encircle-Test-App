import React from "react";
import "./User.css";
// import ServiceIcon from "../assets/ServiceIcons/ServiceMain.png"

function User({ avatar, name, email, location }) {
  return (
    <div className="UserComponent my-8">
      <div className="AvatarColumn">
        <img src={avatar} alt="User Avatar" />
      </div>
      <div className="InfoColumn my-2">
        <h2>{name}</h2>
        {/* <p>{email}</p> */}
      </div>
      {/* <div>
      <img src={ServiceIcon} alt="EnCircle" className="HomeIcon" />
      </div> */}
    </div>
  );
}

export default User;
