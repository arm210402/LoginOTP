import React, { useEffect, useState } from "react";
import "./App.css";

import firebase from "firebase/app";
import "firebase/auth";

// react router
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

//components
import SignIn from "./components/SignIn";
import Home from "./components/Home";

const App = () => {
  const [viewOtpForm, setViewOtpForm] = useState(false);
  const [user, setUser] = useState(false);
  const firebaseConfig = {
    apiKey: process.env.REACT_APP_APIKEY,
    authDomain: process.env.REACT_APP_AUTHDOMAIN,
    projectId: process.env.REACT_APP_PROJECTID,
    storageBucket: process.env.REACT_APP_STORAGEBUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGESENDERID,
    appId: process.env.REACT_APP_APIID
  };

  useEffect(() => {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        callback: function (response) {
          console.log("Captcha Resolved");
          this.onSignInSubmit();
        },
        defaultCountry: "IN",
      }
    );
  }, []);

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  } else {
    firebase.app(); // if already initialized, use that one
  }

  const auth = firebase.auth();

  auth.onAuthStateChanged((user) => {
    if (user) {
      setUser(user);
    }
  });

  const loginSubmit = (e) => {
    e.preventDefault();

    let phone_number = "+91" + e.target.phone.value;
    const appVerifier = window.recaptchaVerifier;

    auth
      .signInWithPhoneNumber(phone_number, appVerifier)
      .then((confirmationResult) => {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        console.log("otp sent");
        setViewOtpForm(true);
        window.confirmationResult = confirmationResult;
        // ...
      })
      .catch((error) => {
        // Error; SMS not sent
        // ...
        alert(error.message);
      });
  };

  const otpSubmit = (e) => {
    e.preventDefault();

    let opt_number = e.target.otp_value.value;

    window.confirmationResult
      .confirm(opt_number)
      .then((confirmationResult) => {
        console.log(confirmationResult);
        console.log("success");
        window.open("/", "_self");
      })
      .catch((error) => {
        // User couldn't sign in (bad verification code?)
        alert(error.message);
      });
  };

  const signOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        window.open("/signin", "_self");
      })
      .catch((error) => {
        // An error happened.
        console.log(error);
      });
  };

  return (
    <Router>
      <div id="recaptcha-container"></div>
      <Switch>
        
        <Route path="/" exact>
          <SignIn
            loginSubmit={loginSubmit}
            otpSubmit={otpSubmit}
            viewOtpForm={viewOtpForm}

          />
          user?<Home signOut={signOut} user={user} />:"Error";
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
