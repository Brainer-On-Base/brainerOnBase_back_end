// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PixelBrainerCollection is ERC721, Ownable {
    uint256 public currentTokenId = 0;
    uint256 public maxSupply;
    uint256 public mintPrice = 0.01 ether;
    uint256 public transferFeePercentage = 1; // 1% fee for each transfer

    // Map to store metadata URI for each token
    mapping(uint256 => string) private _tokenURIs;

    // Evento para registrar cuando se mintea un NFT
    event NFTMinted(
        address indexed recipient,
        uint256 tokenId,
        string uri,
        string message
    );

    // Constructor que llama correctamente al constructor de ERC721 con el nombre y símbolo del token
    constructor(
        uint256 _maxSupply
    ) ERC721("PixelBrainerCollection", "PBC1") Ownable(msg.sender) {
        maxSupply = _maxSupply;
    }

    function mintNFT(address recipient, string memory uri) public payable {
        require(currentTokenId < maxSupply, "Max supply reached");
        require(msg.value >= mintPrice, "Insufficient funds");

        currentTokenId++;
        _safeMint(recipient, currentTokenId);
        _setTokenURI(currentTokenId, uri);

        // Emitir el evento NFTMinted con los detalles del NFT minteado
        emit NFTMinted(
            recipient,
            currentTokenId,
            uri,
            "New Pixel Brainer 1st Collection Minted"
        );
    }

    // Function to set the token URI for a given token ID
    function _setTokenURI(uint256 tokenId, string memory uri) internal {
        require(
            _tokenExists(tokenId),
            "ERC721Metadata: URI set of nonexistent token"
        );
        _tokenURIs[tokenId] = uri;
    }

    // Custom function to check token existence using ownerOf
    function _tokenExists(uint256 tokenId) internal view returns (bool) {
        try this.ownerOf(tokenId) returns (address) {
            return true;
        } catch {
            return false;
        }
    }

    // Override tokenURI function to return the token-specific URI
    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        require(
            _tokenExists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );
        return _tokenURIs[tokenId];
    }

    // Override _transfer function to include fee deduction
    function _transfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override {
        uint256 transferFee = (msg.value * transferFeePercentage) / 100;
        require(
            msg.value >= transferFee,
            "Insufficient funds for transfer fee"
        );

        // Transfer the fee to the contract
        payable(address(this)).transfer(transferFee);

        // Proceed with the transfer
        super._transfer(from, to, tokenId);
    }

    // Function to withdraw collected fees to a specified address
    function withdrawFunds(address payable recipient) public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        recipient.transfer(balance);
    }
}
