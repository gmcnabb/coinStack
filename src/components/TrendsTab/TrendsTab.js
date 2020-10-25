import React, { useState, useEffect } from "react";
import IconTitle from "../common/IconTitle";
import TrendsDisplay from "./TrendsDisplay";
import NavBar from "../common/NavBar";
import Footer from "../common/Footer";

function TrendsTab(props) {
  const [trendList, setTrendList] = useState(undefined);

  const getTrendData = () => {
    const COINGECKO_TRENDS = `https://api.coingecko.com/api/v3/search/trending`;

    let trendArr = [];
    fetch(COINGECKO_TRENDS)
      .then((res) => res.json())
      .then((data) => {
        data.coins.forEach((entry) => {
          let myObj = {};
          myObj["id"] = entry.item.id;
          myObj["symbol"] = entry.item.symbol;
          myObj["MCRank"] = entry.item.market_cap_rank;
          myObj["picURL"] = entry.item.large;
          trendArr.push(myObj);
        });
        setTrendList(trendArr);
      });
  };

  useEffect(getTrendData, []);

  return (
    <div className="container">
      <NavBar history={props.history} />
      <br />
      <IconTitle page="trends" />
      <div
        className="box mb-5 py-3"
        style={{
          background: "linear-gradient( to top right, #323232, #4b4b4b",
        }}
      >
        <div className="columns is-gapless is-mobile">
          <div className="column has-text-centered">
            <p>(news section placeholder)</p>
            <p>CoinGecko Top-7 Searched in last 24hrs:</p>
          </div>
        </div>
      </div>
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
            <strong>&nbsp;Logo</strong>
          </div>
          <div className="column has-text-centered">
            <strong>Name&emsp;</strong>
          </div>
          <div className="column has-text-right">
            <strong>Ticker</strong>
          </div>
        </div>
      </div>
      <div style={{ overflowY: "auto", height: 500 }}>
        <TrendsDisplay trendList={trendList} history={props.history} />
      </div>
      <Footer />
    </div>
  );
}

export default TrendsTab;
