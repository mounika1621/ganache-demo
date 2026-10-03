// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract FoodTraceability {

    // Stores basic information about a food product
    struct FoodProduct {
        uint256 id;
        string productName;
        string farmerName;
        string origin;
        uint256 createdAt;
        bool exists;
    }

    // Stores each stage of the food supply chain
    struct Stage {
        string stageName;
        string actorName;
        string location;
        uint256 timestamp;
    }

    // Total number of products
    uint256 public productCount;

    // Product ID => Product information
    mapping(uint256 => FoodProduct) public products;

    // Product ID => Supply chain history
    mapping(uint256 => Stage[]) public productHistory;


    // Add a new food product
    function addProduct(
        string memory _productName,
        string memory _farmerName,
        string memory _origin
    ) public {

        productCount++;

        products[productCount] = FoodProduct(
            productCount,
            _productName,
            _farmerName,
            _origin,
            block.timestamp,
            true
        );

        // First stage is automatically HARVESTED
        productHistory[productCount].push(
            Stage(
                "HARVESTED",
                _farmerName,
                _origin,
                block.timestamp
            )
        );
    }


    // Add a new stage to the supply chain
    function updateStage(
        uint256 _productId,
        string memory _stageName,
        string memory _actorName,
        string memory _location
    ) public {

        require(
            products[_productId].exists,
            "Product does not exist"
        );

        productHistory[_productId].push(
            Stage(
                _stageName,
                _actorName,
                _location,
                block.timestamp
            )
        );
    }


    // Get product information
    function getProduct(uint256 _productId)
        public
        view
        returns (
            uint256,
            string memory,
            string memory,
            string memory,
            uint256,
            bool
        )
    {
        FoodProduct memory product = products[_productId];

        return (
            product.id,
            product.productName,
            product.farmerName,
            product.origin,
            product.createdAt,
            product.exists
        );
    }


    // Get number of stages for a product
    function getHistoryCount(uint256 _productId)
        public
        view
        returns (uint256)
    {
        return productHistory[_productId].length;
    }


    // Get a particular stage
    function getStage(
        uint256 _productId,
        uint256 _index
    )
        public
        view
        returns (
            string memory,
            string memory,
            string memory,
            uint256
        )
    {
        Stage memory stage = productHistory[_productId][_index];

        return (
            stage.stageName,
            stage.actorName,
            stage.location,
            stage.timestamp
        );
    }
}