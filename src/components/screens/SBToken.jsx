import { Link } from "react-router-dom";
import { useState } from 'react';
import { ethers } from 'ethers';
import Token from '../../artifacts/contracts/Token.sol/Token.json';

const tokenAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';

function SBTokenPage() {
  const [userAccount, setUserAccount] = useState('');
  const [amount, setAmount] = useState(0);

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  async function getBalance() {
    if (typeof window.ethereum !== 'undefined') {
      const [ account ] = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(tokenAddress, Token.abi, provider);
      const balance = await contract.balanceOf(account);
      console.log('Balance: ', balance.toString());
    }
  }

  async function sendCoins() {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(tokenAddress, Token.abi, signer);
      const transaction = await contract.transfer(userAccount, amount);
      await transaction.wait();
      console.log(`${amount} Coins successfully sent to ${userAccount}`);
    }
  }

  return (
    <>
      <h1>Smooth Brain Contract</h1>
      <button onClick={getBalance}>Get balance</button>
      <button onClick={sendCoins}>Send coins</button>
      <input onChange={e => setUserAccount(e.target.value)} placeholder='Account ID' />
      <input onChange={e => setAmount(e.target.value)} placeholder='Amount' />

      <br /><br />

      <Link to='/'>Back</Link>
    </>
  );
}

export default SBTokenPage;