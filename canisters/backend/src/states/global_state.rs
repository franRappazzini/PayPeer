use std::cell::RefCell;

use candid::Principal;
use ic_stable_structures::{BTreeMap, BTreeSet};
use serde::{Deserialize, Serialize};

use crate::{
    memory::{self, Memory},
    states::{CryptoOffer, User},
};

thread_local! {
    pub static STATE: RefCell<GlobalState> = RefCell::new(GlobalState::default());
}

#[derive(Serialize, Deserialize)]
pub struct GlobalState {
    #[serde(skip, default = "init_stable_users")]
    pub users: BTreeMap<Principal, User, Memory>,
    #[serde(skip, default = "init_stable_crypto_offers")]
    pub crypto_offers: BTreeMap<u64, CryptoOffer, Memory>,
    #[serde(skip, default = "init_stable_offers")]
    pub offers: BTreeMap<u64, CryptoOffer, Memory>,
    #[serde(skip, default = "init_stable_whitelisted_tokens")]
    pub whitelisted_tokens: BTreeSet<Principal, Memory>,
    #[serde(skip, default = "init_stable_fees_available")]
    pub fees_available: BTreeMap<Principal, u64, Memory>,
    #[serde(skip, default = "init_stable_authorities")]
    pub authorities: BTreeSet<Principal, Memory>,
}

impl Default for GlobalState {
    fn default() -> Self {
        Self {
            users: init_stable_users(),
            crypto_offers: init_stable_crypto_offers(),
            offers: init_stable_offers(),
            whitelisted_tokens: init_stable_whitelisted_tokens(),
            fees_available: init_stable_fees_available(),
            authorities: init_stable_authorities(),
        }
    }
}
fn init_stable_users() -> BTreeMap<Principal, User, Memory> {
    BTreeMap::init(memory::get_stable_btree_memory(0))
}

fn init_stable_crypto_offers() -> BTreeMap<u64, CryptoOffer, Memory> {
    BTreeMap::init(memory::get_stable_btree_memory(1))
}

fn init_stable_offers() -> BTreeMap<u64, CryptoOffer, Memory> {
    BTreeMap::init(memory::get_stable_btree_memory(2))
}

fn init_stable_whitelisted_tokens() -> BTreeSet<Principal, Memory> {
    BTreeSet::init(memory::get_stable_btree_memory(3))
}

fn init_stable_fees_available() -> BTreeMap<Principal, u64, Memory> {
    BTreeMap::init(memory::get_stable_btree_memory(4))
}

fn init_stable_authorities() -> BTreeSet<Principal, Memory> {
    BTreeSet::init(memory::get_stable_btree_memory(5))
}
