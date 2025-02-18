// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract PixelBrainerNFTCollection is ERC721, Ownable, ReentrancyGuard {
    uint256 public currentTokenId = 0;
    uint256 public immutable maxSupply;
    uint256 public immutable mintPrice;
    uint256 public immutable transferFeePercentage;

    mapping(uint256 => string) public _tokenURIs;
    mapping(string => bool) private _existingURIs; // Nuevo mapping para rastrear URIs existentes
    mapping(uint256 => string) private _availableURIs; // Nuevo mapping para URIs disponibles
    mapping(address => uint256) public mintedTokensCount; // Nuevo mapping para rastrear la cantidad de NFTs minteados por cada dirección

    event NFTMinted(address indexed recipient, uint256 tokenId, string uri);

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

    function mintNFT(address recipient) public payable {
        require(currentTokenId < maxSupply, "Max supply reached");
        require(mintedTokensCount[recipient] < 2, "Max 2 NFTs per wallet");
        uint256 currentMintPrice = getMintPrice();
        require(msg.value >= currentMintPrice, "Insufficient funds");

        // Seleccionar una URI aleatoria
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

        // Mover la última URI disponible a la posición del índice seleccionado
        _availableURIs[randomIndex] = _availableURIs[
            maxSupply - currentTokenId - 1
        ];
        delete _availableURIs[maxSupply - currentTokenId - 1];

        currentTokenId++;
        _safeMint(recipient, currentTokenId);
        _tokenURIs[currentTokenId] = uri;
        _existingURIs[uri] = true; // Marcar el URI como utilizado
        mintedTokensCount[recipient]++; // Incrementar el contador de NFTs minteados por la dirección

        emit NFTMinted(recipient, currentTokenId, uri);
    }

    function tokenExists(uint256 tokenId) public view returns (bool) {
        // Si ownerOf no lanza un error, significa que el token existe
        address owner = ownerOf(tokenId);
        return owner != address(0); // Si el propietario es la dirección 0, no existe
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        require(
            tokenExists(tokenId),
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
