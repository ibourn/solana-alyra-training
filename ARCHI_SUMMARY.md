# Solana Architecture Guide

# Table of Contents

- [Introduction](#introduction)
  - [Key Metrics](#key-metrics)
- [Key Concepts](#key-concepts)
- [Transaction Lifecycle](#transaction-lifecycle)
- [Users](#users)
  - [User Journey](#user-journey)
  - [Account Structure](#account-structure)
  - [Transaction Signing](#transaction-signing)
  - [Transaction Structure](#transaction-structure)
  - [Costs and Fees](#costs-and-fees)
  - [Failed Transactions](#failed-transactions)
- [Gulf Stream](#gulf-stream)
  - [RPCs and SW QoS](#rpc-and-sw-qos)
  - [Clusters](#clusters)
  - [QUIC Networking Protocol](#quic-networking-protocol)
- [Block Building](#block-building)
- [Clients](#clients)
- [Proof of History (PoH)](#proof-of-history-poh)
- [Accounts Model](#accounts-model)
  - [Ownership and Program Derived Addresses (PDAs)](#ownership-and-program-derived-addresses-pdas)
- [Turbine](#turbine)
- [Consensus](#consensus)
  - [Transaction Status](#transaction-status)
- [Gossip & Archive](#gossip--archive)
  - [Gossip Network](#gossip-network)
  - [Archive Mechanism](#archive-mechanism)
- [Economics & Jito](#economics--jito)
  - [Staking Economics](#staking-economics)
  - [Voting and Rewards](#voting-and-rewards)
  - [Block Rewards](#block-rewards)
  - [Liquid Staking](#liquid-staking)
  - [Jito](#jito)

## Introduction

Solana is a high-performance, low-latency blockchain designed for speed, efficiency, and user experience. With the capability of processing **thousands of transactions per second** and a block time of **400 milliseconds**, it offers cost-effective transaction fees that are fractions of a cent. Solana's architecture is integrated, enabling composability among applications built on the blockchain, allowing them to interact seamlessly without the need for bridging or separate chain IDs.

### Key Metrics

- **RPCs:** 3,000+
- **Validators:** 1,500+-

## Key Concepts

- **Integrated Architecture:** Leverages the founding team's experience in distributed systems, ensuring that software does not hinder hardware performance.
- **Composability:** Applications can easily interact and build on each other within the unified ecosystem.
- **User Experience:** Simplifies the interaction with the blockchain, avoiding fragmentation of liquidity.

## Transaction Lifecycle

Understanding Solana primarily revolves around the lifecycle of a transaction:

1. **Initiation:** Users initiate transactions sent to the current lead block producer, known as the leader.
2. **Block Compilation:** The leader compiles transactions into a block, executing and updating the blockchain's state.
3. **Propagation:** The block is propagated throughout the network for validation and confirmation by other validators.

## Users

### User Journey

1. **Wallet Setup:** Users begin by setting up and funding a wallet application, available as native mobile applications or browser extensions.
2. **Keypairs Generation:** Wallets generate cryptographic keypairs consisting of:
   - **Public Key:** Unique identifier for the account.
   - **Private Key:** Access key allowing modifications to the account.

### Account Structure

A Solana account is a data structure holding user information and state related to blockchain interactions. Public keys are represented as 32-byte Base58-encoded strings, while private keys are also 32 bytes in length.

### Transaction Signing

Users sign transactions with their private key, which is included in the transaction data for verification. The process ensures that transactions have not been tampered with and are authorized by the account owner.

### Transaction Structure

A transaction message consists of four sections:

1. **Header:** References the account address list and required signatures.
2. **Account Addresses:** Lists all accounts involved in the transaction.
3. **Recent Blockhash:** Prevents duplicate and stale transactions.
4. **Instructions:** Specifies operations to be executed within the transaction.

### Costs and Fees

The cost to execute a transaction includes:

- **Base Fee:** Fixed at 5000 lamports per signature.
- **Prioritization Fee:** Optional during high demand, priced in micro-lamports per compute unit.

**Total Transaction Fee:**
Total Fee = Prioritization Fee + Base Fee

The smallest unit of SOL is a **lamport**, equivalent to one billionth of a SOL.

### Failed Transactions

The term "failed transaction" can be misleading, as these transactions incur fees but are executed as intended. Most failed transactions arise from exceeding slippage limits, mostly submitted by a small percentage of active addresses.

## Gulf Stream

### RPCs and SW QoS

- **RPCs (Remote Procedure Calls):** These are nodes that act as gateways to interact with and read data from the Solana network. They run the same software as full validators but do not hold any stake, meaning they cannot vote or build blocks. There are over **4,000 RPC nodes** on Solana.

- **Leader Selection:** Leaders are chosen for each slot (400 milliseconds) based on their stake in the network. When it is a validator's turn, they switch to "leader mode" to process transactions.

- **Stake-Weighted Quality of Service (SWQoS):** Introduced in early 2024, this mechanism prioritizes transaction messages proxied through staked validators, effectively mitigating Sybil attacks. Approximately **80%** of a leader’s capacity is reserved for SWQoS.

### Clusters

Solana operates four clusters:

- **Localnet**
- **Testnet**
- **Devnet**
- **Mainnet-beta** (where tokens hold real value)

### QUIC Networking Protocol

In late 2022, Solana adopted the **QUIC** protocol for transaction message transmission, improving rapid and asynchronous communication and addressing network disruptions caused by bot activity.

## Block Building

- **Continuous Block Building:** Solana utilizes continuous block building, assembling and streaming blocks dynamically during allocated time slots, reducing latency.

- **Transaction Processing Unit (TPU):** Upon receiving transactions, they enter the TPU, which includes:

  - **Fetch Stage:** Receives transactions via QUIC.
  - **SigVerify Stage:** Validates signatures and eliminates duplicates.
  - **Banking Stage:** The core block-building stage where the state is updated and finalized.

- **Parallel Processing:** Transactions are processed in parallel and packaged into “entries” of 64 non-conflicting transactions, allowing for efficient execution.

## Clients

- **Client Diversity:** Solana launched with the Agave client (written in Rust) and is expanding to include the Firedancer client, a rewrite in C, promising enhanced performance.

## Proof of History (PoH)

- **Functionality:** PoH acts as a clock for synchronization among validators, establishing a reliable order of events and ensuring adherence to the leader schedule. It is not a consensus algorithm but rather facilitates fast block commitment with minimal communication overhead.

- **SHA256 Properties:** PoH utilizes the SHA256 hashing algorithm, with properties such as determinism, fixed output size, efficiency, and collision resistance.

- **Ticks:** The PoH stream includes “ticks” every 6.25 milliseconds, ensuring the leader's liveness and the passage of time.

## Accounts Model

- **Accounts Database (AccountsDB):** Maintains the global state with a hashmap structure storing all accounts.

- **Types of Accounts:**

  - **User Accounts:** Generated by wallet software, containing a private key.
  - **Data Accounts:** Store state information (e.g., token balances).
  - **Program Accounts:** Contain executable bytecode.
  - **Native Program Accounts:** Pre-deployed accounts for core functionalities.

- **Rent Mechanism:** Designed to incentivize account closures to reduce state bloat, requiring a minimum balance to keep accounts active.

### Ownership and Program Derived Addresses (PDAs)

- **Ownership Model:** Ensures only authorized programs can modify account data. Lamports transfers are universally permitted.

- **PDAs:** Special accounts owned by programs rather than individual users, allowing state storage without a private key.

## Turbine

- **Data Propagation:** Turbine propagates blocks to the network by breaking transaction data into small packets called "shreds," minimizing data transmission needs and ensuring efficient communication.

- **Erasure Coding:** This technique ensures data integrity, allowing blocks to be reconstructed even if some shreds are lost.

- **Turbine Tree:** Validators are organized in a hierarchical structure, with larger staked validators positioned higher, facilitating efficient data dissemination.

## Consensus

- **Transaction Validation Unit (TVU):** After receiving a block, validators validate and replay transactions in the sequence dictated by PoH.

- **Tower BFT:** Solana's implementation of Practical Byzantine Fault Tolerance (PBFT), leveraging PoH to reduce messaging overhead and facilitate efficient consensus.

- **Forks:** The design allows for multiple blocks linked to the same parent, requiring validators to vote on which fork to adopt.

### Transaction Status

- **Processed:** Included in a block.
- **Confirmed:** Voted on by a two-thirds majority.
- **Finalized:** More than 31 blocks built on top of the transaction's block.

## Gossip & Archive

### Gossip Network

- **Control Plane:** The gossip network serves as the control plane for the Solana network, disseminating critical metadata about the blockchain's state, including contact information and vote data.
- **Communication:** Solana's gossip protocol employs informal, peer-to-peer communication using a tree broadcast method for efficient information propagation without a central source.
- **Message Types:** There are four types of gossip messages:

  - **Push:** Shares information with specific peers.
  - **Pull & Pull Response:** Checks for missed messages and retrieves them.
  - **Prune:** Reduces the number of connections a node maintains.
  - **Ping & Pong:** Health checks to confirm node activity.

- **Data Storage:** Gossip data is stored in a Cluster Replicated Data Store (CrdsTable), which needs periodic pruning due to its potential size.

### Archive Mechanism

- **State Management:** Solana does not require the entire historical ledger to determine the current state of an account, allowing validators to store only the current state without processing all past blocks.
- **Warehouse Nodes:** These nodes manage archives and maintain:
  - **Ledger Archive:** Raw ledger and AccountsDB snapshots for replay.
  - **Google Bigtable:** Stores block data from the genesis block onwards.

## Economics & Jito

### Staking Economics

- **Inflation:** Solana generates new SOL tokens each epoch to distribute staking rewards, starting at an initial rate of **8%**, decreasing by 15% annually to stabilize at **1.5%**. This leads to a wealth transfer from non-stakers to stakers.
- **Delegation:** SOL token holders can delegate their tokens to validators, indicating trust without transferring ownership.

### Voting and Rewards

- **Voting Credits:** Validators earn credits for accurate votes, costing **0.000005 SOL** per vote, with voting expenses averaging **1 SOL per day**.
- **Reward Distribution:** At the end of each epoch, total inflation rewards are allocated based on the credits earned, weighted by stake.

### Block Rewards

- Validators designated as leaders for blocks receive additional rewards, comprising **50%** of base fees and **50%** of priority fees from transactions in the block, while the remaining fees are burned.

### Liquid Staking

- **Liquid Staking Tokens (LST):** Users receive LSTs in return for staking SOL, allowing them to trade or use these tokens in the DeFi ecosystem while still earning staking rewards. Rewards are reinvested into the staking pool, increasing the value of LSTs.

## Jito

- **Jito Client:** Over **80%** of Solana's stake utilizes the Jito client, which introduces out-of-protocol blockspace auctions that provide economic incentives through tips.
- **Transaction Handling:** Transactions are routed through the Jito-Relayer, which holds them for **200 milliseconds** before forwarding, allowing for auction opportunities.
- **Blockspace Auctions:** These auctions occur off-chain, enabling searchers to submit transaction bundles, typically for time-sensitive operations. Jito charges a **5% fee** on tips.
