import React from "react";
import Header from "./components/Header";
import Faucet from "./components/Faucet";
import Balance from "./components/Balance";
import Transfer from "./components/Transfer";

function App(props) {
  return (
    <div id="screen">
      <Header />
      <Faucet />
      <Balance userPrincipal={props.userPrincipal}/>
      <Transfer />
    </div>
  );
}

export default App;
