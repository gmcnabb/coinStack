import React, { useState } from "react";

import PortfolioListItem from "./PortfolioListItem";

function HomeDetailDisplay(props) {
  const [hoveredTicker, setHoveredTicker] = useState("");

  const toggleHighlight = (ticker) => {
    hoveredTicker === ticker ? setHoveredTicker("") : setHoveredTicker(ticker);
  };

  // if have some user portfolio and price data
  if (
    props.userDB &&
    Object.keys(props.userDB).length > 0 &&
    Object.keys(props.priceData).length > 0
  ) {
    const tickers = Object.keys(props.userDB.watchlist).sort(
      new Intl.Collator("en").compare
    );
    return tickers.map((ticker) =>
      props.priceData[ticker] === undefined ? (
        <div className="box mb-2 py-4" key={ticker}>
          {ticker.toUpperCase()} data not available
        </div>
      ) : (
        <div
          className="box mb-2 py-4"
          style={
            hoveredTicker !== ticker
              ? {
                  background: "linear-gradient( to top right, #323232, #4b4b4b",
                }
              : { background: "#4b4b4b" }
          }
          key={ticker}
          onClick={() => props.history.push(`/coindetail/${ticker}`)}
          onMouseEnter={() => toggleHighlight(ticker)}
          onMouseLeave={() => toggleHighlight(ticker)}
        >
          <PortfolioListItem
            history={props.history}
            ticker={ticker}
            name={props.priceData[ticker].name}
            price={props.priceData[ticker].price}
            valueHoldings={
              props.portfolio[ticker] === undefined
                ? ""
                : props.portfolio[ticker].valueHoldings
            }
          />
        </div>
      )
    );
  } else {
    // if have no user portfolio data
    return <div>use the add coin page and your coins will appear here...</div>;
  }
}

export default HomeDetailDisplay;
