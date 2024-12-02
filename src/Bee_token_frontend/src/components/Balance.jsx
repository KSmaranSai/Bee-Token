import React, { useState } from "react";
import { Principal } from '@dfinity/principal'
import { Bee_token_backend } from "../../../declarations/Bee_token_backend"

function Balance(props) {

  // const [inputValue, setInput] = useState("");
  const [balanceResult, setBalance] = useState("");
  const [tokenSymbol, setSymbol] = useState("");
  
  async function handleClick() {
    // const principal = Principal.fromText(inputValue);
    const principal = Principal.fromText(props.userPrincipal);
    const balance = await Bee_token_backend.balanceOf(principal);
    const symbol = await Bee_token_backend.getSymbol();
    setBalance(balance.toLocaleString())
    setSymbol(symbol)
  }


  return (
    <div className="window white">
      <label>Check account token balance:</label>
      <p>
        <input
          id="balance-principal-id"
          type="text"
          placeholder="Enter a Principal ID"
          // value={inputValue}
          value={props.userPrincipal}
          readOnly
          // onChange={(e) => setInput(e.target.value)}
        />
      </p>
      <p className="trade-buttons">
        <button
          id="btn-request-balance"
          onClick={handleClick}
        >
          Check Balance
        </button>
      </p>
      <p>This account has a balance of {balanceResult} {tokenSymbol}.</p>
    </div>
  );
}

export default Balance;
