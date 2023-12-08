import React from "react";
import "./AnonymousUser.css";

function AnonymousUser({ avatar, name }) {
  return (
    <div className="AnonymousUserUserComponent my-8">
      <div className="AnonymousUserAvatarColumn">
        <img src={avatar} alt="User Avatar" />
      </div>
      <div className="AnonymousUserInfoColumn my-2">
        <h2>{name}</h2>
        {/* <p>{email}</p> */}
      </div>
      {/* <div>
    <img src={ServiceIcon} alt="EnCircle" className="HomeIcon" />
    </div> */}
    </div>
  );
}

export default AnonymousUser;
