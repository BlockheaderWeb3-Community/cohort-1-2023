// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract BTCPriceConsumerV3 {
    AggregatorV3Interface internal priceFeed;

    /**
     * Network: Sepolia
     * Aggregator: BTC/USD
     * Address: 0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43
     */
    constructor() {
        priceFeed = AggregatorV3Interface(
            0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43
        );
    }

    /**
     * Returns the latest price.
     */
    function getLatestPrice() public view returns (int, uint8) {
        // prettier-ignore
        (
            /* uint80 roundID */,
            int price,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = priceFeed.latestRoundData();

         // get priceFeed decimals
        uint8 decimals = priceFeed.decimals();
        return (price, decimals);
    }

      // utility function to calculate base price
    function calculateBasePrice()
        public
        view
        returns (uint256)
    {
        (int256 price, uint8 decimals) = getLatestPrice();
        // return price / int256(10**decimals);
        return (uint256(price)) / (10**decimals);
    }
}
