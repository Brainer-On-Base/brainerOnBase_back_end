// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/// @title Pixel Brainer NFT Collection - Random reveal-style NFT contract (BAYC-style)
/// @notice Allows minting NFTs with randomized metadata URIs revealed after full mint
/// @author BRAINER MASTER
contract PixelBrainerNFTCollection is ERC721, Ownable, ReentrancyGuard {
    using Strings for uint256;

    uint256 public currentTokenId;
    uint256 public immutable maxSupply;
    uint256 public immutable mintPrice;

    uint256 public randomOffset;
    bool public revealed;

    string public baseURI;

    mapping(address => uint256) public mintedTokensCount;

    // @@ Constructor
    /// @param _maxSupply Maximum number of NFTs to mint
    /// @param _mintPrice Mint price in wei
    /// @param _initialBaseURI Base URI used before and after reveal
    constructor(
        uint256 _maxSupply,
        uint256 _mintPrice,
        string memory _initialBaseURI
    ) ERC721("PixelBrainerCollection", "PBC1") Ownable(msg.sender) {
        maxSupply = _maxSupply;
        mintPrice = _mintPrice;
        baseURI = _initialBaseURI;
    }

    // @@ Mint function
    /// @notice Allows minting of NFTs (max 2 per wallet)
    /// @param recipient Address to receive the minted NFT
    function mintNFT(address recipient) public payable {
        require(currentTokenId < maxSupply, "Sold out");
        require(tx.origin == msg.sender, "Contracts not allowed");
        require(mintedTokensCount[recipient] < 2, "Max 2 per wallet");
        require(msg.value >= mintPrice, "Insufficient ETH");

        currentTokenId++;
        _safeMint(recipient, currentTokenId);
        mintedTokensCount[recipient]++;
    }

    // @@ tokenURI
    /// @notice Returns the metadata URI for a given token
    /// @dev If not revealed yet, returns the placeholder "mystery.json"
    /// @param tokenId Token ID to query
    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        require(ownerOf(tokenId) != address(0), "Nonexistent token");

        if (!revealed) {
            return string(abi.encodePacked(baseURI, "mystery.json"));
        }

        uint256 shiftedId = (tokenId + randomOffset) % maxSupply;
        return string(abi.encodePacked(baseURI, shiftedId.toString(), ".json"));
    }

    // @@ Reveal function
    /// @notice Triggers the metadata reveal by generating a random offset
    /// @dev Can only be called once by the contract owner
    function reveal() public onlyOwner {
        require(!revealed, "Already revealed");

        randomOffset =
            uint256(
                keccak256(
                    abi.encodePacked(
                        block.timestamp,
                        blockhash(block.number - 1),
                        currentTokenId
                    )
                )
            ) %
            maxSupply;

        revealed = true;
    }

    // @@ Set Base URI
    /// @notice Allows the owner to update the base URI (for IPFS migration, backend changes, etc.)
    /// @param newBaseURI New URI to set (should end with a slash "/")
    function setBaseURI(string memory newBaseURI) public onlyOwner {
        baseURI = newBaseURI;
    }

    // @@ Withdraw
    /// @notice Allows the contract owner to withdraw collected ETH
    /// @param recipient Address to receive the funds
    function withdrawFunds(
        address payable recipient
    ) public onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        recipient.transfer(balance);
    }

    // @@ Prevent direct ETH transfers
    receive() external payable {
        revert("Direct ETH not accepted");
    }

    fallback() external payable {
        revert("Invalid function");
    }
}
