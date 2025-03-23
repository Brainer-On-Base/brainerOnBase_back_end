// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

interface IERC20 {
    function transfer(
        address recipient,
        uint256 amount
    ) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract BrainerPreSale {
    address public owner;
    IERC20 public brainerToken;

    uint256 public rate = 4000000; // 1 ETH = 4,000,000 BRNR (pre-sale)
    uint256 public minContribution = 0.02 ether;
    uint256 public maxContribution = 5 ether;

    uint256 public totalETHRaised;
    bool public isSaleActive = true;

    event TokensPurchased(
        address indexed buyer,
        uint256 ethAmount,
        uint256 tokenAmount
    );
    event WithdrawETH(address indexed admin, uint256 amount);
    event WithdrawTokens(address indexed admin, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    constructor(address _tokenAddress) {
        owner = msg.sender;
        brainerToken = IERC20(_tokenAddress);
    }

    // Fallback function in case someone sends ETH directly
    receive() external payable {
        buyTokens();
    }

    function buyTokens() public payable {
        require(isSaleActive, "Pre-sale is not active");
        require(msg.value >= minContribution, "Contribution is below minimum");
        require(msg.value <= maxContribution, "Contribution exceeds maximum");

        uint256 tokenAmount = msg.value * rate;
        uint256 contractTokenBalance = brainerToken.balanceOf(address(this));

        require(tokenAmount > 0, "Invalid token amount");
        require(
            contractTokenBalance >= tokenAmount,
            "Not enough tokens in contract, the presale is over"
        );

        // Transfer the tokens to the buyer
        brainerToken.transfer(msg.sender, tokenAmount);

        totalETHRaised += msg.value;

        emit TokensPurchased(msg.sender, msg.value, tokenAmount);
    }

    // Owner withdraws collected ETH (usually to add liquidity or fund the project)
    function withdrawETH(uint256 amount) external onlyOwner {
        require(address(this).balance >= amount, "Insufficient ETH balance");
        payable(owner).transfer(amount);

        emit WithdrawETH(msg.sender, amount);
    }

    // Owner can withdraw remaining unsold tokens if sale ends
    function withdrawRemainingTokens(uint256 amount) external onlyOwner {
        uint256 contractTokenBalance = brainerToken.balanceOf(address(this));
        require(amount <= contractTokenBalance, "Amount exceeds token balance");

        brainerToken.transfer(owner, amount);

        emit WithdrawTokens(msg.sender, amount);
    }

    // Toggle sale active/inactive
    function setSaleActive(bool _isActive) external onlyOwner {
        isSaleActive = _isActive;
    }
}
