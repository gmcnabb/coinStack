import React, { useEffect } from "react";
import firebase from "../../firebase";

import { Link } from "react-router-dom";
import logo from "../../images/coinStackLogo.svg";

function NavBar(props) {
  const runSetup = () => {
    // Get all "navbar-burger" elements
    const $navbarBurgers = Array.prototype.slice.call(
      document.querySelectorAll(".navbar-burger"),
      0
    );

    // Check if there are any navbar burgers
    if ($navbarBurgers.length > 0) {
      // Add a click event on each of them
      $navbarBurgers.forEach((el) => {
        el.addEventListener("click", () => {
          // Get the target from the "data-target" attribute
          const target = el.dataset.target;
          const $target = document.getElementById(target);

          // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
          el.classList.toggle("is-active");
          $target.classList.toggle("is-active");
        });
      });
    }
  };
  const signOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        // Sign-out successful.
        setTimeout(() => {
          props.history.push("/");
          alert("sign out successful!");
        }, 1000);
      })
      .catch(function (err) {
        // An error happened.
        console.log(err);
      });
  };

  useEffect(runSetup, []);

  return (
    <>
      <nav
        className="navbar"
        role="navigation"
        aria-label="main navigation"
        style={{ background: "transparent" }}
      >
        <div className="navbar-brand p-0">
          <Link className="navbar-item" to="/">
            <img src={logo} alt="coinStack logo" width="180"></img>
          </Link>

          <button
            className="navbar-burger burger"
            aria-label="menu"
            aria-expanded="false"
            data-target="navbarBasicExample"
            style={{
              background: "transparent",
              border: "none",
              outline: 0,
            }}
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </button>
        </div>

        <div
          id="navbarBasicExample"
          className="navbar-menu is-shadowless"
          style={{ background: "transparent" }}
        >
          <div className="navbar-start">
            <Link className="navbar-item" to="/home">
              <strong>Portfolio</strong>
            </Link>
            <Link className="navbar-item" to="/addcoin">
              <strong>Add Coin</strong>
            </Link>
            <Link className="navbar-item" to="/markets">
              <strong>Markets</strong>
            </Link>
            <Link className="navbar-item" to="/trends">
              <strong>Trends</strong>
            </Link>
          </div>

          <div className="navbar-end">
            <div className="navbar-item">
              <div className="buttons">
                <Link className="button is-primary is-outlined" to="/">
                  <strong>Log In</strong>
                </Link>
                <button
                  className="button is-primary is-outlined"
                  onClick={signOut}
                >
                  Log Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <hr style={{ border: "1px solid #209cee", margin: 0 }} />
      <br />
    </>
  );
}

export default NavBar;
