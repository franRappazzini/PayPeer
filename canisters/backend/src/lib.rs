mod instructions;
mod memory;
mod states;

use crate::{instructions::ICRC1, states::STATE};
use candid::{Nat, Principal};
use ic_cdk::{query, update};
use states::*;

#[ic_cdk::init]
fn init() {
    borrow_mut(|s| s.init())
}

// --- user methods ---
#[query]
fn get_user(principal: Principal) -> Option<User> {
    borrow(|s| s.get_user(principal))
}

#[update]
fn new_user(referred_by: Option<Principal>) -> User {
    borrow_mut(|s| s.new_user(referred_by))
}

#[update]
fn edit_user(name: Option<String>, email: Option<String>) -> Option<User> {
    borrow_mut(|s| s.edit_user(name, email))
}

// --- crypto offer methods ---
#[query]
fn get_crypto_offer(id: u64) -> Option<CryptoOffer> {
    borrow(|s| s.get_crypto_offer(id))
}

#[query]
fn get_all_crypto_offers() -> Vec<CryptoOffer> {
    borrow(|s| s.get_all_crypto_offers())
}

#[update]
async fn new_crypto_offer(
    token_a: Principal,
    token_b: Principal,
    price_per_unit: u64,
    offer_limit: (u64, u64),
    visibility: OfferVisibility,
    conditions: Option<String>,
) -> CryptoOffer {
    // Ensure the caller has enough balance
    let token = ICRC1(token_a);
    let caller = ic_cdk::caller();
    let fee = token.icrc1_fee().await;
    let balance = token.icrc1_balance_of(caller).await;

    assert!(
        balance + fee >= offer_limit.0,
        "Insufficient balance (including 10% buffer) to create the offer."
    );

    borrow_mut(|s| {
        s.new_crypto_offer(
            token_a,
            token_b,
            price_per_unit,
            offer_limit,
            visibility,
            conditions,
        )
    })
}

#[update]
fn pause_crypto_offer(id: u64) -> Option<CryptoOffer> {
    borrow_mut(|s| s.pause_crypto_offer(id))
}

#[update]
fn resume_crypto_offer(id: u64) -> Option<CryptoOffer> {
    borrow_mut(|s| s.resume_crypto_offer(id))
}

#[update]
fn cancel_crypto_offer(id: u64) -> Option<CryptoOffer> {
    borrow_mut(|s| s.cancel_crypto_offer(id))
}

#[update]
async fn take_crypto_offer(id: u64, token_b_amount: Nat) -> Option<CryptoOffer> {
    // Ensure the caller has enough balance to take the offer
    let token = ICRC1(get_crypto_offer(id).expect("Offer not found").token_b);
    let caller = ic_cdk::caller();
    let fee = token.icrc1_fee().await;
    let balance = token.icrc1_balance_of(caller).await;
    assert!(
        balance + fee.clone() >= token_b_amount,
        "Insufficient balance (including 10% buffer) to take the offer."
    );

    // Ensure the canister has enough allowance to take the tokens
    // TODO (fran): change ic_cdk::id() to the vault canister id
    let allowance = token.icrc2_allowance(caller, ic_cdk::id()).await;
    assert!(
        allowance + fee >= token_b_amount,
        "Insufficient allowance to take the offer."
    );

    borrow_mut(|s| s.take_crypto_offer(id, token_b_amount))
}

#[update]
async fn escrow_crypto_token_a(id: u64) -> Option<CryptoOffer> {
    // Ensure the caller is the creator of the offer
    let offer = get_crypto_offer(id).expect("Offer not found");
    let caller = ic_cdk::caller();

    assert!(
        offer.creator == caller,
        "Only the creator can escrow the token."
    );

    // Ensure the offer is in the correct state to escrow
    assert!(
        offer.status == OfferStatus::Started,
        "Offer can only be escrowed if it is Started."
    );

    let token = ICRC1(offer.token_a);
    let fee = token.icrc1_fee().await;
    let balance = token.icrc1_balance_of(caller).await;
    let deposit_amount = offer.token_b_amount.unwrap() / offer.price_per_unit; // TODO (fran): calculate deposit amount with dapp fee + security buffer

    assert!(
        balance + fee.clone() >= deposit_amount,
        "Insufficient balance (including 10% buffer) to escrow the tokens."
    );

    // Ensure the canister has enough allowance to take the tokens
    // TODO (fran): change ic_cdk::id() to the vault canister id
    let allowance = token.icrc2_allowance(caller, ic_cdk::id()).await;
    assert!(
        allowance + fee >= deposit_amount,
        "Insufficient allowance to escrow the tokens."
    );

    // Transfer the tokens to the canister
    let tx = token
        // TODO (fran): change ic_cdk::id() to the vault canister id
        .icrc2_transfer_from(caller, ic_cdk::id(), deposit_amount)
        .await;

    borrow_mut(|s| s.escrow_crypto_token_a(id, tx))
}

#[update]
async fn escrow_crypto_token_b(id: u64) -> Option<CryptoOffer> {
    // Ensure the caller is the creator of the offer
    let offer = get_crypto_offer(id).expect("Offer not found");
    let caller = ic_cdk::caller();
    assert!(
        offer.contrapart.unwrap() == caller,
        "Only the contrapart can escrow the token."
    );
    // Ensure the offer is in the correct state to escrow
    assert!(
        offer.status == OfferStatus::TokenAEscrow,
        "Offer can only be escrowed if the creator already escrowed."
    );

    let token_b = ICRC1(offer.token_b);
    let fee = token_b.icrc1_fee().await;
    let balance = token_b.icrc1_balance_of(caller).await;
    let deposit_amount = offer.token_b_amount.unwrap(); // TODO (fran): calculate deposit amount with dapp fee + security buffer
    assert!(
        balance + fee.clone() >= deposit_amount,
        "Insufficient balance (including 10% buffer) to escrow the tokens."
    );
    // Ensure the canister has enough allowance to take the tokens
    // TODO (fran): change ic_cdk::id() to the vault canister id
    let allowance = token_b.icrc2_allowance(caller, ic_cdk::id()).await;
    assert!(
        allowance + fee >= deposit_amount,
        "Insufficient allowance to escrow the tokens."
    );

    // Transfer the tokens to the canister
    let tx = token_b
        // TODO (fran): change ic_cdk::id() to the vault canister id
        .icrc2_transfer_from(caller, ic_cdk::id(), deposit_amount.clone())
        .await;

    // Update the offer state with the escrow transaction
    borrow_mut(|s| s.escrow_crypto_token_b(id, tx));

    // Release the escrowed tokens
    let release_token_b_tx = token_b
        // TODO (fran): change ic_cdk::id() to the vault canister id
        .icrc2_transfer_from(ic_cdk::id(), offer.creator, deposit_amount.clone())
        .await;

    borrow_mut(|s| s.release_crypto_token_b(id, release_token_b_tx));

    let token_a = ICRC1(offer.token_a);
    let release_token_a_tx = token_a
        // TODO (fran): change ic_cdk::id() to the vault canister id
        .icrc2_transfer_from(ic_cdk::id(), caller, deposit_amount / offer.price_per_unit)
        .await;

    borrow_mut(|s| s.release_crypto_token_a(id, release_token_a_tx))
}
// --- private methods ---

// --- state methods ---
fn borrow<T>(f: impl FnOnce(&GlobalState) -> T) -> T {
    STATE.with_borrow(f)
}

fn borrow_mut<T>(f: impl FnOnce(&mut GlobalState) -> T) -> T {
    STATE.with_borrow_mut(f)
}

// Enable Candid export
ic_cdk::export_candid!();
