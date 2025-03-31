// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BrainerToken is ERC20, ERC20Burnable, Ownable {
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10 ** 18;

    constructor() ERC20("Brainer Token", "BRNR") Ownable(msg.sender) {
        _mint(msg.sender, (MAX_SUPPLY * 50) / 100); // 50% al deployer para liquidez inicial
    }

    function mint(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        _mint(to, amount);
    }

    function burnFromGame(address account, uint256 amount) external onlyOwner {
        _burn(account, amount);
    }
}
