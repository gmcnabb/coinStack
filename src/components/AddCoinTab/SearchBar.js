import React, { useState, useEffect } from "react";
import firebase from "../../firebase";

import SearchResult from "./SearchResult";
import masterCoinObj from "../../masterCoinList";

function SearchBar(props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);

  const handleInputChange = (term) => {
    setSearchTerm(term);
  };
  const checkMasterList = () => {
    let term = searchTerm;
    if (term.length > 2) {
      let pairs = [];
      // get matches to keys in masterList dictionary
      Object.keys(masterCoinObj).forEach((key) => {
        // if term matches key, get value and push object to pairs array
        if (key.slice(0, term.length) === term) {
          let name = masterCoinObj[key];
          pairs.push({ [key]: [name] });
        }
      });
      Object.values(masterCoinObj).forEach((value, index) => {
        // if term matches value, get ticker
        if (value.slice(0, term.length) === term) {
          let ticker = Object.keys(masterCoinObj)[index];
          // check stringified array to see if object with same values already exists
          let pairsJSON = JSON.stringify(pairs);
          if (!pairsJSON.includes(JSON.stringify({ [ticker]: [value] }))) {
            // if not already exist, add to pairs array
            pairs.push({ [ticker]: [value] });
          }
        }
      });
      // put exact match first in search results and set to state
      pairs = exactMatchesFirst(term, pairs);
      setResults(pairs);
    }
  };
  const exactMatchesFirst = (term, pairs) => {
    pairs.forEach((pair, index) => {
      // if search term matches a result key exactly, remove object and prepend it
      if (Object.keys(pair)[0] === term) {
        let match = pairs.splice(index, 1);
        let ticker = Object.keys(match[0])[0];
        let name = Object.values(match[0])[0];
        pairs.unshift({ [ticker]: [name] });
      }
      // if search term matches a result value exactly, remove object and prepend it
      let valueArray = Object.values(pair)[0];
      if (valueArray[0] === term) {
        let match = pairs.splice(index, 1);
        let ticker = Object.keys(match[0])[0];
        let name = Object.values(match[0])[0];
        pairs.unshift({ [ticker]: [name] });
      }
    });
    return pairs;
  };
  const saveToWatchlist = (index) => {
    let ticker = Object.keys(results[index])[0];
    let name = Object.values(results[index])[0];
    // if coin not already in watchlist, add it
    if (Object.keys(props.userDB.watchlist).includes(ticker.toLowerCase())) {
      alert("This coin is already on your watchlist");
    } else {
      // validity check. if valid, add to watchlist, else tell user
      const COINGECKO_VALID = `https://api.coingecko.com/api/v3/coins/${name}?localization=false&tickers=false&market_data=false&community_data=false&developer_data=false&sparkline=false`;
      fetch(COINGECKO_VALID).then((res) => {
        // if valid return true, else false
        if (res.ok && props.user) {
          // if (props.user) {
          let db = firebase.firestore();
          let docRef = db.collection("CoinData").doc(`${props.user.uid}`);
          let watchlistAddition = `watchlist.${ticker}`;
          docRef.update({ [watchlistAddition]: "" }).then(() => {
            setSearchTerm("");
            alert(`added ${ticker} to watchlist`);
            props.getUserDB();
          });
          // }
        } else {
          alert(
            "Sorry, this coin's data is no longer available from CoinGecko. The search results will be updated to reflect this soon."
          );
        }
      });
    }
  };

  useEffect(checkMasterList, [searchTerm]);

  return (
    <div
      className="box mb-5 py-3 has-text-centered"
      style={{
        background: "linear-gradient( to top right, #323232, #4b4b4b",
      }}
    >
      <div
        className={searchTerm.length > 2 ? "dropdown is-active" : "dropdown"}
      >
        <div className="dropdown-trigger">
          <div className="field">
            <p className="control">
              <input
                className="input is-primary"
                type="search"
                placeholder="Search for a coin..."
                onChange={(e) => handleInputChange(e.target.value)}
              />
            </p>
          </div>
        </div>
        <div
          className="dropdown-menu"
          id="dropdown-menu"
          role="menu"
          style={{ maxHeight: 350, overflowY: "auto" }}
        >
          {results.map((result, index) => (
            <div key={index}>
              <SearchResult
                results={results}
                ind={index}
                click={() => saveToWatchlist(index)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
