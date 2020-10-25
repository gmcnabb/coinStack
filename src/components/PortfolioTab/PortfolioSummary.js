import React from "react";

function PortfolioSummary(props) {
  const calculateTotals = (desiredValue) => {
    // only run if api calls to retrieve props data have resolved
    if (Object.keys(props.portfolio).length > 0) {
      let totalValue = 0;
      let totalChange = 0;
      let tickers = Object.keys(props.portfolio);
      tickers.forEach((ticker) => {
        totalValue += props.portfolio[ticker].valueHoldings;
        totalChange += props.portfolio[ticker].fiatChange;
      });
      if (desiredValue === "Value") {
        return "$ " + totalValue.toLocaleString();
      }
      if (desiredValue === "Change" && totalChange > 0) {
        return (
          "+ " + parseFloat(((totalChange / totalValue) * 100).toFixed(2)) + "%"
        );
      }
      if (desiredValue === "Change" && totalChange < 0) {
        return parseFloat(((totalChange / totalValue) * 100).toFixed(2)) + "%";
      }
    }
  };

  return (
    <div
      className="box py-4 has-text-white"
      style={{
        background: "linear-gradient( to top right, #1b57a2, #52c4ff",
      }}
    >
      <div className="columns is-gapless is-mobile">
        <div className="column has-text-left">
          Portfolio Value:{"  "}
          <span style={{ whiteSpace: "nowrap" }}>
            {calculateTotals("Value")}
          </span>
        </div>
        <div className="column has-text-right">
          Profit/Loss:
          <span style={{ whiteSpace: "nowrap" }}>
            {"  "} {calculateTotals("Change")}
          </span>
        </div>
      </div>
    </div>
  );
}

export default PortfolioSummary;
