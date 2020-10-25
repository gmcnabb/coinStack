import React, { useState, useEffect } from "react";
import firebase from "../../firebase";
import InfiniteScroll from "react-infinite-scroll-component";

import AddCoinListItem from "./AddCoinListItem";

function AddCoinListDisplay(props) {
  const [pageNum, setPageNum] = useState(1);
  const [coinList, setCoinList] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const fetchMoreData = () => {
    const COINGECKO_MARKET_GET = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=${pageNum}&sparkline=false&price_change_percentage=24h`;
    if (coinList.length >= 5000) {
      setHasMore(false);
      return;
    }
    fetch(COINGECKO_MARKET_GET)
      .then((res) => res.json())
      .then((data) => parseData(data))
      .catch((err) => {
        console.log(err);
      });
    const parseData = (data) => {
      let myArr = [];
      data.forEach((item) => {
        myArr.push({ name: `${item.id}`, ticker: `${item.symbol}` });
      });
      setCoinList([].concat(coinList, myArr));
      setPageNum(pageNum + 1);
    };
  };
  const handleSave = (ticker) => {
    if (!props.user) {
      alert("Please log in");
    }
    // if user DB is blank, save
    if (Object.keys(props.userDB).length === 0) {
      let db = firebase.firestore();
      let docRef = db.collection("CoinData");
      let entry = { watchlist: { [ticker]: "" }, portfolio: {} };
      docRef
        .doc(`${props.user.uid}`)
        .set(entry)
        .then(() => {
          alert(`added ${ticker} to watchlist`);
          props.getUserDB();
        });
    }
    // otherwise check if user DB has coin already before saving
    else if (
      Object.keys(props.userDB.watchlist).includes(ticker.toLowerCase())
    ) {
      alert("This coin is already on your watchlist");
    } else {
      let db = firebase.firestore();
      let docRef = db.collection("CoinData").doc(`${props.user.uid}`);
      let watchlistAddition = `watchlist.${ticker}`;
      docRef.update({ [watchlistAddition]: "" }).then(() => {
        alert(`added ${ticker} to watchlist`);
        props.getUserDB();
      });
    }
  };

  useEffect(fetchMoreData, []);

  return (
    <InfiniteScroll
      dataLength={coinList.length}
      next={fetchMoreData}
      hasMore={hasMore}
      loader={<div className="title is-5">loading...</div>}
      scrollThreshold={1}
      height={500}
      endMessage={
        <p style={{ textAlign: "center" }}>End of top 5,000 coins reached.</p>
      }
    >
      {coinList.map((i, index) => (
        <AddCoinListItem
          key={i.name}
          ticker={coinList[index].ticker}
          name={coinList[index].name}
          checktest={() => handleSave(coinList[index].ticker)}
          getUserDB={() => props.getUserDB()}
        />
      ))}
    </InfiniteScroll>
  );
}

export default AddCoinListDisplay;
