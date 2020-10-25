import React from "react";

import NavBar from "../common/NavBar";
import Footer from "../common/Footer";
import PortfolioSummary from "./PortfolioSummary";
import HomeDetailDisplay from "./PortfolioDetailDisplay";
import IconTitle from "../common/IconTitle";

function HomeTab(props) {
  return (
    <div className="container">
      <NavBar history={props.history} />
      <br />
      <IconTitle page="portfolio" />
      <PortfolioSummary portfolio={props.portfolio} />
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
          <div className="column">
            <strong>Coin</strong>
          </div>
          <div className="column has-text-centered">
            <strong>Price&emsp;</strong>
          </div>
          <div className="column has-text-right">
            <strong>Holdings&nbsp;</strong>
          </div>
        </div>
      </div>
      <div style={{ overflowY: "auto", height: 500 }}>
        <HomeDetailDisplay
          history={props.history}
          userDB={props.userDB}
          portfolio={props.portfolio}
          priceData={props.priceData}
        />
      </div>
      <Footer />
    </div>
  );
}

export default HomeTab;
