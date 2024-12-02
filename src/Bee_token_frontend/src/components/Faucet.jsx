import React, { useState } from "react";
import { Bee_token_backend, canisterId, createActor } from "../../../declarations/Bee_token_backend";
import { AuthClient } from '@dfinity/auth-client';

function Faucet() {

  const [isBtnDisabled, setIsBtnDisabled] = useState(false);
  const [buttonText, setButtonText] = useState("Claim");

  async function handleClick(event) {
    let env = import.meta.env.VITE_ENV;
    let amountToTransfer = Number(import.meta.env.VITE_FREE_TOKENS);
    let result;

    setIsBtnDisabled(true);
    if (!env || env === 'development') {
      // dev code
      result = await Bee_token_backend.payOut(amountToTransfer);
    } else {
      // production code
      const authClient = await AuthClient.create();
      const identity = authClient.getIdentity();
  
      const authenticatedCanister = createActor(canisterId, {
        agentOptions: {
          identity,
        },
      });
  
      result = await authenticatedCanister.payOut(amountToTransfer);
    }
    
    setButtonText(result)
    // setIsBtnDisabled(false);
  }

  return (
    <div className="blue window">
      <h2>
        <span role="img" aria-label="tap emoji">
          🚰
        </span>
        Faucet
      </h2>
      <label>Get your free Bee's tokens here! Claim {import.meta.env.VITE_FREE_TOKENS} BEE tokens to your account.</label>
      <p className="trade-buttons">
        <button id="btn-payout" onClick={handleClick} disabled={isBtnDisabled}>
          {buttonText}
        </button>
      </p>
    </div>
  );
}

export default Faucet;
