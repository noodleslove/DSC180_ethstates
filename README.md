# EthStates
Blockchain technology has revolutionized various industries, offering secure and transparent record-keeping. This project explores the application of blockchain in real estate transactions, aiming to provide a decentralized platform for buying, selling, and financing properties. By leveraging blockchain, the project enhances security, reduces transaction costs, and streamlines the real estate process.

## Features
- NFT Property Ownership: Each property is represented as a non-fungible token (NFT) minted by the owner, ensuring proof of ownership and facilitating transactions.
- Smart Contract Transactions: Smart contracts handle transactions, including sales and financing agreements, ensuring transparency and security.
- MetaMask Integration: Users interact with the platform using MetaMask wallets, providing a secure and verified identity for all parties involved.
- Listing and Bidding: Sellers can list their properties with details such as address, square footage, and price. Buyers can browse listings and place bids or purchase at the listed price.
- Loan Request and Approval: Buyers can request loans from verified lenders, specifying the loan amount, interest rate, and repayment terms. Lenders can approve loan requests, and smart contracts manage loan repayment.
-
## Technology Stack
- Blockchain Network: Developed on the Polygon network, leveraging the Mumbai test network for testing purposes.
- Smart Contracts: Implemented using Solidity, with the openzeppelin framework for security and efficiency.
- Frontend: Built with React and TypeScript, providing a user-friendly interface for interacting with the marketplace.
- Backend: Utilizes InterPlanetary File System (IPFS) for storing property metadata and Pinata API for IPFS integration.
- Development Tools: Hardhat and Remix for Solidity development and testing, with GitHub for version control and collaboration.
-
## Get Started
### Prerequisites
- npm
  ```shell
  npm install npm@latest -g
  ```
- A digital wallet. [Coinbase Wallet](https://www.coinbase.com/wallet) or [Metamask](https://metamask.io/) is preferred, having them listening to port `8545`
- Get a private key from [PolygonScan](https://polygonscan.com/) to deploy smart contract
- Get a private key from [Pinata](https://www.pinata.cloud/) to store NFT metadata
- Get a lookup url from [Alchemy](https://www.alchemy.com/)

### Installation
1. Clone the repo
    ```sh
    git clone https://github.com/noodleslove/DSC180_ethstates.git
    ``` 
2. Install the package
    ```sh
    npm install
    ```
3. Create a `.env` file under root directory, and add the keys you get from your digital wallet, [PolygonScan](https://polygonscan.com/), and [Alchemy](https://www.alchemy.com/)
   ```dotenv
   WALLET_PRIVATE_KEY=
   ALCHEMY_AMONY_URL=
   POLYGONSCAN_KEY=
   ```
4. run the command to deploy the contract:
    ```sh
    npx hardhat run scripts/deployProxy.ts --network localhost
    ```
   You will get an implementation address looks like `0x...` and then run the command
    ```sh
    npx hardhat verify [Your Implementation Address Here]
    ```
5. Go to the `frontend` directory
    ```sh
    cd frontend
    ```
   install the dependencies
    ```sh
   npm install
   ```
   create a file `.env` under current directory `frontend`, and add your pinata JWT
   ```dotenv
   VITE_PINATA_JWT=
   VITE_PINATA_GATEWAY=
   VITE_MARKETPLACE_DEFAULT_ADDRESS=
   VITE_ALCHEMY_AMONY_URL=
   ```
   and run the application
   ```shell
   npm run dev
    ```
   Your application should run on [http://localhost:5173/](http://localhost:5173/) now.

