import React from "react";

function TrendsDisplay(props) {
  let list = props.trendList === undefined ? [] : props.trendList;
  if (list.length > 0) {
    return list.map((item, index) => (
      <div
        className="box mb-2"
        style={{
          background: "linear-gradient( to top right, #323232, #4b4b4b",
          padding: 7,
        }}
        key={item.id}
        // onClick={() => props.history.push(`/coindetail/${item.symbol}`)}
      >
        <div className="columns is-gapless is-mobile  is-vcentered pr-4">
          <div className="column">
            <div className="button is-text" style={{ cursor: "default" }}>
              <img
                className=""
                alt={`${item.id} logo`}
                src={`${item.picURL}`}
                style={{ height: 46, width: 46 }}
              />
              &emsp;{`# ${index + 1}`}
            </div>
          </div>
          <div className="column has-text-centered">{`${item.id}`}</div>
          <div className="column has-text-right">{`${item.symbol}`}</div>
        </div>
      </div>
    ));
  } else return null;
}

export default TrendsDisplay;
