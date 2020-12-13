import React, { useState, useEffect } from "react";
import firebase, { FIREBASE_CONFIG } from "../firebase";
import { BrowserRouter, Route } from "react-router-dom";

import HomeTab from "../components/PortfolioTab/PortfolioTab";
import SignInTab from "../components/SignInTab/SignInTab";
import MarketsTab from "../components/MarketsTab/MarketsTab";
import AddCoinTab from "../components/AddCoinTab/AddCoinTab";
import CoinDetailTab from "../components/CoinDetailTab/CoinDetailTab";
import AddTransactionTab from "../components/EditTransactionTab/EditTransactionTab";
import Trends from "../components/TrendsTab/TrendsTab";
import masterCoinObj from "../masterCoinList";

const COINGECKO_MARKET_GET =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false&price_change_percentage=24h";

function App() {
  const [priceData, setPriceData] = useState({});
  const [user, setUser] = useState(null);
  const [userDB, setUserDB] = useState({});
  const [portfolio, setPortfolio] = useState({});

  const setAuthListener = () => {
    // updates user state when firebase auth user changes.
    firebase.auth().onAuthStateChanged((user) => {
      setUser(user);
    });
  };
  const initFirebase = () => {
    // init firebase if not already done.
    if (!firebase.apps.length) {
      firebase.initializeApp(FIREBASE_CONFIG);
    }
  };
  const logUserIn = () => {
    // Log user in with firebase auth if url string contains log-in params.
    // First check if URL loaded contains log-in query string parameter.
    if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
      // Get the email if available. This should be available if the user completes
      // the flow on the same device where they started it.
      var email = window.localStorage.getItem("emailForSignIn");
      if (!email) {
        // User opened the link on a different device. To prevent session fixation
        // attacks, ask the user to provide the associated email again. For example:
        email = window.prompt(
          "Please provide your email for confirmation at the log in page"
        );
      }
      // if user doesn't enter any email, return the page without logging in
      if (!email) {
        return;
      }
      // The client SDK will parse the code from the link for you.
      firebase
        .auth()
        .signInWithEmailLink(email, window.location.href)
        .then(function (result) {
          // Clear email from storage.
          window.localStorage.removeItem("emailForSignIn");
          // You can access the new user via result.user
          // console.log(result.user);

          // Additional user info profile not available via:
          // result.additionalUserInfo.profile == null
          // You can check if the user is new or existing:
          // result.additionalUserInfo.isNewUser
        })
        .catch(function (error) {
          // Some error occurred, you can inspect the code: error.code
          // Common errors could be invalid email and invalid or expired OTPs.
        });
    }
  };
  const getUserDB = () => {
    // if user logged in get and set userDB to state.
    if (user) {
      let db = firebase.firestore();
      let docRef = db.collection("CoinData").doc(`${user.uid}`);
      docRef.get().then((doc) => {
        // if user has no data in DB yet
        if (doc.data() === undefined) {
          setUserDB({});
        } else {
          // otherwise set response to state
          setUserDB(doc.data());
        }
      });
    } else {
      // if no user logged in, set userDB to empty object.
      setUserDB({});
    }
  };
  const getPriceData = async () => {
    // set state with current market data of top 250 coins
    fetch(COINGECKO_MARKET_GET)
      .then((res) => res.json())
      .then((data) => {
        setPriceData(parsePriceData(data));
      })
      .catch((err) => console.log(err));

    const parsePriceData = (data) => {
      let myObj = {};
      data.forEach((item) => {
        myObj[item.symbol.toLowerCase()] = {
          name: `${item.id}`,
          ticker: `${item.symbol.toLowerCase()}`,
          price: `${item.current_price}`,
          changePercent: `${item.price_change_percentage_24h_in_currency}`,
          changeFiat: `${item.price_change_24h}`,
          marketCap: `${item.market_cap}`,
        };
      });
      return myObj;
    };
  };
  const getMissingCoinData = async () => {
    // find all tickers that aren't present in priceData.
    let missingTickers = [];
    let idString = [];
    Object.keys(userDB.watchlist).forEach((ticker) => {
      if (!Object.keys(priceData).includes(ticker)) {
        missingTickers.push(ticker);
        let ID =
          masterCoinObj[ticker] === undefined
            ? masterCoinObj[`"${ticker}"`]
            : masterCoinObj[ticker];
        idString += ID + ", ";
      }
    });

    // get priceData for any missing tickers.
    if (idString.length > 0) {
      let promise = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${idString}&order=id_asc&per_page=250&page=1&sparkline=false&price_change_percentage=24h`
      )
        .then((res) => res.json())
        .then((data) => {
          return data;
        });
      return promise;
    }
  };
  const addPriceData = (newPriceData, oldPriceData) => {
    newPriceData.forEach((item) => {
      oldPriceData[item.symbol] = {
        changeFiat:
          item.price_change_24h === null ? 0 : item.price_change_24h.toString(),
        changePercent:
          item.price_change_percentage_24h_in_currency === null
            ? 0
            : item.price_change_percentage_24h_in_currency.toString(),
        marketCap: item.market_cap.toString(),
        name: item.name,
        price: item.current_price.toString(),
        ticker: item.symbol.toLowerCase(),
      };
    });
    return oldPriceData;
  };
  const doPortfolioCalculations = (priceData) => {
    let tickers = Object.keys(userDB.portfolio);
    let portfolioStatus = {};

    tickers.forEach((ticker) => {
      let quantityBought = 0;
      let quantitySold = 0;
      let sumOfCosts = 0;
      let sumOfProceeds = 0;

      // if coin isn't in watchlist or has no transactions, skip
      if (
        !Object.keys(userDB.watchlist).includes(ticker) ||
        (userDB.portfolio[ticker].buys === undefined &&
          userDB.portfolio[ticker].sells === undefined)
      ) {
        return;
      }

      // if there are transactions for the ticker, do calculations
      if (Object.entries(userDB.portfolio[ticker]).length > 0) {
        let buysList =
          userDB.portfolio[ticker].buys === undefined
            ? []
            : Object.keys(userDB.portfolio[ticker].buys);
        let sellsList =
          userDB.portfolio[ticker].sells === undefined
            ? []
            : Object.keys(userDB.portfolio[ticker].sells);

        // calculate sum of buys
        buysList.forEach((entry) => {
          sumOfCosts +=
            userDB.portfolio[ticker].buys[entry].quantity *
            userDB.portfolio[ticker].buys[entry].price;
          quantityBought += userDB.portfolio[ticker].buys[entry].quantity;
        });

        // calculate sum of sells
        sellsList.forEach((entry) => {
          sumOfProceeds +=
            userDB.portfolio[ticker].sells[entry].quantity *
            userDB.portfolio[ticker].sells[entry].price;
          quantitySold += userDB.portfolio[ticker].sells[entry].quantity;
        });

        // finish portfolio calculations.
        let totalHoldings = quantityBought - quantitySold;
        let netCost = sumOfCosts - sumOfProceeds;
        let avgNetCost = totalHoldings > 0 ? netCost / totalHoldings : 0;
        let marketValueHoldings = parseFloat(
          parseFloat(priceData[ticker].price * totalHoldings).toFixed(2)
        );
        let PnL = parseFloat(
          (marketValueHoldings + sumOfProceeds - sumOfCosts).toFixed(2)
        );
        let percentChange =
          totalHoldings > 0
            ? parseFloat(((PnL / netCost) * 100).toFixed(2))
            : 0;

        // add the calculated values for this ticker to the portfolioStatus object.
        portfolioStatus[ticker] = {
          sumHoldings: totalHoldings,
          valueHoldings: marketValueHoldings,
          percentChange: percentChange,
          fiatChange: PnL,
          costBasis: avgNetCost,
        };
      }
    });
    return portfolioStatus;
  };
  const generatePortfolio = async () => {
    // if have some user data, generate portfolio
    if (!Object.keys(userDB).length > 0 || !Object.keys(priceData).length > 0) {
      return;
    }
    // if all coins in userDB are present in priceData, do portfolio calculations.
    let keys = Object.keys(userDB.watchlist);
    if (keys.every((key) => Object.keys(priceData).includes(key))) {
      setPortfolio(doPortfolioCalculations(priceData));
    } else {
      // else get price data for all missing coins (if available) before doing portfolio calculations.
      let missingCoinData = await getMissingCoinData();
      let priceDataCopy = JSON.parse(JSON.stringify(priceData));
      priceDataCopy = addPriceData(missingCoinData, priceDataCopy);
      setPriceData(priceDataCopy);
      setPortfolio(doPortfolioCalculations(priceDataCopy));
    }
  };
  const asyncWrap = () => {
    generatePortfolio();
  };
  // when component mounts / unmounts, initialize.
  useEffect(() => {
    initFirebase(); // initalize firebase.
    setAuthListener(); // set onAuthStateChanged listener in firebase.
    logUserIn(); // if url is a magic login link, log user in.
    getPriceData(); // get current market data of top 250 coins.
  }, []);
  // when user is updated, get user DB.
  useEffect(getUserDB, [user]);
  // when userDB is updated, generate portolio.
  useEffect(asyncWrap, [userDB]);

  return (
    <div>
      <BrowserRouter>
        <Route
          path="/"
          exact
          render={(props) => <SignInTab user={user} history={props.history} />}
        />
        <Route
          path="/home"
          exact
          render={(props) => (
            <HomeTab
              priceData={priceData}
              user={user}
              userDB={userDB}
              portfolio={portfolio}
              history={props.history}
            />
          )}
        ></Route>
        <Route
          path="/coindetail/:ticker"
          exact
          render={(props) => (
            <CoinDetailTab
              match={props.match}
              history={props.history}
              user={user}
              userDB={userDB}
              getUserDB={getUserDB}
              priceData={priceData}
              portfolio={portfolio}
            />
          )}
        ></Route>
        <Route
          path="/edit/:ticker"
          exact
          render={(props) => (
            <AddTransactionTab
              match={props.match}
              user={user}
              userDB={userDB}
              getUserDB={getUserDB}
            />
          )}
        />
        <Route
          path="/addcoin"
          exact
          render={(props) => (
            <AddCoinTab
              history={props.history}
              priceData={priceData}
              userDB={userDB}
              user={user}
              getUserDB={getUserDB}
              masterCoinList={masterCoinObj}
            />
          )}
        />
        <Route
          path="/markets"
          exact
          render={(props) => (
            <MarketsTab priceData={priceData} history={props.history} />
          )}
        />
        <Route
          path="/trends"
          exact
          render={(props) => <Trends history={props.history} />}
        ></Route>
      </BrowserRouter>
    </div>
  );
}

export default App;
