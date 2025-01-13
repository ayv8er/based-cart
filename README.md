# Based Cart Manager

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-brightgreen.svg)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Demo](#demo)
- [Dependencies](#dependencies)
- [Directory Structure](#directory-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Overview

**Based Cart** is a decentralized application (dApp) that allows users to create, manage, and fund shopping carts using smart contracts on Base with native USDC. Leveraging technologies like React, TypeScript, Wagmi, and React Query, the app provides a seamless interface for interacting with smart contracts, handling transactions, and ensuring data consistency through efficient caching and state management.

## Features

- **Create Carts:** Users can create new shopping carts by specifying cart names, funding amounts, and items.
- **Manage Carts:** View and manage both owned and other users' carts, including funding, withdrawing, and deleting items.
- **Smart Contract Integration:** Seamlessly interact with Base smart contracts for cart creation, funding, and management.
- **Real-time Data Refetching:** Automatically refetch and update cart data upon successful transactions to maintain UI consistency.
- **User-Friendly Interface:** Intuitive UI components for easy navigation and interaction.

## Demo

## Dependencies

The application relies on a combination of frontend libraries, blockchain interaction tools, and utility packages to deliver its functionality.

### Core Dependencies

- **React:** A JavaScript library for building user interfaces.
- **TypeScript:** A strongly typed programming language that builds on JavaScript.
- **Wagmi:** React Hooks library for Ethereum.
- **Viem:** TypeScript-first Ethereum library for interacting with smart contracts.
- **React Query:** Data-fetching and state management library for React applications.
- **Ethers:** A library for interacting with the Ethereum blockchain.

### Other Dependencies

- **@heroicons/react:** A set of free MIT-licensed high-quality SVG icons for React.
- **Tailwind CSS:** A utility-first CSS framework for rapidly building custom designs.
- **Viem:** For interacting with Ethereum contracts and utilities like `formatUnits` and `getAddress`.

### Development Dependencies

- **ESLint:** A pluggable linting utility for JavaScript and TypeScript.
- **Prettier:** An opinionated code formatter.
- **React Query Devtools:** Devtools for React Query to monitor queries and mutations.

## Directory Structure

```bash
based-cart-manager/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── NewCartModal.tsx
│   │   ├── CartList.tsx
│   │   └── CartItem.tsx
│   ├── hooks/
│   │   ├── useBasedCartFactory.ts
│   │   ├── useBasedCart.ts
│   │   └── useAllBasedCarts.ts
│   ├── ethereum/
│   │   ├── abi/
│   │   │   ├── BasedCartFactory.json
│   │   │   └── BasedCart.json
│   │   └── contracts/
│   │       ├── BasedCartFactory.sol
│   │       └── BasedCart.sol
│   ├── queryKeys.ts
│   ├── App.tsx
│   ├── index.tsx
│   └── styles/
│       └── globals.css
├── .eslintrc.js
├── .prettierrc
├── tsconfig.json
├── package.json
├── README.md
└── yarn.lock
```

### File Descriptions

#### `public/`

- **`index.html`**: The main HTML file that serves the React application.
- **`favicon.ico`**: The favicon for the application.

#### `src/`

##### `components/`

- **`NewCartModal.tsx`**: A React component that provides a modal interface for creating new carts. It includes form validation, item management, and handles the submission process to create a cart via smart contracts.

  ```typescript
  // src/components/NewCartModal.tsx
  ```

- **`CartList.tsx`**: Displays a list of all carts, distinguishing between those owned by the user and others. Integrates with hooks to fetch and display cart data.
- **`CartItem.tsx`**: Represents an individual cart item within the `CartList`. Provides functionalities like viewing details, funding, and managing individual carts.

##### `hooks/`

- **`useBasedCartFactory.ts`**: A custom React hook that interacts with the `BasedCartFactory` smart contract. It manages the creation of new carts, handles USDC approvals, and fetches all cart addresses.

  ```typescript
  // src/hooks/useBasedCartFactory.ts
  ```

- **`useBasedCart.ts`**: Manages interactions with a specific `BasedCart` contract. Includes functionalities such as funding a cart, withdrawing funds, deleting items, and handling delivery states.

  ```typescript
  // src/hooks/useBasedCart.ts
  ```

- **`useAllBasedCarts.ts`**: Fetches and manages data for all carts from the blockchain. Separates carts owned by the user from others and ensures real-time data consistency using React Query.

  ```typescript
  // src/hooks/useAllBasedCarts.ts
  ```

##### `ethereum/`

- **`abi/`**: Contains ABI (Application Binary Interface) JSON files for smart contracts.
  - **`BasedCartFactory.json`**: ABI for the `BasedCartFactory` smart contract.
  - **`BasedCart.json`**: ABI for the `BasedCart` smart contract.
- **`contracts/`**: Contains Solidity (`.sol`) files for smart contracts.
  - **`BasedCartFactory.sol`**: Solidity code for the cart factory contract.
  - **`BasedCart.sol`**: Solidity code for individual cart contracts.

##### Other Files

- **`queryKeys.ts`**: Centralizes the definition of query keys used across React Query hooks to ensure consistency in caching and refetching.

  ```typescript
  // src/queryKeys.ts
  ```

- **`App.tsx`**: The root React component that sets up the application structure, including context providers and routing.
- **`index.tsx`**: The entry point of the React application, rendering the `App` component into the DOM.
- **`styles/globals.css`**: Global CSS styles, including Tailwind CSS configurations.

#### Root Configuration Files

- **`.eslintrc.js`**: Configuration file for ESLint, defining linting rules and environments.
- **`.prettierrc`**: Configuration file for Prettier, specifying code formatting options.
- **`tsconfig.json`**: TypeScript configuration file, setting compiler options and project structure.
- **`package.json`**: Lists project dependencies, scripts, and metadata.
- **`README.md`**: This documentation file.
- **`yarn.lock`**: Yarn lockfile ensuring consistent dependency installations.

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/based-cart-manager.git
   cd based-cart-manager
   ```

2. **Install Dependencies**

   Using **Yarn**:

   ```bash
   yarn install
   ```

   Or using **npm**:

   ```bash
   npm install
   ```

3. **Configure Environment Variables**

   Create a `.env` file in the root directory and add necessary environment variables, such as:

   ```env
   NEXT_PUBLIC_BASE_RPC_URL=
   NEXT_PUBLIC_ONCHAINKIT_API_KEY=
   ```

4. **Start the Development Server**

   Using **Yarn**:

   ```bash
   yarn start
   ```

   Or using **npm**:

   ```bash
   npm start
   ```

   The app will be available at `http://localhost:3000`.

## Usage

1. **Connect Wallet**

   - Upon launching the app, connect your Base wallet (e.g., Coinbase Wallet) to interact with the dApp.

2. **Create a New Cart**

   - Navigate to the "Create Cart" section.
   - Enter the cart name, specify the funding amount, and add items.
   - Approve USDC transactions if prompted.
   - Submit the form to create a new cart on the blockchain.

3. **Manage Carts**

   - View your own carts and others' carts under the "My Carts" and "Other Carts" sections.
   - Fund carts, withdraw funds, delete items, and manage delivery states as needed.

4. **Monitor Transactions**

   - View transaction statuses and confirmations within the app interface.
   - Use React Query Devtools (if enabled) for detailed insights into query and mutation states.

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. **Fork the Repository**

2. **Create a Feature Branch**

   ```bash
   git checkout -b feature/YourFeatureName
   ```

3. **Commit Your Changes**

   ```bash
   git commit -m "Add your message here"
   ```

4. **Push to the Branch**

   ```bash
   git push origin feature/YourFeatureName
   ```

5. **Open a Pull Request**

   Submit a pull request detailing the changes and the purpose behind them.

## License

This project is licensed under the [MIT License](./LICENSE).

---
