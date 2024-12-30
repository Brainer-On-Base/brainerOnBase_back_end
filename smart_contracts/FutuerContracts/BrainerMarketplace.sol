// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "./items/HouseItems.sol";
import "./items/CharacterItems.sol";

contract Marketplace {
    HouseItems public houseItems;
    CharacterItems public characterItems;

    constructor(address _houseItems, address _characterItems) {
        houseItems = HouseItems(_houseItems);
        characterItems = CharacterItems(_characterItems);
    }

    function buyHouseItem(uint256 itemId) public payable {
        houseItems.buyItem{value: msg.value}(itemId);
    }

    function buyCharacterItem(uint256 itemId) public payable {
        characterItems.buyItem{value: msg.value}(itemId);
    }

    // Puedes agregar más funciones como listar items, cancelar ventas, etc.
}
