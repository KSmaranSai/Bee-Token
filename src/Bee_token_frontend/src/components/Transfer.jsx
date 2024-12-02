import React, { useState } from "react";
import { Principal } from "@dfinity/principal";
import { Bee_token_backend, canisterId, createActor } from "../../../declarations/Bee_token_backend";
import { AuthClient } from '@dfinity/auth-client';

function Transfer() {

  const [recipientId, setRecipientId] = useState("")
  const [amount, setAmount] = useState("")
  const [isDisabled, setIsDisabled] = useState(false)
  const [feedback, setFeedback] = useState("")
  const [isHidden, setIsHidden] = useState(true)
  
  async function handleClick() {
    let result;
    const recipient = Principal.fromText(recipientId);
    const amountToTransfer = Number(amount);

    setIsDisabled(true);
    setIsHidden(true);
    if (!env || env === 'development') {
      // dev code
      result = await Bee_token_backend.transfer(recipient, amountToTransfer);
    } else {
      // production code
      const authClient = await AuthClient.create();
      const identity = authClient.getIdentity();
  
      const authenticatedCanister = createActor(canisterId, {
        agentOptions: {
          identity,
        },
      });
  
      result = await authenticatedCanister.transfer(recipient, amountToTransfer);
    }
    
    setFeedback(result);
    setIsHidden(false);
    setIsDisabled(false);
  }

  return (
    <div className="window white">
      <div className="transfer">
        <fieldset>
          <legend>To Account:</legend>
          <ul>
            <li>
              <input
                type="text"
                id="transfer-to-id"
                value = {recipientId}
                onChange={(e) => {setRecipientId(e.target.value)}}
              />
            </li>
          </ul>
        </fieldset>
        <fieldset>
          <legend>Amount:</legend>
          <ul>
            <li>
              <input
                type="number"
                id="amount"
                value = {amount}
                onChange={(e) => {setAmount(e.target.value)}}
              />
            </li>
          </ul>
        </fieldset>
        <p className="trade-buttons">
          <button id="btn-transfer" onClick={handleClick} disabled={isDisabled}>
            Transfer
          </button>
        </p>
        <p hidden={isHidden}>{feedback}</p>
      </div>
    </div>
  );
}

export default Transfer;
