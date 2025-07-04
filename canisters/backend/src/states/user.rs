use std::{
    borrow::Cow,
    collections::{HashMap, HashSet},
};

use candid::{CandidType, Decode, Encode, Principal};
use ic_stable_structures::{storable::Bound, Storable};
use serde::Deserialize;

#[derive(CandidType, Deserialize, Clone)]
pub struct User {
    pub principal: Principal,
    pub name: Option<String>,
    pub email: Option<String>,
    pub first_connection: u64,
    pub positive_reviews: u64,
    pub negative_reviews: u64,
    pub completed_tx: u64,
    pub total_volume_transacted: u64,
    pub total_release_time: u64,
    // claims_in_last_month: u8, // total de reclamos recibidos en el ultimo mes
    pub referrals: HashSet<Principal>,
    pub referred_by: Option<Principal>,
    pub community: Option<()>,
    pub reviews_made: HashMap<Principal, Review>,
    pub reviews_received: HashMap<Principal, Review>,
    pub premium: bool,
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
impl Storable for User {
    fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: std::borrow::Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Bounded {
        max_size: std::mem::size_of::<User>() as u32 + DEFAULT_VALUE_SIZE,
        is_fixed_size: false,
    };
}

const DEFAULT_VALUE_SIZE: u32 = 1024; // Adjust as needed for your use case

#[derive(CandidType, Deserialize, Clone)]
pub struct Review {
    from: Principal,
    to: Principal,
    positive: bool,
    created_at: u64,
}
