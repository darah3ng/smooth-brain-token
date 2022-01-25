//SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SBToken is ERC20 {
  // constructor(string memory name, string memory symbol) ERC20(name, symbol) {
  //   _mint(msg.sender, 10000 * (10 ** 18));
  // }

  // OR

  constructor() ERC20("Smooth Brain Token", "SBT") {
    _mint(msg.sender, 10000 * (10 ** 18));
  }
}