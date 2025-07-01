# 🌐 100% On-Chain P2P Crypto-Fiat Exchange on Internet Computer

A fully decentralized, censorship-resistant platform built entirely on Internet Computer (ICP) that enables peer-to-peer exchange of cryptocurrencies for fiat — without intermediaries, without KYC, and without centralized custody.

---

## 🚀 Overview

This project provides a fully on-chain order book system that connects people who want to exchange crypto and fiat directly, securely, and privately. The system is built using Internet Computer’s canister smart contracts, enabling a trustless environment with no reliance on external servers or traditional finance infrastructure.

The main goal is to provide an alternative financial layer for users in countries facing inflation, capital controls, or banking restrictions, where privacy and freedom to transact are essential.

---

## 🔐 Key Features

- **100% On-chain Logic:** All application logic, data storage, and interaction handled inside ICP canisters.
- **Peer-to-Peer Exchange:** Users can post and accept trade offers freely and directly.
- **No KYC / Full Privacy:** No identity verification or personal data required. Your financial freedom, your choice.
- **Censorship-Resistant:** Designed to be accessible globally, even in restrictive jurisdictions.
- **Vault-based Asset Escrow:** On-chain locking mechanisms ensure fairness during transactions.
- **Dispute Handling:** Built-in logic for appealing and resolving disputes between users.
- **Low Fees:** Thanks to the scalability and low cost of the Internet Computer blockchain.

---

## 🛠️ Tech Stack

- **Smart Contracts:** Rust on ICP canisters
- **Frontend:** React + Vite + Tailwind
- **Storage:** Stable memory within canisters (on-chain DB)
- **Identity & Auth:** Internet Identity / NFID

---

## 💡 Why This Matters

Centralized crypto-fiat ramps often require invasive KYC, are limited by borders, and subject to government control or surveillance. This project flips that model by offering:

- Unrestricted global access
- User-controlled privacy
- Freedom to exchange value across borders
- A step toward real crypto adoption in the real world

---

## 🧱 Architecture

- **Crypto OrderBook Canister:** Manages creation and listing of buy/sell Crypto orders.
- **Crypto <> FIAT OrderBook Canister:** Manages creation and listing of buy/sell FIAT orders.
- **Vault Canister:** Secure escrow vault for temporarily locking crypto assets.
- **Matchmaking Logic:** Handles order matching and state transitions.
- **Dispute Resolution Module:** Integrates with [Kleros](https://kleros.io), an Ethereum-based decentralized arbitration protocol. In case of conflict, either party can escalate the dispute to Kleros, where a randomly selected jury will review the case and issue a binding on-chain verdict.
- **Frontend DApp:** Interface for listing, accepting and managing trades.

---

## 📽️ Upcoming Deliverables

- 🛠️ DApp
- 🔜 Whitepaper
- 🔜 Demo Video
- 🔜 UI Screens
- 🔜 Pitch Deck

---

## 👥 Team

- Developers
- Designers
- Technical Writer / Content Lead (we're looking!)

---

## 🌍 Get Involved

We’re building something important — censorship-resistant, user-controlled, open finance. If this resonates with you, feel free to open an issue, fork the repo, or reach out to contribute.

> **Contact via Telegram:** @rappanui98

<!-- > **Twitter:** [@your_handle_here]   -->
<!-- > **Hackathon:** Internet Computer Global Hackathon 2025 -->
