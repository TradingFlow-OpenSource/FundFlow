// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {FlowFundFactory} from "../src/FlowFundFactory.sol";

contract DeployScript is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy Factory (Registry is now merged in)
        FlowFundFactory factory = new FlowFundFactory();
        console.log("FlowFundFactory deployed at:", address(factory));
        
        vm.stopBroadcast();
        
        // Log summary
        console.log("\n=== Deployment Summary ===");
        console.log("Factory:", address(factory));
        console.log("\nTo create a fund, call:");
        console.log("  factory.createFund(name, symbol, ipfsHash)");
    }
}

/// @notice Script to create a test fund (for demo)
contract CreateTestFund is Script {
    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address factoryAddress = vm.envAddress("FACTORY_ADDRESS");
        
        vm.startBroadcast(deployerPrivateKey);
        
        FlowFundFactory factory = FlowFundFactory(factoryAddress);
        
        // Create a test fund
        address newFund = factory.createFund(
            "AI Momentum Alpha",
            "MOMENTUM",
            "QmTestIpfsHash123456789"  // Replace with real IPFS hash
        );
        
        console.log("New fund created at:", newFund);
        
        vm.stopBroadcast();
    }
}
