import React from "react";
import firebase from "../../firebase";

import NavBar from "../common/NavBar";
import Footer from "../common/Footer";
import ChartDisplay from "./ChartDisplay";

function CoinDetailTab(props) {
  const removeFromWatchlist = () => {
    let pf = props.userDB.portfolio;
    let noBuys =
      (pf[ticker] === undefined || pf[ticker]).buys === undefined ||
      pf[ticker].buys;
    let noSells =
      (pf[ticker] === undefined || pf[ticker]).sells === undefined ||
      pf[ticker].sells;
    if (
      Object.keys(noBuys).length === 0 &&
      Object.keys(noSells).length === 0 &&
      Object.keys(props.userDB.watchlist).includes(ticker.toLowerCase()) &&
      props.user
    ) {
      // remove from watchlist
      let db = firebase.firestore();
      let docRef = db.collection("CoinData").doc(`${props.user.uid}`);
      let watchlistRemoval = `watchlist.${ticker}`;
      docRef
        .update({
          [watchlistRemoval]: firebase.firestore.FieldValue.delete(),
        })
        .then(() => {
          alert(`removed ${ticker} from watchlist`);
          props.getUserDB();
        });
    } else {
      if (Object.keys(noBuys).length > 0 || Object.keys(noSells).length > 0) {
        alert(`Please delete your ${ticker} transactions before unwatching`);
      } else alert("This coin is not on your watchlist");
    }
  };

  let ticker = props.match.params.ticker;
  if (
    Object.keys(props.portfolio).length > 0 &&
    Object.keys(props.portfolio).includes(ticker)
  ) {
    var value = props.portfolio[ticker].valueHoldings;
    var holdings = props.portfolio[ticker].sumHoldings;
    var cost = props.portfolio[ticker].costBasis * holdings;
    var PnL = value - cost;
    var change = (PnL / value) * 100;
  }
  return (
    <div className="container">
      <NavBar history={props.history} />
      <br />
      <div className="title is-4 mb-0 has-text-centered">
        {ticker.toUpperCase()} Price Chart
      </div>
      <ChartDisplay ticker={ticker} priceData={props.priceData} />
      <br />
      <br />
      <h4 className="title is-4 has-text-centered">
        {ticker.toUpperCase()} Holdings
      </h4>
      <br />
      <div className="columns is-mobile mb-5">
        <div className="column has-text-centered">
          Market Value
          <div>
            $ {value !== undefined ? value.toLocaleString() : undefined}
          </div>
          <br />
          <div>Holdings</div>
          <div>
            {holdings !== undefined ? holdings.toLocaleString() : undefined}
          </div>
        </div>
        <div className="column has-text-centered">
          P/L
          <div>$ {PnL !== undefined ? PnL.toLocaleString() : undefined}</div>
          <br />
          <div>% Change</div>
          <div>
            {change !== undefined ? change.toLocaleString() : undefined}%
          </div>
        </div>
      </div>
      <div style={{ textAlign: "center" }}>
        <button
          className="button is-info is-outlined"
          onClick={() => removeFromWatchlist(ticker)}
        >
          Unwatch
        </button>
        &emsp;
        <button
          className="button is-info is-outlined"
          onClick={() => props.history.push(`/edit/${ticker}`)}
        >
          Edit transactions
        </button>
      </div>
      <Footer />
    </div>
  );
}

export default CoinDetailTab;
