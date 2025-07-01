mod instructions;
mod memory;
mod states;

use crate::states::STATE;
use candid::Principal;
use ic_cdk::{query, update};
use states::*;

#[ic_cdk::init]
fn init() {
    borrow_mut(|s| s.init())
}

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

#[query]
fn get_crypto_offer(id: u64) -> Option<CryptoOffer> {
    borrow(|s| s.get_crypto_offer(id))
}

#[query]
fn get_all_crypto_offers() -> Vec<CryptoOffer> {
    borrow(|s| s.get_all_crypto_offers())
}

#[update]
fn new_crypto_offer(
    token_a: Principal,
    token_b: Principal,
    price_per_unit: u64,
    offer_limit: (u64, u64),
    visibility: OfferVisibility,
) -> CryptoOffer {
    borrow_mut(|s| s.new_crypto_offer(token_a, token_b, price_per_unit, offer_limit, visibility))
}

// --- private methods ---
fn borrow<T>(f: impl FnOnce(&GlobalState) -> T) -> T {
    STATE.with_borrow(f)
}

fn borrow_mut<T>(f: impl FnOnce(&mut GlobalState) -> T) -> T {
    STATE.with_borrow_mut(f)
}

// Enable Candid export
ic_cdk::export_candid!();
