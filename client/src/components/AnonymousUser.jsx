import React from "react";
import "./User.css";

function AnonymousUser({ avatar, name, email, location }) {
  return (
    <div className="UserComponent">
      <div className="AvatarColumn text-[2rem] lg:text-[1.3rem]">
        <h2>Name: </h2>
        <p>Email ID: </p>
      </div>
      <div className="InfoColumn text-[2rem] lg:text-[1.3rem]">
        <h2>{name}</h2>
        <p>{email}</p>
      </div>
    </div>
  );
}

export default AnonymousUser;
