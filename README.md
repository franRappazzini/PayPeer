# PayPeer

# 🌐 100% On-Chain P2P Crypto-Fiat & Crypto-Crypto Exchange on Internet Computer

A fully decentralized, censorship-resistant platform built entirely on Internet Computer (ICP) that enables peer-to-peer exchange of cryptocurrencies for FIAT — **without intermediaries, without KYC, and without centralized custody**.

This project is a **fully decentralized** platform built entirely on the Internet Computer (ICP) blockchain, enabling peer-to-peer exchange of cryptocurrencies for FIAT and between cryptocurrencies without intermediaries, KYC, or centralized custody.

Leveraging ICP’s serverless architecture, the application runs entirely on-chain, with all logic, storage, and execution contained within canisters. It operates as a decentralized order book where users can create and accept trade offers between crypto and FIAT — or crypto and crypto — in a secure, direct, and trustless way.

The system is designed to maximize censorship resistance and user privacy by completely eliminating the need for identity verification (KYC). This ensures that access to financial tools remains open, permissionless, and globally available — even in restrictive or high-inflation environments.

To facilitate communication between peers during trades, the platform integrates **OpenChat**, a decentralized messaging DApp built on Internet Computer. OpenChat offers a seamless iframe integration, enabling participants to interact, negotiate, and confirm steps directly within the app interface — while staying fully on-chain.

In the case of disputes (such as fraud or payment issues), the platform leverages **Kleros**, a decentralized arbitration protocol built on Ethereum. Using **Chain Fusion** — Internet Computer’s cross-chain integration technology — the system can interact with Ethereum smart contracts, allowing users to escalate disputes to Kleros jurors and resolve them in a transparent, decentralized, and binding manner.

The platform also includes on-chain mechanisms for dispute tracking and mutual confirmation, removing the need for any centralized authority. The result is a censorship-proof, privacy-respecting infrastructure for global, real-world value exchange.

---

## 🚀 Overview

This project provides a fully on-chain order book system that connects people who want to exchange crypto and FIAT directly, securely, and privately. The system is built using Internet Computer’s canister smart contracts, enabling a trustless environment with no reliance on external servers or traditional finance infrastructure.

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

Centralized crypto-FIAT ramps often require invasive KYC, are limited by borders, and subject to government control or surveillance. This project flips that model by offering:

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
- **Dispute Resolution Module:** Integrates with [Kleros](https://kleros.io), an Ethereum-based decentralized arbitration protocol. In case of conflict, either party can escalate the dispute to Kleros, where a randomly selected jury will review the case and issue a binding on-chain verdict. The integration with Kleros is made possible through **Chain Fusion**, which allows Internet Computer canisters to interact directly with Ethereum smart contracts.
- **OpenChat Integration:** A built-in chat experience powered by [OpenChat](https://openchat.so), allowing trading peers to communicate directly via a seamless iframe integration.
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

## Canister IDs

| Canister Name | Canister ID (ic)              | Link                                                                                       |
| ------------- | ----------------------------- | ------------------------------------------------------------------------------------------ |
| Frontend      | `hse7h-diaaa-aaaah-arika-cai` | [frontend](https://hse7h-diaaa-aaaah-arika-cai.icp0.io/)                                   |
| Backend       | `hhdok-caaaa-aaaah-arijq-cai` | [backend](https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.icp0.io/?id=hhdok-caaaa-aaaah-arijq-cai) |
| Assets        | `hvfzt-oqaaa-aaaah-arikq-cai` | -                                                                                          |

## Run Locally

> Note: Make sure you have the Internet Computer SDK (`dfx`) installed and configured properly.

To run the project locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone git@github.com:franRappazzini/pay_peer.git
   cd pay_peer
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start a local replica network:

   ```bash
   dfx start --clean
   ```

4. Deploy the canisters (in a separate terminal):

   ```bash
   dfx deploy
   ```

This command will deploy the backend canister and the frontend canister to your local Internet Computer instance and will show the URLs where you can access them like:

```bash
Frontend canister via browser:
    assets:
      - http://uxrrr-q7777-77774-qaaaq-cai.localhost:4943/ (Recommended)
      - http://127.0.0.1:4943/?canisterId=uxrrr-q7777-77774-qaaaq-cai (Legacy)
    frontend:
      - http://uzt4z-lp777-77774-qaabq-cai.localhost:4943/ (Recommended)
      - http://127.0.0.1:4943/?canisterId=uzt4z-lp777-77774-qaabq-cai (Legacy)
  Backend canister via Candid interface:
    backend: http://127.0.0.1:4943/?canisterId=umunu-kh777-77774-qaaca-cai&id=u6s2n-gx777-77774-qaaba-cai
```

5. Run the frontend development server (optional):

   ```bash
   npm run dev
   ```
