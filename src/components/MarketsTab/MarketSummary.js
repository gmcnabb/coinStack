import React from "react";

function MarketSummary(props) {
  return (
    <div
      className="box mb-5 py-3"
      style={{
        background: "linear-gradient( to top right, #323232, #4b4b4b",
      }}
    >
      <div className="columns is-gapless is-mobile">
        <div className="column">
          <strong>Market Cap</strong>
          <div>{`$ ${props.globalMarketData.market_cap}`}</div>
        </div>
        <div className="column has-text-centered">
          <strong>24HR Vol</strong>
          <div>{`$ ${props.globalMarketData.vol}`}</div>
        </div>
        <div className="column has-text-right">
          <strong>BTC Dominance</strong>
          <div>{`${props.globalMarketData.btc_dom} %`}</div>
        </div>
      </div>
    </div>
  );
}

export default MarketSummary;
