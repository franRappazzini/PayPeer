use std::borrow::Cow;

use candid::{CandidType, Decode, Encode, Nat, Principal};
use ic_stable_structures::{storable::Bound, Storable};
use serde::Deserialize;

use crate::states::{OfferStatus, OfferVisibility};

#[derive(CandidType, Deserialize, Clone)]
pub struct CryptoOffer {
    pub id: u64,
    pub creator: Principal,
    pub contrapart: Option<Principal>,
    pub token_a: Principal,      // buy token (creator)
    pub token_b: Principal,      // sell token (creator)
    pub price_per_unit: u64,     // token_a in base b
    pub offer_limit: (u64, u64), // token_a
    pub token_a_amount: Option<u64>,
    pub visibility: OfferVisibility,
    pub status: OfferStatus,
    pub conditions: Option<String>,
    pub creation_date: u64,
    pub taken_at: Option<u64>, // timestamp when the offer was taken
    pub token_a_escrow_at: Option<u64>,
    pub token_b_escrow_at: Option<u64>,
    pub token_a_escrow_tx_index: Option<Nat>,
    pub token_b_escrow_tx_index: Option<Nat>,
    pub token_a_release_tx_index: Option<Nat>,
    pub token_b_release_tx_index: Option<Nat>,
}

// For a type to be used in a `StableBTreeMap`, it needs to implement the `Storable`
// trait, which specifies how the type can be serialized/deserialized.
//
// In this example, we're using candid to serialize/deserialize the struct, but you
// can use anything as long as you're maintaining backward-compatibility. The
// backward-compatibility allows you to change your struct over time (e.g. adding
// new fields).
//
// The `Storable` trait is already implemented for several common types (e.g. u64),
// so you can use those directly without implementing the `Storable` trait for them.
impl Storable for CryptoOffer {
    fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: std::borrow::Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Bounded {
        max_size: std::mem::size_of::<CryptoOffer>() as u32 + DEFAULT_VALUE_SIZE,
        is_fixed_size: false,
    };
}

const DEFAULT_VALUE_SIZE: u32 = 1024; // Adjust as needed for your use case
