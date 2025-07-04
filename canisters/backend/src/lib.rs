mod instructions;
mod memory;
mod states;

use crate::{
    instructions::{nat_to, percent_of, ICRC1},
    states::STATE,
};
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

#[query]
fn get_crypto_offers_by_user(principal: Principal) -> Vec<CryptoOffer> {
    borrow(|s| s.get_crypto_offers_by_user(principal))
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
    let balance: u64 = nat_to(&token.icrc1_balance_of(caller).await);
    let balance = balance + percent_of(balance, 50); // 0.5%

    assert!(
        balance + fee >= offer_limit.0,
        "Insufficient balance (including 0.5% commission) to create the offer."
    );
    /*
        TODO (fran):
            * checkear que fee de token_a y b sean > a *x
            * checkear cantidad de ofertas activas del usuario.
            * checkear valoraciones del usuario
            * checkear que sea un user
    */

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
fn edit_crypto_offer(
    id: u64,
    token_a: Option<Principal>,
    token_b: Option<Principal>,
    price_per_unit: Option<u64>,
    offer_limit: Option<(u64, u64)>,
    visibility: Option<OfferVisibility>,
    conditions: Option<String>,
) -> Option<CryptoOffer> {
    borrow_mut(|s| {
        s.edit_crypto_offer(
            id,
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
async fn take_crypto_offer(id: u64, token_b_amount: u64) -> Option<CryptoOffer> {
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
async fn escrow_crypto_token_b(id: u64) -> Option<CryptoOffer> {
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

    let token = ICRC1(offer.token_b);
    let fee = token.icrc1_fee().await;
    let balance = token.icrc1_balance_of(caller).await;
    let deposit_amount = offer.token_a_amount.unwrap() / offer.price_per_unit;
    // let security_buffer = percent_of(deposit_amount, 1000); // 10%
    let commission = percent_of(deposit_amount, 50); // 0.5%
    let deposit_amount = deposit_amount /* + security_buffer */ + commission;

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
        .icrc2_transfer_from(caller, ic_cdk::id(), Nat::from(deposit_amount))
        .await;

    borrow_mut(|s| {
        s.add_fee_to_vault(token.0, commission);
        s.escrow_crypto_token_b(id, tx)
    })
}

#[update]
async fn escrow_crypto_token_a(id: u64) -> Option<CryptoOffer> {
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

    let token_a = ICRC1(offer.token_a);
    let fee = token_a.icrc1_fee().await;
    let balance = token_a.icrc1_balance_of(caller).await;
    let deposit_amount = offer.token_a_amount.unwrap();
    // let security_buffer = percent_of(deposit_amount, 1000); // 10%
    let commission = percent_of(deposit_amount, 50); // 0.5%
    let deposit_amount = deposit_amount /* + security_buffer */ + commission;

    assert!(
        balance + fee.clone() >= deposit_amount,
        "Insufficient balance (including 10% buffer) to escrow the tokens."
    );
    // Ensure the canister has enough allowance to take the tokens
    // TODO (fran): change ic_cdk::id() to the vault canister id
    let allowance = token_a.icrc2_allowance(caller, ic_cdk::id()).await;
    assert!(
        allowance + fee >= deposit_amount,
        "Insufficient allowance to escrow the tokens."
    );

    // Transfer the tokens to the canister
    let tx = token_a
        // TODO (fran): change ic_cdk::id() to the vault canister id
        .icrc2_transfer_from(caller, ic_cdk::id(), Nat::from(deposit_amount))
        .await;

    // Update the offer state with the escrow transaction
    borrow_mut(|s| {
        s.add_fee_to_vault(token_a.0, commission);
        s.escrow_crypto_token_a(id, tx)
    });

    // Release the escrowed tokens
    let release_token_a_tx = token_a
        // TODO (fran): change ic_cdk::id() to the vault canister id
        .icrc2_transfer_from(
            ic_cdk::id(),
            offer.creator,
            Nat::from(deposit_amount - commission),
        )
        .await;

    borrow_mut(|s| s.release_crypto_token_a(id, release_token_a_tx));

    let token_b = ICRC1(offer.token_b);
    let release_token_b_tx = token_b
        // TODO (fran): change ic_cdk::id() to the vault canister id
        .icrc2_transfer_from(
            ic_cdk::id(),
            caller,
            Nat::from((deposit_amount - commission) / offer.price_per_unit),
        )
        .await;

    borrow_mut(|s| s.release_crypto_token_b(id, release_token_b_tx))
}

// --- fees available methods ---
#[query(guard = only_authority)]
fn get_available_fee(token: Principal) -> u64 {
    borrow(|s| s.get_available_fee(token))
}

#[query(guard = only_authority)]
fn get_all_available_fees() -> Vec<(Principal, u64)> {
    borrow(|s| s.get_all_available_fees())
}

#[update(guard = only_authority)]
fn withdraw_token_from_vault(token: Principal) -> (Principal, u64) {
    (token, 0)
}

// --- authority methods ---
#[update(guard = only_authority)]
fn new_authority(principal: Principal) {
    borrow_mut(|s| s.new_authority(principal))
}

#[update(guard = only_authority)]
fn remove_authority(principal: Principal) {
    borrow_mut(|s| s.remove_authority(principal))
}

// --- test methods ---

// --- private methods ---

// --- guards ---
fn only_authority() -> Result<(), String> {
    borrow(|s| {
        s.is_authority(ic_cdk::caller())
            .then_some(())
            .ok_or("Only authorities can call this method.".to_string())
    })
}

// --- state methods ---
fn borrow<T>(f: impl FnOnce(&GlobalState) -> T) -> T {
    STATE.with_borrow(f)
}

fn borrow_mut<T>(f: impl FnOnce(&mut GlobalState) -> T) -> T {
    STATE.with_borrow_mut(f)
}

// Enable Candid export
ic_cdk::export_candid!();
