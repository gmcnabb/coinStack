import React from "react";

function TransactionListItem(props) {
  return (
    <div className="box mt-2 mb-2 py-4 has-background-grey-darker">
      <div className="columns is-mobile">
        <div className="column">date: &nbsp;{props.date}</div>
        <div className="column">
          {"price: $" + props.price} &emsp;
          {"quantity: " + props.quantity}
        </div>
        <div style={{ padding: 5 }}>
          <button
            className="button is-info is-outlined"
            onClick={(e) => {
              e.preventDefault();
              props.handleDeleteTransaction(
                `portfolio.${props.ticker}.${props.type}s.${props.date}`
              );
            }}
          >
            <span className="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#b5b1ab"
                  d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z"
                />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default TransactionListItem;
