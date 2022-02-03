//SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "hardhat/console.sol";

contract Token {
  string public name = "Smooth Brain Token";
  string public symbol = "SBT";
  uint public totalSupply = 10000000 * (10 ** 18); // 10 millions
  address public owner;

  mapping(address => uint) balances;
  mapping(address => bool) alreadyReceivedTenTokenAddresses;

  constructor() {
    balances[msg.sender] = totalSupply;
    owner = msg.sender;
  }

  function transfer(address _to, uint _amount) external {
    require(balances[msg.sender] >= _amount, "Not enough tokens");
    balances[msg.sender] -= _amount;
    balances[_to] += _amount;
  }
  
  function balanceOf(address _account) external view returns (uint) {
    return balances[_account];
  }

  function getOwnerBalance() external view returns (uint256) {
    return balances[owner];
  }

  function giveMeTenTokens() external {
    require(balances[owner] >= 10, "Not enough tokens");
    require(alreadyReceivedTenTokenAddresses[msg.sender] == false, "Can only do this once.");

    balances[owner] -= 10;
    balances[msg.sender] += 10;
    alreadyReceivedTenTokenAddresses[msg.sender] = true;
  }

  function checkWalletStatus(address _account) external view returns (bool) {
      return alreadyReceivedTenTokenAddresses[_account];
  }
}