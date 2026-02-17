# Smart Contract Deployment

1. Go to [Remix IDE](https://remix.ethereum.org/).
2. Create a new file `SupplyChain.sol`.
3. Copy the content from `contracts/SupplyChain.sol`.
4. Compile the contract (Ctrl+S or Cmd+S).
5. Go to the "Deploy & Run Transactions" tab.
6. Select "Injected Provider - MetaMask" (ensure you are on a testnet like Sepolia or a local Hardhat node).
7. Click "Deploy".
8. **IMPORTANT:** Copy the "Deployed Contract Address" and the "ABI" (from the Compiler tab).
9. You will need to paste the Address and ABI into `public/js/app.js` (which we will create next).
