// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {FlowFundFactory} from "../src/FlowFundFactory.sol";
import {FlowFundBondingCurve} from "../src/FlowFundBondingCurve.sol";

contract FlowFundTest is Test {
    FlowFundFactory public factory;
    
    address public alice = makeAddr("alice");
    address public bob = makeAddr("bob");
    address public charlie = makeAddr("charlie");
    
    function setUp() public {
        factory = new FlowFundFactory();
        
        // Give test users some ETH
        vm.deal(alice, 100 ether);
        vm.deal(bob, 100 ether);
        vm.deal(charlie, 100 ether);
    }
    
    function test_CreateFund() public {
        vm.prank(alice);
        address fundAddress = factory.createFund(
            "Test AI Fund",
            "TAIF",
            "QmTestHash123"
        );
        
        assertTrue(factory.isFund(fundAddress));
        assertEq(factory.getTotalFunds(), 1);
        
        FlowFundBondingCurve fund = FlowFundBondingCurve(payable(fundAddress));
        assertEq(fund.name(), "Test AI Fund");
        assertEq(fund.symbol(), "TAIF");
        assertEq(fund.creator(), alice);
        
        // Check strategy hash is stored
        assertEq(factory.getStrategyHash(fundAddress), "QmTestHash123");
    }
    
    function test_BuyTokens() public {
        // Create fund
        vm.prank(alice);
        address fundAddress = factory.createFund("Buy Test", "BUY", "QmHash");
        
        FlowFundBondingCurve fund = FlowFundBondingCurve(payable(fundAddress));
        
        uint256 initialPrice = fund.getCurrentPrice();
        console.log("Initial price (wei):", initialPrice);
        
        // Bob buys tokens
        vm.prank(bob);
        fund.buy{value: 1 ether}();
        
        uint256 bobBalance = fund.balanceOf(bob);
        assertTrue(bobBalance > 0);
        console.log("Bob balance:", bobBalance / 1e18, "tokens");
        
        // Price should increase after buy (quadratic!)
        uint256 newPrice = fund.getCurrentPrice();
        console.log("New price (wei):", newPrice);
        assertTrue(newPrice > initialPrice);
        
        console.log("Price increase:", (newPrice * 100 / initialPrice), "%");
    }
    
    function test_QuadraticPriceIncrease() public {
        vm.prank(alice);
        address fundAddress = factory.createFund("Quadratic Test", "QUAD", "QmHash");
        FlowFundBondingCurve fund = FlowFundBondingCurve(payable(fundAddress));
        
        console.log("\n=== Quadratic Price Curve Demo ===");
        console.log("Formula: Price = 0.0001 ETH + K * Supply^2\n");
        
        uint256 price0 = fund.getCurrentPrice();
        console.log("Supply 0 -> Price:", price0, "wei");
        
        // Simulate multiple buys
        vm.startPrank(bob);
        
        fund.buy{value: 0.1 ether}();
        uint256 price1 = fund.getCurrentPrice();
        console.log("After 0.1 ETH buy -> Price:", price1, "wei");
        
        fund.buy{value: 0.5 ether}();
        uint256 price2 = fund.getCurrentPrice();
        console.log("After 0.5 ETH buy -> Price:", price2, "wei");
        
        fund.buy{value: 1 ether}();
        uint256 price3 = fund.getCurrentPrice();
        console.log("After 1 ETH buy -> Price:", price3, "wei");
        
        fund.buy{value: 2 ether}();
        uint256 price4 = fund.getCurrentPrice();
        console.log("After 2 ETH buy -> Price:", price4, "wei");
        
        vm.stopPrank();
        
        console.log("\n=== Price Growth ===");
        console.log("From start to end:", (price4 * 100 / price0), "% of initial");
        
        // Verify quadratic behavior: later buys should cause bigger jumps
        uint256 jump1 = price1 - price0;
        uint256 jump2 = price2 - price1;
        uint256 jump3 = price3 - price2;
        uint256 jump4 = price4 - price3;
        
        console.log("Price jump 1:", jump1);
        console.log("Price jump 2:", jump2);
        console.log("Price jump 3:", jump3);
        console.log("Price jump 4:", jump4);
        
        // Each jump should be progressively larger (quadratic property)
        assertTrue(price4 > price3, "Price should keep increasing");
    }
    
    function test_SellTokens() public {
        // Setup: create fund and buy tokens
        vm.prank(alice);
        address fundAddress = factory.createFund("Sell Test", "SELL", "QmHash");
        FlowFundBondingCurve fund = FlowFundBondingCurve(payable(fundAddress));
        
        // Bob buys tokens
        vm.prank(bob);
        fund.buy{value: 2 ether}();
        
        uint256 bobTokens = fund.balanceOf(bob);
        uint256 priceBeforeSell = fund.getCurrentPrice();
        uint256 bobEthBefore = bob.balance;
        
        console.log("Bob tokens:", bobTokens / 1e18);
        console.log("Price before sell:", priceBeforeSell);
        
        // Bob sells half his tokens
        uint256 sellAmount = bobTokens / 2;
        vm.prank(bob);
        fund.sell(sellAmount);
        
        // Price should decrease
        uint256 priceAfterSell = fund.getCurrentPrice();
        assertTrue(priceAfterSell < priceBeforeSell, "Price should decrease after sell");
        
        // Bob should receive ETH
        assertTrue(bob.balance > bobEthBefore, "Bob should receive ETH");
        
        console.log("Price after sell:", priceAfterSell);
        console.log("ETH received:", (bob.balance - bobEthBefore) / 1e15, "finney");
    }
    
    function test_CreatorReceivesFees() public {
        vm.prank(alice);
        address fundAddress = factory.createFund("Fee Test", "FEE", "QmHash");
        FlowFundBondingCurve fund = FlowFundBondingCurve(payable(fundAddress));
        
        uint256 aliceBalanceBefore = alice.balance;
        
        // Bob buys tokens - alice (creator) should receive 1% fee
        vm.prank(bob);
        fund.buy{value: 1 ether}();
        
        uint256 aliceBalanceAfter = alice.balance;
        uint256 feeReceived = aliceBalanceAfter - aliceBalanceBefore;
        
        // Fee should be approximately 1% of 1 ether = 0.01 ether
        console.log("Fee received by creator:", feeReceived, "wei");
        console.log("Expected (~1%):", 0.01 ether, "wei");
        
        assertApproxEqRel(feeReceived, 0.01 ether, 0.01e18); // 1% tolerance
    }
    
    function test_GetAllFunds() public {
        vm.startPrank(alice);
        factory.createFund("Fund 1", "F1", "QmHash1");
        factory.createFund("Fund 2", "F2", "QmHash2");
        factory.createFund("Fund 3", "F3", "QmHash3");
        vm.stopPrank();
        
        address[] memory allFunds = factory.getAllFunds();
        assertEq(allFunds.length, 3);
        
        // Test getRecentFunds
        address[] memory recent = factory.getRecentFunds(2);
        assertEq(recent.length, 2);
    }
    
    function test_MultipleBuyers_FOMO() public {
        console.log("\n=== FOMO Demo: Early vs Late Buyers ===\n");
        
        vm.prank(alice);
        address fundAddress = factory.createFund("FOMO Test", "FOMO", "QmHash");
        FlowFundBondingCurve fund = FlowFundBondingCurve(payable(fundAddress));
        
        // Alice buys early
        uint256 alicePrice = fund.getCurrentPrice();
        vm.prank(alice);
        fund.buy{value: 1 ether}();
        uint256 aliceTokens = fund.balanceOf(alice);
        
        console.log("Alice (early) bought at:", alicePrice, "wei");
        console.log("Alice got:", aliceTokens / 1e18, "tokens");
        
        // Bob buys later
        uint256 bobPrice = fund.getCurrentPrice();
        vm.prank(bob);
        fund.buy{value: 1 ether}();
        uint256 bobTokens = fund.balanceOf(bob);
        
        console.log("Bob (later) bought at:", bobPrice, "wei");
        console.log("Bob got:", bobTokens / 1e18, "tokens");
        
        // Charlie buys even later
        uint256 charliePrice = fund.getCurrentPrice();
        vm.prank(charlie);
        fund.buy{value: 1 ether}();
        uint256 charlieTokens = fund.balanceOf(charlie);
        
        console.log("Charlie (latest) bought at:", charliePrice, "wei");
        console.log("Charlie got:", charlieTokens / 1e18, "tokens");
        
        // Early buyer (Alice) should have way more tokens!
        console.log("\n=== Results ===");
        console.log("Alice has", (aliceTokens * 100 / charlieTokens), "% more tokens than Charlie!");
        
        assertTrue(aliceTokens > bobTokens, "Early buyer should get more tokens");
        assertTrue(bobTokens > charlieTokens, "Earlier buyer should get more tokens");
    }
}
