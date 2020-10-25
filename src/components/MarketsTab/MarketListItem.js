import React from "react";

function MarketListItem(props) {
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
      <div
        className="button is-info is-outlined is-rounded is-fullwidth"
        onClick={props.click}
      >
        <div
          className="column has-text-centered"
          style={{ textOverflow: "ellipsis", overflowX: "hidden" }}
        >
          {props.name.charAt(0).toUpperCase() + props.name.slice(1)}
          &emsp;
          {props.ticker.toUpperCase()}
        </div>
        <div className="column has-text-centered">{`$ ${cullExtraDigits(
          props.price
        )}`}</div>
        <div className="column has-text-centered">{`$ ${props.marketCap}`}</div>
      </div>
    </div>
  );
}

export default MarketListItem;
