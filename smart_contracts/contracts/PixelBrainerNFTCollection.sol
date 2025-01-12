// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract PixelBrainerCollection is ERC721, Ownable, ReentrancyGuard {
    uint256 public currentTokenId = 0;
    uint256 public immutable maxSupply;
    uint256 public immutable mintPrice;
    uint256 public immutable transferFeePercentage;

    mapping(uint256 => string) private _tokenURIs;
    mapping(string => bool) private _existingURIs; // Nuevo mapping para rastrear URIs existentes

    event NFTMinted(address indexed recipient, uint256 tokenId, string uri);

    constructor(
        uint256 _maxSupply,
        uint256 _mintPrice,
        uint256 _transferFeePercentage
    ) ERC721("PixelBrainerCollection", "PBC1") {
        require(_transferFeePercentage <= 100, "Percentage cannot exceed 100");
        maxSupply = _maxSupply;
        mintPrice = _mintPrice;
        transferFeePercentage = _transferFeePercentage;
    }

    function mintNFT(address recipient, string memory uri) public payable {
        require(currentTokenId < maxSupply, "Max supply reached");
        require(msg.value >= mintPrice, "Insufficient funds");
        require(!_existingURIs[uri], "URI already exists"); // Verificar que el URI no exista

        currentTokenId++;
        _safeMint(recipient, currentTokenId);
        _tokenURIs[currentTokenId] = uri;
        _existingURIs[uri] = true; // Marcar el URI como utilizado

        emit NFTMinted(recipient, currentTokenId, uri);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );
        return _tokenURIs[tokenId];
    }

    function withdrawFunds(
        address payable recipient
    ) public onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        recipient.transfer(balance);
    }

    // Nueva función para validar si un URI ya existe
    function isURIAvailable(string memory uri) public view returns (bool) {
        return !_existingURIs[uri];
    }
}
