import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.scss';
import { AuthClient } from '@dfinity/auth-client';

const init = async () => {

  const authClient = await AuthClient.create();

  if (await authClient.isAuthenticated()) {
    console.log(authClient)
    handleLogin(authClient);
  }
  else {
    await authClient.login({
      identityProvider: "https://identity.ic0.app/#authorize",
      onSuccess: () => {
        handleLogin(authClient);
      }
    })
  }
}

async function handleLogin(authClient) {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  const env = import.meta.env.VITE_ENV;
  let userPrincipal;

  if (!env || env === 'development') {
    // dev code
    userPrincipal = import.meta.env.VITE_DEV_PRINCIPAL;
  } else {
    // production code
    const identity = await authClient.getIdentity();
    userPrincipal = identity._principal.toString();
  }
  root.render(
    <React.StrictMode>
      <App userPrincipal={userPrincipal} />
    </React.StrictMode>,
  );
}

init();
// handleLogin();