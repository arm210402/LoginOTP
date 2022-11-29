import React from "react";

const Home = ({ signOut, user }) => {
  console.log(user);
  return (
    <div className="wrapper">
      <h1 className="main-heading">Welcome 👋, {user.phoneNumber}</h1>
      <button className="main-button" id="signOut" onClick={signOut}>
        Sign Out
      </button>
    </div>
  );
};

export default Home;
