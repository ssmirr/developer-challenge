import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {

  async function connectMetamask() {
    console.log('connecting metamask wallet');
    try {
      // get metamask ethereum object
      const { ethereum } = window;

      if (!ethereum) {
        alert('Get MetaMask.io to use this App!');
        return;
      }

      // get chainId
      const chainId = await ethereum.request({ method: 'eth_chainId' });
      console.log('metamask chainId', chainId);

      // get accounts
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      console.log('metamask accounts', accounts);

      // get all users
      const getUsers = await fetch('/api/users', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      console.log('getUsers', await getUsers.json());

      // set public key to login endpoint
      const loginResult = await fetch('/api/users/login', {
        method: 'POST',
        body: JSON.stringify({ publicKey: accounts[0] }),
        headers: { 'Content-Type': 'application/json' }
      });

      console.log('login result', await loginResult.json());

      // const balance = await ethereum.request({
      //     method: 'eth_getBalance',
      //     params: [accounts[0], 'latest'],
      // });
      // console.log('balance', balance);
    }
    catch (error) {
      console.error(error);
    }

  }

  return (
    <div className="App">
      <button className='btn btn-primary bg-dk-primary border rounded hover:bg-dk-primary-hover text-dk-faded p-4' onClick={connectMetamask}>Connect Metamask</button>
    </div>
  );
}

export default App;
