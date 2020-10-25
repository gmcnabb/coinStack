import React, { useState, useEffect } from "react";
import firebase from "../../firebase";
import TransactionsDisplay from "./TransactionsDisplay";

import NavBar from "../common/NavBar";

function AddTransactionTab(props) {
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [date, setDate] = useState(undefined);

  const ticker = props.match.params.ticker;

  const setTodaysDate = () => {
    const today = new Date();
    const thisDate =
      ((today.getMonth() + 1).toString().length > 1
        ? today.getMonth() + 1
        : "0" + (today.getMonth() + 1)) +
      "-" +
      (today.getDate().toString().length > 1
        ? today.getDate()
        : "0" + today.getDate()) +
      "-" +
      today.getFullYear();
    setDate(thisDate);
  };
  const validateSubmission = () => {
    const validDate = /(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.](20)\d\d/i;
    const validNum = /^[0-9]*\.?[0-9]*$/;
    if (
      isNaN(quantity.trim()) === true ||
      isNaN(price.trim()) === true ||
      validNum.test(quantity.trim()) === false ||
      validNum.test(price.trim()) === false ||
      validDate.test(date) === false ||
      price.length > 20 ||
      quantity.length > 20 ||
      price.length < 1 ||
      quantity.length < 1
    ) {
      return false;
    } else {
      setQuantity(quantity.trim());
      setPrice(price.trim());
      return true;
    }
  };
  const handleDeleteTransaction = (transaction) => {
    if (props.user && Object.keys(props.userDB).length > 0) {
      let db = firebase.firestore();
      let docRef = db.collection("CoinData").doc(`${props.user.uid}`);
      docRef
        .update({
          [transaction]: firebase.firestore.FieldValue.delete(),
        })
        .then(() => {
          // get updated db info
          props.getUserDB();
          alert(`removed transaction successfully`);
        });
    }
  };
  const addTransaction = (transaction, price, quantity) => {
    let db = firebase.firestore();
    let docRef = db.collection("CoinData").doc(`${props.user.uid}`);
    docRef
      .update({
        [transaction]: {
          price: parseFloat(price),
          quantity: parseFloat(quantity),
        },
      })
      .then(() => {
        alert("transaction added successfully!");
        props.getUserDB();
      });
  };
  const newTransactionTotals = (ticker, type) => {
    // calculate new average cost & total quantity
    let previousPrice = props.userDB.portfolio[ticker][type][date].price;
    let previousQuantity = props.userDB.portfolio[ticker][type][date].quantity;
    let newQuantity = previousQuantity + parseFloat(quantity);
    let a =
      previousPrice * previousQuantity +
      parseFloat(price) * parseFloat(quantity);
    let newCost = a / newQuantity;
    let totals = { [newCost]: newQuantity };
    return totals;
  };
  const handleSave = (ticker, transactionType) => {
    let db = props.userDB;
    let type = transactionType === "" ? "buys" : "sells";
    let portfolioAddition = `portfolio.${ticker}.${type}.${date}`;

    // check props
    if (!Object.keys(db).length > 0 || !props.user) {
      return;
    }

    // if portfolio doesn't yet include coin, add it.
    if (!Object.keys(db.portfolio).includes(ticker)) {
      addTransaction(portfolioAddition, price, quantity);
      return;
    }

    // if portfolio doesn't have any transactions of this type yet, add it.
    if (!Object.keys(db.portfolio[ticker]).includes(type)) {
      addTransaction(portfolioAddition, price, quantity);
      return;
    }

    // if none of this type on this date yet, add it.
    if (!Object.keys(db.portfolio[ticker][type]).includes(date)) {
      addTransaction(portfolioAddition, price, quantity);
      return;
    }

    // must have this type on this date already.
    // calculate new cost and quantity for this date, then update db.
    let newTotals = newTransactionTotals(ticker, type);
    let newPrice = parseInt(Object.keys(newTotals)[0]);
    let newCost = newTotals[newPrice];
    addTransaction(portfolioAddition, newPrice, newCost);
    return;
  };

  useEffect(setTodaysDate, []);

  return (
    <div className="container">
      <NavBar history={props.history} />
      <br />
      <h4 className="title is-4 has-text-centered">
        <strong>Edit {ticker.toUpperCase()} Transactions</strong>
      </h4>
      <div
        className="box has-text-centered"
        style={{ height: 250, overflowY: "scroll" }}
      >
        previous buys: <p />
        <TransactionsDisplay
          type="buys"
          user={props.user}
          userDB={props.userDB}
          ticker={props.match.params.ticker}
          handleDeleteTransaction={handleDeleteTransaction}
        />
        previous sells: <p />
        <TransactionsDisplay
          type="sells"
          user={props.user}
          userDB={props.userDB}
          ticker={props.match.params.ticker}
          handleDeleteTransaction={handleDeleteTransaction}
        />
      </div>
      <p />
      <div className="box has-text-centered">
        <div className="columns is-mobile">
          <div className="column has-text-right">
            <span
              style={{
                marginTop: 8,
                marginBottom: 8,
                display: "inline-block",
              }}
            >
              Quantity {ticker.toUpperCase()}:
            </span>
            <br />
            <span
              style={{
                marginTop: 8,
                marginBottom: 8,
                display: "inline-block",
              }}
            >
              Price Per Coin:
            </span>
            <br />
            <span
              style={{
                marginTop: 8,
                marginBottom: 8,
                display: "inline-block",
              }}
            >
              Date:
            </span>
            <br />
          </div>
          <div className="column has-text-left ">
            <form onSubmit={(e) => e.preventDefault()}>
              <input
                className="input is-primary"
                style={{ width: 160 }}
                type="text"
                placeholder={"omit commas"}
                value={quantity}
                onChange={(e) => {
                  setQuantity(e.target.value);
                }}
              ></input>
            </form>
            <form onSubmit={(e) => e.preventDefault()}>
              <input
                className="input is-primary"
                style={{ width: 160 }}
                type="text"
                placeholder={"omit dollar sign"}
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
                }}
              ></input>
            </form>
            <form onSubmit={(e) => e.preventDefault()}>
              <input
                className="input is-primary"
                style={{ width: 160 }}
                type="text"
                placeholder={"mm-dd-yyyy"}
                value={date || ""}
                onChange={(e) => {
                  setDate(e.target.value);
                }}
              ></input>
            </form>
          </div>
        </div>
        <br />
        <button
          className="button is-info is-outlined"
          style={{ margin: 10 }}
          onClick={() => {
            if (validateSubmission() === true) {
              handleSave(ticker, "");
            } else {
              alert("Please check input for proper format");
            }
          }}
        >
          Save Buy Transaction
        </button>
        <button
          className="button is-info is-outlined"
          style={{ margin: 10 }}
          onClick={() => {
            if (validateSubmission() === true) {
              handleSave(ticker, "-");
            } else {
              alert("Please check input for proper format");
            }
          }}
        >
          Save Sell Transaction
        </button>
      </div>
    </div>
  );
}

export default AddTransactionTab;
