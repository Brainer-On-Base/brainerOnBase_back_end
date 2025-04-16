// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract PixelBrainerNFTCollection is ERC721, Ownable, ReentrancyGuard {
    uint256 public currentTokenId = 0;
    uint256 public immutable maxSupply;
    uint256 public immutable mintPrice;
    uint256 public immutable transferFeePercentage;

    mapping(uint256 => string) public _tokenURIs;
    mapping(string => bool) private _existingURIs;
    mapping(uint256 => string) private _availableURIs;
    mapping(address => uint256) public mintedTokensCount;

    event NFTMinted(address indexed recipient, uint256 tokenId, string uri);

    /// @notice Contract constructor for Pixel Brainer NFT Collection
    /// @param _maxSupply Maximum number of NFTs that can be minted
    /// @param _mintPrice Initial mint price in wei
    /// @param _transferFeePercentage Fee percentage applied on transfers (reserved for future logic)
    /// @param uris List of metadata URIs, must match maxSupply
    constructor(
        uint256 _maxSupply,
        uint256 _mintPrice,
        uint256 _transferFeePercentage,
        string[] memory uris
    ) ERC721("PixelBrainerCollection", "PBC1") Ownable(msg.sender) {
        require(_transferFeePercentage <= 100, "Percentage cannot exceed 100");
        require(uris.length == _maxSupply, "URIs length must match max supply");
        maxSupply = _maxSupply;
        mintPrice = _mintPrice;
        transferFeePercentage = _transferFeePercentage;

        for (uint256 i = 0; i < uris.length; i++) {
            _availableURIs[i] = uris[i];
        }
    }

    /// @notice Check if minting is still active (not sold out)
    function isMintingActive() public view returns (bool) {
        return currentTokenId < maxSupply;
    }

    /// @notice Calculates current mint price depending on supply phase
    /// @return Mint price in wei
    function getMintPrice() public view returns (uint256) {
        uint256 phase = currentTokenId / (maxSupply / 4);
        if (phase == 0) {
            return mintPrice;
        } else if (phase == 1) {
            return mintPrice + ((mintPrice * 15) / 100);
        } else if (phase == 2) {
            return mintPrice + ((mintPrice * 30) / 100);
        } else {
            return mintPrice + ((mintPrice * 45) / 100);
        }
    }

    /// @notice Mints a new NFT to the recipient, with randomized metadata URI
    /// @param recipient Address to receive the NFT
    function mintNFT(address recipient) public payable {
        require(isMintingActive(), "Minting is finished");
        require(tx.origin == msg.sender, "Contracts not allowed");
        require(mintedTokensCount[recipient] < 2, "Max 2 NFTs per wallet");
        uint256 currentMintPrice = getMintPrice();
        require(msg.value >= currentMintPrice, "Insufficient funds");

        // Random URI assignment from the remaining pool
        uint256 randomIndex = uint256(
            keccak256(
                abi.encodePacked(
                    block.timestamp,
                    block.prevrandao,
                    currentTokenId
                )
            )
        ) % (maxSupply - currentTokenId);
        string memory uri = _availableURIs[randomIndex];

        // Swap-and-pop to avoid duplicates
        _availableURIs[randomIndex] = _availableURIs[
            maxSupply - currentTokenId - 1
        ];
        delete _availableURIs[maxSupply - currentTokenId - 1];

        currentTokenId++;
        _safeMint(recipient, currentTokenId);
        _tokenURIs[currentTokenId] = uri;
        _existingURIs[uri] = true;
        mintedTokensCount[recipient]++;

        emit NFTMinted(recipient, currentTokenId, uri);
    }

    /// @notice Returns the metadata URI for a given token
    /// @param tokenId ID of the token
    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        require(
            bytes(_tokenURIs[tokenId]).length > 0,
            "ERC721Metadata: URI query for nonexistent token"
        );
        return _tokenURIs[tokenId];
    }

    /// @notice Updates the URI of a specific token (only callable by owner)
    /// @dev Use this in case of IPFS node migration or metadata hosting changes
    /// @param tokenId ID of the token to update
    /// @param newUri New metadata URI to assign
    function updateTokenURI(
        uint256 tokenId,
        string memory newUri
    ) public onlyOwner {
        require(
            bytes(_tokenURIs[tokenId]).length > 0,
            "ERC721Metadata: URI query for nonexistent token"
        );
        _tokenURIs[tokenId] = newUri;
    }

    /// @notice Withdraws collected funds to a specified address
    /// @param recipient Address to receive the funds
    function withdrawFunds(
        address payable recipient
    ) public onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        recipient.transfer(balance);
    }

    /// @notice Checks if a given URI is still available for assignment
    /// @param uri Metadata URI to check
    function isURIAvailable(string memory uri) public view returns (bool) {
        return !_existingURIs[uri];
    }

    /// @notice Prevents receiving ETH directly to the contract
    receive() external payable {
        revert("No ETH accepted");
    }

    /// @notice Fallback function to reject unexpected calls
    fallback() external payable {
        revert("Function does not exist");
    }
}
