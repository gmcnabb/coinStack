import React from "react";

function CoinListItem(props) {
  return (
    <div className="columns is-gapless is-mobile mb-0">
      <div
        className="button is-info is-outlined is-rounded is-fullwidth"
        onClick={() => props.checktest()}
      >
        <div
          className="column has-text-centered"
          style={{ textOverflow: "ellipsis", overflowX: "hidden" }}
        >
          {props.name.charAt(0).toUpperCase() + props.name.slice(1)}
          &emsp;
          {props.ticker.toUpperCase()}
        </div>
      </div>
    </div>
  );
}

export default CoinListItem;
