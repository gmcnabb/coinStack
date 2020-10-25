import React, { useState, useEffect } from "react";
import Chart from "react-google-charts";

function ChartDisplay(props) {
  const chartEvents = [
    {
      eventName: "ready",
      callback({ candlestick }) {
        const chartElement = document.getElementById("chart-div");
        if (chartElement !== null) {
          const fallingCandles = chartElement.querySelectorAll(
            'rect[stroke="#008000"]'
          );
          fallingCandles.forEach((item) => {
            item.previousSibling.setAttribute("fill", "#008000");
          });
          const risingCandles = chartElement.querySelectorAll(
            'rect[stroke="#ff0000"]'
          );
          risingCandles.forEach((item) => {
            item.previousSibling.setAttribute("fill", "#ff0000");
          });
        }
      },
    },
    {
      eventName: "error",
      callback({ candlestick }) {
        console.log("chart error event");
        let chartElement = document.getElementById("reactgooglegraph-1");
        if (chartElement !== null) {
          chartElement.innerHTML =
            "Candlestick chart data not available for this asset..";
        }
      },
    },
  ];
  const options = {
    legend: "none",
    backgroundColor: "#272727",
    fontSize: 16,
    candlestick: {
      fallingColor: {
        fill: "red",
        stroke: "red",
      },
      risingColor: {
        fill: "green",
        stroke: "green",
      },
    },
    vAxis: {
      title: "US Dollars",
      titleTextStyle: { color: "#bababa", fontName: "Ubuntu Mono" },
      textStyle: { color: "#bababa", fontName: "Ubuntu Mono" },
      gridlines: { color: "#bababa" },
    },
    hAxis: {
      title: "Date",
      format: "dd/MM/YY",
      titleTextStyle: { color: "#bababa", fontName: "Ubuntu Mono" },
      textStyle: { color: "#bababa", fontName: "Ubuntu Mono" },
      gridlines: { color: "#bababa" },
    },
  };

  const [chartData, setChartData] = useState([]);
  const [timeframe, setTimeframe] = useState(365);
  const [needsUpdate, setNeedsUpdate] = useState(true);

  const getChartData = (symbol) => {
    let coingecko_ohlc_get = `https://api.coingecko.com/api/v3/coins/${symbol.toLowerCase()}/ohlc?vs_currency=usd&days=${timeframe}`;
    fetch(coingecko_ohlc_get)
      .then((res) => res.json())
      .then((data) => {
        try {
          parseData(data);
        } catch (err) {}
      });
    const parseData = (data) => {
      let tempChartData = [["time", "a", "b", "c", "d"]];
      data.forEach((item) => {
        let date = new Date(item[0]);
        let o = item[1];
        let h = item[2];
        let l = item[3];
        let c = item[4];
        tempChartData.push([date, l, o, c, h]);
      });
      setChartData(tempChartData);
      setNeedsUpdate(false);
    };
  };

  useEffect(() => {
    if (
      Object.keys(props.priceData).length > 0 &&
      Object.keys(chartData).length === 0
    ) {
      try {
        getChartData(props.priceData[props.ticker].name);
      } catch (err) {}
    }
  });
  useEffect(() => {
    if (Object.keys(props.priceData).length > 0 && needsUpdate === true) {
      try {
        getChartData(props.priceData[props.ticker].name);
      } catch (err) {}
    }
  });

  return (
    <div>
      {timeframe > 30 ? (
        <p style={{ textAlign: "center" }}>4-Day candles</p>
      ) : (
        <p style={{ textAlign: "center" }}>4-Hour candles</p>
      )}
      {Object.keys(chartData).length > 0 ? (
        <div id="chart-div" style={{ height: 300 }}>
          <Chart
            width="100%"
            height={300}
            chartType="CandlestickChart"
            loader={
              <div>
                <h1>LOADING...</h1>
              </div>
            }
            data={chartData}
            chartEvents={chartEvents}
            options={options}
          />
        </div>
      ) : (
        <div style={{ height: 300 }}>
          Candlestick data not available for this asset...
        </div>
      )}
      <div className="box has-text-centered is-transparent">
        <div
          className="button is-small is-primary is-outlined"
          onClick={() => {
            setTimeframe(365);
            setNeedsUpdate(true);
          }}
        >
          1 Year
        </div>
        &emsp;
        <div
          className="button is-small is-primary is-outlined"
          onClick={() => {
            setTimeframe(90);
            setNeedsUpdate(true);
          }}
        >
          3 Months
        </div>
        &emsp;
        <div
          className="button is-small is-primary is-outlined"
          onClick={() => {
            setTimeframe(30);
            setNeedsUpdate(true);
          }}
        >
          1 Month
        </div>
        &emsp;
        <div
          className="button is-small is-primary is-outlined"
          onClick={() => {
            setTimeframe(7);
            setNeedsUpdate(true);
          }}
        >
          1 Week
        </div>
        &emsp;
      </div>
    </div>
  );
}

export default ChartDisplay;
