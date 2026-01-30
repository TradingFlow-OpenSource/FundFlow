// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title FlowFundBondingCurve
/// @notice Bonding Curve Token - Pump.fun style with quadratic pricing
/// @dev Uses quadratic bonding curve: Price = BASE + K * Supply²
///      This creates dramatic price increases for demo effect!
contract FlowFundBondingCurve {
    // ============ State Variables ============
    string public name;
    string public symbol;
    uint8 public constant DECIMALS = 18;
    
    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;
    
    // ============ Bonding Curve Parameters ============
    // 
    // 定价公式: Price = BASE_PRICE + K * (Supply / SCALE)²
    //
    // 示例价格变化 (假设 K = 0.0001 ETH):
    //   Supply = 0      → Price = 0.0001 ETH (起始价)
    //   Supply = 100    → Price = 0.0002 ETH 
    //   Supply = 1000   → Price = 0.0101 ETH (涨了100倍!)
    //   Supply = 5000   → Price = 0.2501 ETH (涨了2500倍!)
    //
    uint256 public constant BASE_PRICE = 0.0001 ether;    // 起始价格: 0.0001 ETH
    uint256 public constant K = 0.0000000001 ether;       // 二次方系数 (调小一点避免涨太快)
    uint256 public constant SCALE = 1e18;                 // Token decimals
    
    // 手续费
    uint256 public constant FEE_PERCENT = 100;            // 1% (basis points)
    uint256 public constant BASIS_POINTS = 10000;
    
    // Strategy metadata
    string public ipfsHash;           // IPFS hash of .tradingflow file
    address public creator;
    uint256 public createdAt;
    
    // Virtual market cap for display
    uint256 public virtualMarketCap;
    
    // ============ Events ============
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Buy(address indexed buyer, uint256 ethAmount, uint256 tokenAmount, uint256 newPrice);
    event Sell(address indexed seller, uint256 tokenAmount, uint256 ethAmount, uint256 newPrice);
    event PriceUpdate(uint256 newPrice, uint256 marketCap);
    
    // ============ Constructor ============
    constructor(
        string memory _name,
        string memory _symbol,
        string memory _ipfsHash,
        address _creator
    ) {
        name = _name;
        symbol = _symbol;
        ipfsHash = _ipfsHash;
        creator = _creator;
        createdAt = block.timestamp;
    }
    
    // ============ Core Functions ============
    
    /// @notice Buy tokens with ETH
    /// @dev Calculates tokens based on quadratic bonding curve
    function buy() external payable {
        require(msg.value > 0, "Must send ETH");
        
        uint256 fee = (msg.value * FEE_PERCENT) / BASIS_POINTS;
        uint256 ethForTokens = msg.value - fee;
        
        // Calculate how many tokens can be bought using quadratic formula
        uint256 tokensToMint = calculateBuyReturn(ethForTokens);
        require(tokensToMint > 0, "Not enough ETH for any tokens");
        
        // Mint tokens
        _mint(msg.sender, tokensToMint);
        
        // Update virtual market cap
        virtualMarketCap = getCurrentPrice() * totalSupply / SCALE;
        
        // Send fee to creator
        if (fee > 0) {
            (bool sent, ) = creator.call{value: fee}("");
            require(sent, "Fee transfer failed");
        }
        
        emit Buy(msg.sender, msg.value, tokensToMint, getCurrentPrice());
        emit PriceUpdate(getCurrentPrice(), virtualMarketCap);
    }
    
    /// @notice Sell tokens for ETH
    /// @param amount Amount of tokens to sell
    function sell(uint256 amount) external {
        require(amount > 0, "Amount must be > 0");
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        
        // Calculate ETH to return using integral
        uint256 ethToReturn = calculateSellReturn(amount);
        require(ethToReturn > 0, "No ETH to return");
        require(address(this).balance >= ethToReturn, "Insufficient contract balance");
        
        uint256 fee = (ethToReturn * FEE_PERCENT) / BASIS_POINTS;
        uint256 ethAfterFee = ethToReturn - fee;
        
        // Burn tokens
        _burn(msg.sender, amount);
        
        // Update virtual market cap
        virtualMarketCap = totalSupply > 0 ? getCurrentPrice() * totalSupply / SCALE : 0;
        
        // Transfer ETH
        (bool sent, ) = msg.sender.call{value: ethAfterFee}("");
        require(sent, "ETH transfer failed");
        
        // Send fee to creator
        if (fee > 0) {
            (bool feeSent, ) = creator.call{value: fee}("");
            require(feeSent, "Fee transfer failed");
        }
        
        emit Sell(msg.sender, amount, ethAfterFee, getCurrentPrice());
        emit PriceUpdate(getCurrentPrice(), virtualMarketCap);
    }
    
    // ============ Price Calculations (Quadratic) ============
    
    /// @notice Get current token price based on supply
    /// @dev Price = BASE_PRICE + K * (Supply/SCALE)²
    /// @return Current price in wei
    function getCurrentPrice() public view returns (uint256) {
        // Price = BASE + K * S²
        // To avoid overflow: K * S * S / SCALE / SCALE
        uint256 s = totalSupply;
        uint256 quadraticPart = (K * s / SCALE) * s / SCALE;
        return BASE_PRICE + quadraticPart;
    }
    
    /// @notice Calculate tokens received for a given ETH amount
    /// @dev Uses current price - simple and effective for demo
    /// @param ethAmount Amount of ETH to spend
    /// @return Number of tokens to mint
    function calculateBuyReturn(uint256 ethAmount) public view returns (uint256) {
        // 简单方案：用当前价格计算
        // 这意味着早期买入者（价格低）获得更多代币！
        // 
        // 注意：这是简化版本，真实 AMM 会用积分
        // 但对于黑客松演示，这个行为更直观
        
        uint256 currentPrice = getCurrentPrice();
        return (ethAmount * SCALE) / currentPrice;
    }
    
    /// @notice Calculate ETH received for selling tokens
    /// @dev Uses integral of quadratic curve
    /// @param tokenAmount Amount of tokens to sell
    /// @return Amount of ETH to return
    function calculateSellReturn(uint256 tokenAmount) public view returns (uint256) {
        if (totalSupply == 0 || tokenAmount > totalSupply) return 0;
        
        // 用中点价格估算
        uint256 midSupply = totalSupply - tokenAmount / 2;
        uint256 midPrice = BASE_PRICE + (K * midSupply / SCALE) * midSupply / SCALE;
        
        return (tokenAmount * midPrice) / SCALE;
    }
    
    /// @notice Get price at a specific supply level (for charts)
    /// @param supply The supply level to query
    /// @return Price at that supply
    function getPriceAtSupply(uint256 supply) external pure returns (uint256) {
        uint256 quadraticPart = (K * supply / SCALE) * supply / SCALE;
        return BASE_PRICE + quadraticPart;
    }
    
    // ============ ERC20-like Functions ============
    
    function transfer(address to, uint256 amount) external returns (bool) {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        emit Transfer(msg.sender, to, amount);
        return true;
    }
    
    // ============ Internal Functions ============
    
    function _mint(address to, uint256 amount) internal {
        totalSupply += amount;
        balanceOf[to] += amount;
        emit Transfer(address(0), to, amount);
    }
    
    function _burn(address from, uint256 amount) internal {
        balanceOf[from] -= amount;
        totalSupply -= amount;
        emit Transfer(from, address(0), amount);
    }
    
    // ============ View Functions ============
    
    /// @notice Get fund info for frontend
    function getFundInfo() external view returns (
        string memory _name,
        string memory _symbol,
        string memory _ipfsHash,
        address _creator,
        uint256 _totalSupply,
        uint256 _price,
        uint256 _marketCap,
        uint256 _createdAt
    ) {
        return (
            name,
            symbol,
            ipfsHash,
            creator,
            totalSupply,
            getCurrentPrice(),
            virtualMarketCap,
            createdAt
        );
    }
    
    /// @notice Get curve parameters for frontend display
    function getCurveParams() external pure returns (
        uint256 basePrice,
        uint256 k,
        string memory formula
    ) {
        return (BASE_PRICE, K, "Price = 0.0001 + 0.0000000001 * Supply^2");
    }
    
    // Allow contract to receive ETH
    receive() external payable {}
}
