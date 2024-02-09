// SPDX-License-Identifier:MIT

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

pragma solidity ^0.8.20;

contract MockERC20 is ERC20 {
    constructor() ERC20("Brown Dev Tokens", "BR0D3") {
        _mint(_msgSender(), 100000 * 10 ** (uint256(decimals())));
    }

    function mint() external {
        _mint(_msgSender(), 100000 * 10 ** (uint256(decimals())));
    }

    function decimals() public view override returns (uint8) {
        return 6;
    }
}
