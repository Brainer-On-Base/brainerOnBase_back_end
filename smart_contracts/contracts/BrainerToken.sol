// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BrainerToken is ERC20, ERC20Burnable, Ownable {
    uint256 public constant MAX_SUPPLY = 10_000_000_000 * 10 ** 18;

    address public playToEarnAddress;
    address public stakingGovAddress;
    address public marketingAddress;
    address public devAddress;

    constructor(
        address _playToEarn,
        address _stakingGov,
        address _marketing,
        address _dev
    ) ERC20("Brainer Token", "BRNR") Ownable(msg.sender) {
        require(_playToEarn != address(0), "Invalid P2E address");
        require(_stakingGov != address(0), "Invalid staking address");
        require(_marketing != address(0), "Invalid marketing address");
        require(_dev != address(0), "Invalid dev address");

        playToEarnAddress = _playToEarn;
        stakingGovAddress = _stakingGov;
        marketingAddress = _marketing;
        devAddress = _dev;

        // 55% Liquidity & Markets (deployer)
        _mint(msg.sender, (MAX_SUPPLY * 55) / 100);

        // 20% Play to Burn/Earn
        _mint(playToEarnAddress, (MAX_SUPPLY * 20) / 100);

        // 10% Staking & Governance
        _mint(stakingGovAddress, (MAX_SUPPLY * 10) / 100);

        // 10% Developer wallet
        _mint(devAddress, (MAX_SUPPLY * 10) / 100);

        // 5% Marketing
        _mint(marketingAddress, (MAX_SUPPLY * 5) / 100);
    }

    function mint(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        _mint(to, amount);
    }

    function burnFromGame(address account, uint256 amount) external onlyOwner {
        _burn(account, amount);
    }

    receive() external payable {
        revert("No ETH allowed");
    }

    fallback() external payable {
        revert("Invalid call");
    }
}
