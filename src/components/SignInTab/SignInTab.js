import React, { useState, useEffect } from "react";
import firebase from "../../firebase";
import { FIREBASE_CONFIG } from "../../firebase";

import NavBar from "../common/NavBar";
import Footer from "../common/Footer";
import homepageImg from "../../assets/coinStack4x3.png";

function SignInTab(props) {
  const [textInput, setTextInput] = useState("");

  const initFirebase = () => {
    // init firebase if not already done.
    if (!firebase.apps.length) {
      firebase.initializeApp(FIREBASE_CONFIG);
    }
  };
  const sendLinkToEmail = (e) => {
    e.preventDefault();
    const providedEmail = textInput;
    const actionCodeSettings = {
      // URL you want to redirect back to. The domain (www.example.com) for this
      // URL must be whitelisted in the Firebase Console.
      // url: "http://coinstack.money/home",
      url: "http://localhost:3000/",
      // This must be true.
      handleCodeInApp: true,
    };
    firebase
      .auth()
      .sendSignInLinkToEmail(providedEmail, actionCodeSettings)
      .then(function () {
        // The link was successfully sent. Inform the user.
        alert(
          "LogIn link sent! Check your email for a link to access your personal dashboard!"
        );
        // Save the email locally so you don't need to ask the user for it again
        // if they open the link on the same device.
        window.localStorage.setItem("emailForSignIn", providedEmail);
      })
      .catch((err) => {
        // Some error occurred, you can inspect the code: error.code
        console.log(err);
      });
  };

  useEffect(initFirebase, []);

  return (
    <div
      style={{
        background: "linear-gradient(#272727, #209cee)",
        backgroundBlendMode: "screen",
        position: "absolute",
        top: 0,
        left: 0,
        height: "100%",
        width: "100%",
      }}
    >
      <div className="container">
        <NavBar history={props.history} />
        <div className="has-text-centered">
          <h1
            className="title is-2 is-family-secondary is-size-3-mobile"
            style={{
              textShadow: "2px 2px 5px #efefef",
            }}
          >
            Keep track of your stack
          </h1>
        </div>
        <div
          className="box has-text-centered is-vcentered mb-0 px-5"
          style={{
            background: "transparent",
          }}
        >
          <p>coinStack is a live portfolio tracker for your cryto assets.</p>
          Send a magic login link to your email address to access your
          portfolio!
          {props.user === null ? (
            <div style={{ verticalAlign: "baseline" }}>
              <form
                onSubmit={sendLinkToEmail}
                style={{ verticalAlign: "center" }}
              >
                <input
                  className="input is-primary is-small"
                  type="text"
                  placeholder="example@email.com"
                  style={{ width: 180, background: "transparent" }}
                  onChange={(e) => setTextInput(e.target.value)}
                ></input>
                &emsp;
                <button
                  className="button is-primary is-outlined is-small"
                  style={{ verticalAlign: "middle" }}
                >
                  Send
                </button>
              </form>
            </div>
          ) : (
            <>
              <br />
              <div>Logged in as: {props.user.email}</div>
            </>
          )}
        </div>
        <div
          className="box has-text-centered"
          style={{ background: "transparent", padding: 0 }}
        >
          <figure className="image is-4by3">
            <img src={homepageImg} alt={"coinStack homepage"} />
          </figure>
          <Footer />
          <div className="has-text-right">
            Powered by{" "}
            <a href="https://www.coingecko.com/en/api">CoinGecko API&nbsp;</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignInTab;
