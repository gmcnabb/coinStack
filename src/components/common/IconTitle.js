import React from "react";

function IconTitle(props) {
  const content = {
    addCoin: (
      <div className="has-text-centered">
        <div className="button is-text" style={{ cursor: "default" }}>
          <span className="icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <path
                d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
                fill="#fff"
              />
            </svg>
          </span>
          <div className="title is-4 has-text-centered">
            <strong>&thinsp;Add Coin</strong>
          </div>
        </div>
      </div>
    ),
    markets: (
      <div className="has-text-centered">
        <div className="button is-text" style={{ cursor: "default" }}>
          <span className="icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <path
                d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"
                fill="#fff"
              />
            </svg>
          </span>
          <div className="title is-4 has-text-centered">
            <strong>&thinsp;Markets</strong>
          </div>
        </div>
      </div>
    ),
    portfolio: (
      <div className="has-text-centered">
        <div className="button is-text" style={{ cursor: "default" }}>
          <span className="icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <path
                d="M11 17h2v-1h1c.55 0 1-.45 1-1v-3c0-.55-.45-1-1-1h-3v-1h4V8h-2V7h-2v1h-1c-.55 0-1 .45-1 1v3c0 .55.45 1 1 1h3v1H9v2h2v1zm9-13H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4V6h16v12z"
                fill="#fff"
              />
            </svg>
          </span>
          <div className="title is-4 has-text-centered">
            <strong>&thinsp;Portfolio</strong>
          </div>
        </div>
      </div>
    ),
    trends: (
      <div className="has-text-centered">
        <div className="button is-text" style={{ cursor: "default" }}>
          <span className="icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <g>
                <rect fill="none" height="24" width="24" y="0" />
              </g>
              <g>
                <path
                  d="M19.48,12.35c-1.57-4.08-7.16-4.3-5.81-10.23c0.1-0.44-0.37-0.78-0.75-0.55C9.29,3.71,6.68,8,8.87,13.62 c0.18,0.46-0.36,0.89-0.75,0.59c-1.81-1.37-2-3.34-1.84-4.75c0.06-0.52-0.62-0.77-0.91-0.34C4.69,10.16,4,11.84,4,14.37 c0.38,5.6,5.11,7.32,6.81,7.54c2.43,0.31,5.06-0.14,6.95-1.87C19.84,18.11,20.6,15.03,19.48,12.35z M10.2,17.38 c1.44-0.35,2.18-1.39,2.38-2.31c0.33-1.43-0.96-2.83-0.09-5.09c0.33,1.87,3.27,3.04,3.27,5.08C15.84,17.59,13.1,19.76,10.2,17.38z"
                  fill="#fff"
                />
              </g>
            </svg>
          </span>
          <div className="title is-4 has-text-centered">
            <strong>&thinsp;Trends</strong>
          </div>
        </div>
      </div>
    ),
  };

  if (props.page === "portfolio") {
    return <div>{content.portfolio}</div>;
  }
  if (props.page === "addCoin") {
    return <div>{content.addCoin}</div>;
  }
  if (props.page === "markets") {
    return <div>{content.markets}</div>;
  }
  if (props.page === "trends") {
    return <div>{content.trends}</div>;
  }
  return <div></div>;
}

export default IconTitle;
