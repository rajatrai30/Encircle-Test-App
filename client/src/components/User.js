import React from "react";
import "./User.css";

function User({ avatar, name, email, location }) {
  return (
    <div className="UserComponent text-[2rem]">
      <div className="AvatarColumn">
        <img src={avatar} alt="User Avatar" />
      </div>
      <div className="InfoColumn">
        <h2>{name}</h2>
        <p>{email}</p>
      </div>
    </div>
  );
}

export default User;
