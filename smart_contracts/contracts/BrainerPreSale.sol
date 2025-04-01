// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

interface IERC20 {
    function transfer(
        address recipient,
        uint256 amount
    ) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

interface INFTCollection {
    function ownerOf(uint256 tokenId) external view returns (address);
}

contract BrainerPreSale {
    address public owner;
    IERC20 public brainerToken;
    INFTCollection public nftCollection;

    uint256 public constant PRESALE_SUPPLY = 1_000_000_000 * 1e18;
    uint256 public constant CLAIM_SUPPLY = 500_000_000 * 1e18;
    uint256 public constant TOKENS_PER_NFT = 100_000 * 1e18;

    uint256 public rate = 4_000_000; // 1 ETH = 4M BRNR
    uint256 public minContribution = 0.02 ether;
    uint256 public maxContribution = 5 ether;

    uint256 public totalETHRaised;
    uint256 public tokensSold;
    uint256 public nftClaimedTotal;

    mapping(address => uint256) public totalContributed;
    mapping(uint256 => bool) public nftClaimed; // tokenId => claimed?

    event TokensPurchased(
        address indexed buyer,
        uint256 ethAmount,
        uint256 tokenAmount
    );
    event WithdrawETH(address indexed admin, uint256 amount);
    event WithdrawTokens(address indexed admin, uint256 amount);
    event NFTClaimed(address indexed user, uint256 tokenId, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    constructor(address _tokenAddress, address _nftAddress) {
        owner = msg.sender;
        brainerToken = IERC20(_tokenAddress);
        nftCollection = INFTCollection(_nftAddress);
    }

    receive() external payable {
        buyTokens();
    }

    fallback() external {
        revert("Don't send BRNR tokens directly");
    }

    function buyTokens() public payable {
        require(msg.value >= minContribution, "Below minimum");
        require(
            totalContributed[msg.sender] + msg.value <= maxContribution,
            "Exceeds max per wallet"
        );

        uint256 tokenAmount = msg.value * rate;
        require(tokenAmount > 0, "Invalid token amount");
        require(
            tokensSold + tokenAmount <= PRESALE_SUPPLY,
            "Presale supply exceeded"
        );

        totalContributed[msg.sender] += msg.value;
        totalETHRaised += msg.value;
        tokensSold += tokenAmount;

        brainerToken.transfer(msg.sender, tokenAmount);
        emit TokensPurchased(msg.sender, msg.value, tokenAmount);
    }

    function claimForNFT(uint256 tokenId) external {
        require(
            nftCollection.ownerOf(tokenId) == msg.sender,
            "Not the owner of this NFT"
        );
        require(!nftClaimed[tokenId], "Already claimed");

        nftClaimed[tokenId] = true;
        nftClaimedTotal += TOKENS_PER_NFT;
        brainerToken.transfer(msg.sender, TOKENS_PER_NFT);

        emit NFTClaimed(msg.sender, tokenId, TOKENS_PER_NFT);
    }

    function withdrawETH(uint256 amount) external onlyOwner {
        require(address(this).balance >= amount, "Insufficient ETH");
        payable(owner).transfer(amount);
        emit WithdrawETH(msg.sender, amount);
    }

    function withdrawRemainingTokens(uint256 amount) external onlyOwner {
        uint256 contractTokenBalance = brainerToken.balanceOf(address(this));
        uint256 reservedForClaim = CLAIM_SUPPLY - nftClaimedTotal;
        uint256 withdrawable = contractTokenBalance > reservedForClaim
            ? contractTokenBalance - reservedForClaim
            : 0;

        require(amount <= withdrawable, "Amount exceeds withdrawable tokens");
        brainerToken.transfer(owner, amount);
        emit WithdrawTokens(msg.sender, amount);
    }
}
