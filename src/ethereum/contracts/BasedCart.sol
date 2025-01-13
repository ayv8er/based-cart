// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract BasedCartFactory {
    address[] private allCarts;
    mapping(address => uint256) private cartIndex;

    IERC20 public baseUSDC;

    constructor(address _baseUSDC) {
        require(_baseUSDC != address(0), "Invalid token address");
        baseUSDC = IERC20(_baseUSDC);
        require(baseUSDC.balanceOf(address(this)) >= 0, "Invalid ERC20 token");
    }

    function createCart(string calldata cartName, uint256 amount, string[] calldata items) public payable {
        require(amount > 0, "A delivery fee is required to create a cart");
        require(items.length > 0, "At least one item is required");
        require(baseUSDC.transferFrom(msg.sender, address(this), amount), "Token transfer failed");

        BasedCart newCart = new BasedCart(msg.sender, address(this), amount, cartName, items, baseUSDC);
        address contractAddress = address(newCart);

        require(baseUSDC.transfer(contractAddress, amount), "Transfer to new cart failed");

        allCarts.push(contractAddress);
        cartIndex[contractAddress] = allCarts.length - 1;
    }

    function getAllCartAddresses() public view returns (address[] memory) {
        return allCarts;
    }

    function removeContract(address contractAddress) public {
        require(msg.sender == contractAddress, "Only the contract can remove itself");
        require(BasedCart(contractAddress).isDestroyed(), "Contract is not destroyed");

        uint256 index = cartIndex[contractAddress];
        address lastCart = allCarts[allCarts.length - 1];

        allCarts[index] = lastCart;              
        cartIndex[lastCart] = index;

        allCarts.pop();
        delete cartIndex[contractAddress];
    }
}

contract BasedCart {
    struct Cart {
        string name;
        bool isCompleted;
        bool isActive;
        bool locked;
        uint256 funds;
        address factory;
        address owner;
        address fulfiller;
        string[] items;
        mapping(string => bool) itemExists;
        mapping(string => uint256) itemIndex;
    }

    Cart private cart;
    IERC20 public token;

    event DeliveryClaimed(address indexed fulfiller, address indexed owner);
    event DeliveryForfeited(address indexed fulfiller, address indexed owner);
    event FundsDeposited(address indexed sender, uint256 amount, address indexed fulfiller);
    event FundsWithdrawn(address indexed owner, address indexed fulfiller, uint256 amount);

    constructor(
        address _owner,
        address _factory,
        uint256 initialFunds,
        string memory cartName,
        string[] memory _items,
        IERC20 _token
    ) {
        cart.owner = _owner;
        cart.factory = _factory;
        cart.funds = initialFunds;
        cart.name = cartName;
        cart.isActive = true;
        cart.items = _items;
        token = _token;

        for (uint256 i = 0; i < _items.length; i++) {
            string memory currentItem = _items[i];
            require(!cart.itemExists[currentItem], "Duplicate item detected");
            cart.itemExists[currentItem] = true;
            cart.itemIndex[currentItem] = i;
        }
    }

    modifier onlyOwner() {
        require(msg.sender == cart.owner, "Not the owner");
        _;
    }

    modifier notCompleted() {
        require(!cart.isCompleted, "List is already completed");
        _;
    }

    modifier onlyIfActive() {
        require(cart.isActive, "Contract is not active");
        _;
    }

    modifier nonReentrant() {
        require(!cart.locked, "Reentrant call");
        cart.locked = true;
        _;
        cart.locked = false;
    }

    function deleteItems(string[] calldata items) public onlyOwner notCompleted onlyIfActive {
        for (uint256 i = 0; i < items.length; i++) {
            string calldata itemToDelete = items[i];
            require(cart.itemExists[itemToDelete], "Item does not exist");

            uint256 index = cart.itemIndex[itemToDelete];
            cart.items[index] = cart.items[cart.items.length - 1];
            cart.items.pop();

            delete cart.itemExists[itemToDelete];
            delete cart.itemIndex[itemToDelete];
        }
    }

    function getCartInfo() public view
        returns (
            string memory name, 
            string[] memory items, 
            bool isCompleted, 
            uint256 funds, 
            address fulfiller,
            address owner
        ) 
    {
        name = cart.name;
        items = cart.items;
        isCompleted = cart.isCompleted;
        funds = cart.funds;
        fulfiller = cart.fulfiller;
        owner = cart.owner;
    }

    function claimDelivery() public notCompleted onlyIfActive {
        require(cart.fulfiller == address(0), "Delivery already claimed");
        cart.fulfiller = msg.sender;
        
        emit DeliveryClaimed(msg.sender, cart.owner);
    }

    function forfeitDelivery() public notCompleted onlyIfActive {
        require(cart.fulfiller == msg.sender, "You did not claim this");
        cart.fulfiller = address(0);

        emit DeliveryForfeited(msg.sender, cart.owner);
    }

    function closeSuccessDelivery() public onlyOwner notCompleted onlyIfActive nonReentrant {
        require(cart.fulfiller != address(0), "No delivery person assigned");
        require(cart.funds > 0, "No funds to transfer");

        cart.isCompleted = true;
        cart.isActive = false;

        uint256 payout = cart.funds;
        cart.funds = 0;

        require(token.transfer(cart.fulfiller, payout), "Token transfer failed");
        BasedCartFactory(cart.factory).removeContract(address(this));
        emit FundsWithdrawn(cart.owner, cart.fulfiller, payout);
    }

    function depositMoreFunds(uint256 amount) public notCompleted onlyIfActive {
        require(amount > 0, "Must send funds");
        require(token.transferFrom(msg.sender, address(this), amount), "Token transfer failed");

        cart.funds += amount;
        emit FundsDeposited(msg.sender, amount, cart.fulfiller);
    }

    function withdrawAndDestroy() public onlyOwner notCompleted nonReentrant {
        require(cart.fulfiller == address(0), "Delivery already claimed");

        uint256 balance = cart.funds;
        cart.funds = 0;
        cart.isActive = false;

        require(token.transfer(cart.owner, balance), "Token transfer failed");
        BasedCartFactory(cart.factory).removeContract(address(this));
    }

    function isDestroyed() public view returns (bool) {
        return !cart.isActive;
    }
}