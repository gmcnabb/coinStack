import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import MarketListItem from "./MarketListItem";

function MarketListDisplay(props) {
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
      .catch((err) => console.log(err));
    const parseData = (data) => {
      let myArr = [];
      data.forEach((item) => {
        myArr.push({
          name: `${item.id}`,
          ticker: `${item.symbol}`,
          price: `${item.current_price}`,
          marketCap: `${formatLrgNum(item.market_cap)}`,
        });
      });
      setCoinList([].concat(coinList, myArr));
      setPageNum(pageNum + 1);
    };
  };
  const formatLrgNum = (num) => {
    let n = parseInt(num);
    if (parseInt(n) < 1e3) return n;
    if (parseInt(n) >= 1e3 && n < 1e6) return (n / 1e3).toFixed(1) + " K";
    if (parseInt(n) >= 1e6 && n < 1e9) return (n / 1e6).toFixed(1) + " M";
    if (parseInt(n) >= 1e9 && n < 1e12) return (n / 1e9).toFixed(1) + " B";
    if (parseInt(n) >= 1e12 && n < 1e15) return (n / 1e12).toFixed(1) + " T";
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
        <div key={i.name}>
          <MarketListItem
            ticker={coinList[index].ticker}
            price={coinList[index].price}
            name={coinList[index].name}
            marketCap={coinList[index].marketCap}
            click={() =>
              props.history.push(`/coindetail/${coinList[index].ticker}`)
            }
            getUserDB={() => props.userDB()}
          />
        </div>
      ))}
    </InfiniteScroll>
  );
}

export default MarketListDisplay;
