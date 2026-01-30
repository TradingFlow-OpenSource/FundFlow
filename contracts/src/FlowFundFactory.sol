// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {FlowFundBondingCurve} from "./FlowFundBondingCurve.sol";

/// @title FlowFundFactory
/// @notice Factory contract to deploy new FlowFund tokens
/// @dev Entry point for creating AI strategy funds (Registry merged in)
contract FlowFundFactory {
    // ============ State Variables ============
    
    /// @notice Array of all deployed fund addresses
    address[] public allFunds;
    
    /// @notice Mapping from creator to their funds
    mapping(address => address[]) public fundsByCreator;
    
    /// @notice Mapping to check if address is a valid fund
    mapping(address => bool) public isFund;
    
    /// @notice Mapping from fund to IPFS hash (merged from Registry)
    mapping(address => string) public strategyHashes;
    
    // ============ Events ============
    
    event FundCreated(
        address indexed fundAddress,
        address indexed creator,
        string name,
        string symbol,
        string ipfsHash,
        uint256 timestamp
    );
    
    // ============ Core Functions ============
    
    /// @notice Create a new FlowFund token with bonding curve
    /// @param name Token name (e.g., "AI Alpha Strategy")
    /// @param symbol Token symbol (e.g., "AIALPHA")
    /// @param ipfsHash IPFS hash of .tradingflow configuration file
    /// @return fundAddress Address of the newly deployed fund
    function createFund(
        string memory name,
        string memory symbol,
        string memory ipfsHash
    ) external returns (address fundAddress) {
        // Validate inputs
        require(bytes(name).length > 0, "Name required");
        require(bytes(symbol).length > 0, "Symbol required");
        require(bytes(ipfsHash).length > 0, "IPFS hash required");
        
        // Deploy new bonding curve token
        FlowFundBondingCurve newFund = new FlowFundBondingCurve(
            name,
            symbol,
            ipfsHash,
            msg.sender
        );
        
        fundAddress = address(newFund);
        
        // Register the fund
        allFunds.push(fundAddress);
        fundsByCreator[msg.sender].push(fundAddress);
        isFund[fundAddress] = true;
        strategyHashes[fundAddress] = ipfsHash;  // Store in factory too for easy lookup
        
        emit FundCreated(
            fundAddress,
            msg.sender,
            name,
            symbol,
            ipfsHash,
            block.timestamp
        );
        
        return fundAddress;
    }
    
    // ============ View Functions ============
    
    /// @notice Get total number of funds created
    function getTotalFunds() external view returns (uint256) {
        return allFunds.length;
    }
    
    /// @notice Get all fund addresses
    function getAllFunds() external view returns (address[] memory) {
        return allFunds;
    }
    
    /// @notice Get paginated list of funds (for frontend)
    /// @param offset Starting index
    /// @param limit Number of funds to return
    function getFundsPaginated(uint256 offset, uint256 limit) 
        external 
        view 
        returns (address[] memory funds) 
    {
        uint256 totalFunds = allFunds.length;
        
        if (offset >= totalFunds) {
            return new address[](0);
        }
        
        uint256 end = offset + limit;
        if (end > totalFunds) {
            end = totalFunds;
        }
        
        funds = new address[](end - offset);
        for (uint256 i = offset; i < end; i++) {
            funds[i - offset] = allFunds[i];
        }
        
        return funds;
    }
    
    /// @notice Get funds created by a specific address
    function getFundsByCreator(address creator) external view returns (address[] memory) {
        return fundsByCreator[creator];
    }
    
    /// @notice Get IPFS hash for a fund (from merged Registry)
    function getStrategyHash(address fundAddress) external view returns (string memory) {
        return strategyHashes[fundAddress];
    }
    
    /// @notice Get fund info in batch (for FundList page)
    /// @param fundAddresses Array of fund addresses to query
    function getBatchFundInfo(address[] calldata fundAddresses) 
        external 
        view 
        returns (
            string[] memory names,
            string[] memory symbols,
            uint256[] memory prices,
            uint256[] memory marketCaps,
            address[] memory creators
        ) 
    {
        uint256 len = fundAddresses.length;
        names = new string[](len);
        symbols = new string[](len);
        prices = new uint256[](len);
        marketCaps = new uint256[](len);
        creators = new address[](len);
        
        for (uint256 i = 0; i < len; i++) {
            FlowFundBondingCurve fund = FlowFundBondingCurve(payable(fundAddresses[i]));
            names[i] = fund.name();
            symbols[i] = fund.symbol();
            prices[i] = fund.getCurrentPrice();
            marketCaps[i] = fund.virtualMarketCap();
            creators[i] = fund.creator();
        }
        
        return (names, symbols, prices, marketCaps, creators);
    }
    
    /// @notice Get recent funds (for homepage "Hot Funds")
    /// @param count Number of recent funds to return
    function getRecentFunds(uint256 count) external view returns (address[] memory) {
        uint256 total = allFunds.length;
        if (count > total) count = total;
        
        address[] memory recent = new address[](count);
        for (uint256 i = 0; i < count; i++) {
            recent[i] = allFunds[total - 1 - i];  // Reverse order (newest first)
        }
        return recent;
    }
}
