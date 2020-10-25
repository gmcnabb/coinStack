import React from "react";

function PortfolioListItem(props) {
  const cullExtraDigits = (num) => {
    // return num if value not < 1
    if (num < 1) {
      // start at first decimal place
      let i = 2;
      let significantDigits = 0;
      // iterate through num.
      // return only first two significant decimal digits.
      while (i < num.length) {
        // eslint-disable-next-line
        if (num[i] != 0) {
          significantDigits++;
          if (significantDigits === 2) {
            return num.slice(0, i + 1);
          }
        }
        i++;
      }
      return num;
    } else return num;
  };

  return (
    <div className="columns is-gapless is-vcentered is-mobile">
      <div className="column">
        {props.name.charAt(0).toUpperCase() + props.name.slice(1)} &emsp;
        {props.ticker.toUpperCase()}
      </div>
      <div className="column has-text-centered">
        {"$ " + cullExtraDigits(props.price)}
        &emsp;
      </div>
      <div className="column has-text-right is-vcentered">
        {props.valueHoldings === "" || props.valueHoldings === 0 ? (
          <button
            className="button is-info is-rounded px-5 is-small"
            onClick={(e) => {
              e.stopPropagation();
              props.history.push(`/edit/${props.ticker}`);
            }}
          >
            Add
          </button>
        ) : (
          "$ " + props.valueHoldings.toLocaleString()
        )}
      </div>
    </div>
  );
}

export default PortfolioListItem;
