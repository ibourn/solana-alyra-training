# Solana - Executive Overview

## Introduction

Solana is a high-performance, low-latency blockchain designed for speed, efficiency, and user experience. With the capability of processing **thousands of transactions per second** and a block time of **400 milliseconds**, it offers cost-effective transaction fees that are fractions of a cent. Solana's architecture is integrated, enabling composability among applications built on the blockchain, allowing them to interact seamlessly without the need for bridging or separate chain IDs.

### Key Metrics

- **RPCs:** 3,000+
- **Validators:** 1,500+
- **Global Base of Apps & Users**

## Key Concepts

- **Integrated Architecture:** Leverages the founding team's experience in distributed systems, ensuring that software does not hinder hardware performance.
- **Composability:** Applications can easily interact and build on each other within the unified ecosystem.
- **User Experience:** Simplifies the interaction with the blockchain, avoiding fragmentation of liquidity.

## Transaction Lifecycle

Understanding Solana primarily revolves around the lifecycle of a transaction:

1. **Initiation:** Users initiate transactions sent to the current lead block producer, known as the leader.
2. **Block Compilation:** The leader compiles transactions into a block, executing and updating the blockchain's state.
3. **Propagation:** The block is propagated throughout the network for validation and confirmation by other validators.

Changes to the Solana protocol undergo a transparent process via a **Solana Improvement Document (SIMD)**, which is publicly critiqued and voted on by the network.

### Six Stages Framework

The report references a six-stage framework to understand the relationships between Solana's core elements. While this framework is useful, it has limitations and does not fully encompass the complexity of Solana as a distributed system.

## Users

> “Solana has the potential to be the Apple of crypto.”  
> — Raj Gokal, Solana co-founder

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

## Conclusion

Solana's architecture and transaction model prioritize speed, efficiency, and user experience, positioning it as a leading blockchain solution in the crypto space.

# Solana - Executive Overview (Suite)

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

## Conclusion

Solana’s innovative architecture and transaction processing mechanisms position it as a leading blockchain protocol focused on speed, efficiency, and user experience.
