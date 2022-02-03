//SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "hardhat/console.sol";

contract Token {
  string public name = "Smooth Brain Token";
  string public symbol = "SBT";
  uint public totalSupply = 10000000 * (10 ** 18); // 10 millions
  address payable public owner;

  mapping(address => uint) balances;
  mapping(address => bool) alreadyReceivedTenTokenAddresses;

  constructor() {
    balances[msg.sender] = totalSupply;
    owner = payable(msg.sender);
  }

  function deposit() external payable {}

  function getContractEthBalance() external view returns (uint) {
      return address(this).balance;
  }

  function withdrawEthToOwner() public {
      uint amount = address(this).balance;
      (bool success, ) = owner.call{ value: amount }("");
      require(success, "Failed to send Ether");
  }

  function getOwnerEthBalance() public view returns (uint) {
      return address(owner).balance;
  }

  function transfer(address _to, uint _amount) public {
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

  // check wallet status if they have already called giveMeTenTokens()
  function checkWalletStatus(address _account) external view returns (bool) {
    return alreadyReceivedTenTokenAddresses[_account];
  }
  
  function swapEthForSbtoken(uint _amount) payable external {
      console.log('msg value', msg.value);
      require(msg.value >= 1, "You don't have enough ETH.");

      balances[owner] -= _amount;
      balances[msg.sender] += _amount;
  }
}