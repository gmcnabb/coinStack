import React from "react";

import NavBar from "../common/NavBar";
import Footer from "../common/Footer";
import IconTitle from "../common/IconTitle";
import AddCoinListDisplay from "./AddCoinListDisplay";
import SearchBar from "./SearchBar";

function AddCoinTab(props) {
  return (
    <div className="container">
      <NavBar history={props.history} />
      <br />
      <IconTitle page={"addCoin"} />
      <SearchBar
        userDB={props.userDB}
        user={props.user}
        getUserDB={() => props.getUserDB()}
      />
      <div
        className="box mt-4 mb-2 py-0 is-transparent"
        style={{
          borderColor: "#4b4b4b",
          borderRadius: 5,
          borderStyle: "solid",
          borderWidth: "1px",
        }}
      >
        <div className="columns is-gapless is-mobile">
          <div className="column has-text-centered">
            <strong>Name and Ticker</strong>
          </div>
        </div>
      </div>
      <AddCoinListDisplay
        priceData={props.priceData}
        userDB={props.userDB}
        user={props.user}
        getUserDB={() => props.getUserDB()}
      />
      <Footer />
    </div>
  );
}

export default AddCoinTab;
