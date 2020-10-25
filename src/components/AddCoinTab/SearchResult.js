import React from "react";
import { Link } from "react-router-dom";

function SearchResult(props) {
  return (
    <div className="dropdown-content" onClick={props.click}>
      <Link to="/addcoin" className="dropdown-item">
        {Object.keys(props.results[props.ind])[0].toUpperCase()}
        &emsp;
        {Object.values(props.results[props.ind])[0]}
      </Link>
    </div>
  );
}

export default SearchResult;
