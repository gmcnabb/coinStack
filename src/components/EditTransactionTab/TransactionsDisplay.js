import React from "react";
import TransactionListItem from "./TransactionListItem";

function TransactionsDisplay(props) {
  if (Object.keys(props.userDB).length > 0) {
    if (props.type === "buys") {
      try {
        let buys = props.userDB.portfolio[props.ticker].buys;
        let buyKeysUnordered = Object.keys(buys);
        let buyKeys = buyKeysUnordered.sort((a, b) =>
          a.localeCompare(b, { numeric: true, sensitivity: "base" })
        );
        if (buyKeys.length === 0) {
          return (
            <div className="box mt-2 mb-2 is-vcentered">
              (no previous transactions found)
            </div>
          );
        } else
          return buyKeys.map((buy) => (
            <TransactionListItem
              key={buy}
              type="buy"
              date={buy}
              ticker={props.ticker}
              price={buys[buy].price}
              quantity={buys[buy].quantity}
              handleDeleteTransaction={props.handleDeleteTransaction}
            />
          ));
      } catch (err) {
        return (
          <div className="box mt-2 mb-2 is-vcentered">
            (no previous transactions found)
          </div>
        );
      }
    }
    if (props.type === "sells") {
      try {
        let sells = props.userDB.portfolio[props.ticker].sells;
        let sellKeysUnordered = Object.keys(sells);
        let sellKeys = sellKeysUnordered.sort((a, b) =>
          a.localeCompare(b, { numeric: true, sensitivity: "base" })
        );
        if (sellKeys.length === 0) {
          return (
            <div className="box mt-2 mb-2 is-vcentered">
              (no previous transactions found)
            </div>
          );
        } else
          return sellKeys.map((sell) => (
            <TransactionListItem
              key={sell}
              type="sell"
              date={sell}
              ticker={props.ticker}
              price={sells[sell].price}
              quantity={sells[sell].quantity}
              handleDeleteTransaction={props.handleDeleteTransaction}
            />
          ));
      } catch (err) {
        return (
          <div className="box mt-2 mb-2 is-vcentered">
            (no previous transactions found)
          </div>
        );
      }
    }
  } else return <div></div>;
}

export default TransactionsDisplay;
