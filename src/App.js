import { useState } from 'react';
import { ethers } from 'ethers';
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json';

import logo from './logo.svg';
import './App.css';

const greeterAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

function App() {
  const [greeting, setGreetingValue] = useState('');

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }
  
  async function fetchGreeting() {
    // looking for Metamask on the browser
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider); // create an instance of the contract

      try {
        const data = await contract.greet();
        console.log('data: ', data);
      }
      catch (err) {
        console.log('Error: ', err);
      }
    }
  }

  async function setGreeting() {
    if (!greeting) {
      return;
    }

    if (typeof window.ethereum !== 'undefined') {
      await requestAccount(); // wait for the users to connect to their wallet

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner(); // to create a transaction, we need a signer
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer); // create an instance of the contract with a signer
      const transaction = await contract.setGreeting(greeting);

      setGreetingValue('');

      await transaction.wait(); // waiting for transaction to be confirmed

      fetchGreeting();
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={fetchGreeting}>Fetch Greeting</button>
        <button onClick={setGreeting}>Set Greeting</button>

        <input
          onChange={e => setGreetingValue(e.target.value)}
          placeholder='Set greeting'
          value={greeting}
        />
      </header>
    </div>
  );
}

export default App;
