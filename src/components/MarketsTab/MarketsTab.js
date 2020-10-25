import React, { useState, useEffect } from "react";

import NavBar from "../common/NavBar";
import Footer from "../common/Footer";
import MarketSummary from "./MarketSummary";
import MarketListDisplay from "./MarketListDisplay";
import IconTitle from "../common/IconTitle";

const COINGECKO_GLOBAL_GET = "https://api.coingecko.com/api/v3/global";

function MarketsTab(props) {
  const [globalMarketData, setGlobalMarketData] = useState({});

  const getMarketData = () => {
    fetch(COINGECKO_GLOBAL_GET)
      .then((res) => res.json())
      .then((data) => {
        setGlobalMarketData(parseData(data));
      })
      .catch((err) => console.log(err));

    const formatLrgNum = (num) => {
      let n = parseInt(num);
      if (parseInt(n) < 1e3) return n;
      if (parseInt(n) >= 1e3 && n < 1e6) return (n / 1e3).toFixed(1) + " K";
      if (parseInt(n) >= 1e6 && n < 1e9) return (n / 1e6).toFixed(1) + " M";
      if (parseInt(n) >= 1e9 && n < 1e12) return (n / 1e9).toFixed(1) + " B";
      if (parseInt(n) >= 1e12 && n < 1e15) return (n / 1e12).toFixed(1) + " T";
    };

    const parseData = (data) => {
      let myObj = {};
      myObj["market_cap"] = formatLrgNum(data.data.total_market_cap.usd);
      myObj["vol"] = formatLrgNum(data.data.total_volume.usd);
      myObj["btc_dom"] = parseFloat(
        data.data.market_cap_percentage.btc.toFixed(2)
      );
      return myObj;
    };
  };

  useEffect(getMarketData, []);

  return (
    <div className="container">
      <NavBar history={props.history} />
      <br />
      <IconTitle page="markets" />
      <MarketSummary globalMarketData={globalMarketData} />
      <div
        className="box mb-2 py-0 is-transparent"
        style={{
          borderColor: "#4b4b4b",
          borderRadius: 5,
          borderStyle: "solid",
          borderWidth: "1px",
        }}
      >
        <div className="columns is-gapless is-mobile">
          <div className="column has-text-centered">
            <strong>Name</strong>
          </div>
          <div className="column has-text-centered">
            <strong>Price</strong>
          </div>
          <div className="column has-text-centered">
            <strong>Market Cap &emsp;</strong>
          </div>
        </div>
      </div>
      <MarketListDisplay priceData={props.priceData} history={props.history} />
      <Footer />
    </div>
  );
}

export default MarketsTab;
