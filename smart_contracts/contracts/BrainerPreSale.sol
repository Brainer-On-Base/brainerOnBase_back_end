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

    uint256 public rate = 4000000; // 1 ETH = 4,000,000 BRNR
    uint256 public minContribution = 0.02 ether;
    uint256 public maxContribution = 5 ether;

    uint256 public totalETHRaised;

    mapping(address => uint256) public totalContributed;

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

    receive() external payable {
        buyTokens();
    }

    function buyTokens() public payable {
        require(msg.value >= minContribution, "Contribution below minimum");
        require(
            totalContributed[msg.sender] + msg.value <= maxContribution,
            "Exceeds max allowed per address"
        );

        uint256 tokenAmount = msg.value * rate;
        uint256 contractTokenBalance = brainerToken.balanceOf(address(this));

        require(tokenAmount > 0, "Invalid token amount");
        require(
            contractTokenBalance >= tokenAmount,
            "Not enough tokens in contract"
        );

        totalContributed[msg.sender] += msg.value;
        totalETHRaised += msg.value;

        brainerToken.transfer(msg.sender, tokenAmount);
        emit TokensPurchased(msg.sender, msg.value, tokenAmount);
    }

    function withdrawETH(uint256 amount) external onlyOwner {
        require(address(this).balance >= amount, "Insufficient ETH balance");
        payable(owner).transfer(amount);
        emit WithdrawETH(msg.sender, amount);
    }

    function withdrawRemainingTokens(uint256 amount) external onlyOwner {
        uint256 contractTokenBalance = brainerToken.balanceOf(address(this));
        require(amount <= contractTokenBalance, "Amount exceeds balance");
        brainerToken.transfer(owner, amount);
        emit WithdrawTokens(msg.sender, amount);
    }
}
