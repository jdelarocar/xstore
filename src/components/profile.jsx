import React from "react";
import auth from "../services/authService";

const Profile = () => {
  const user = auth.getCurrentUser();
  return <h1>Profile of {user.name}</h1>;
};

export default Profile;
