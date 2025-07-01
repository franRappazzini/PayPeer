use std::cell::RefCell;

use candid::Principal;
use ic_stable_structures::BTreeMap;
use serde::{Deserialize, Serialize};

use crate::{
    memory::{self, Memory},
    states::Offer,
};

thread_local! {
    pub static STATE: RefCell<GlobalState> = RefCell::new(GlobalState::default());
}

#[derive(Serialize, Deserialize)]
pub struct GlobalState {
    #[serde(skip, default = "init_stable_offers")]
    pub offers: BTreeMap<u64, Offer, Memory>,
    #[serde(skip, default = "init_stable_authorities")]
    pub authorities: BTreeMap<Principal, (), Memory>,
}

impl Default for GlobalState {
    fn default() -> Self {
        Self {
            offers: init_stable_offers(),
            authorities: init_stable_authorities(),
        }
    }
}

fn init_stable_offers() -> BTreeMap<u64, Offer, Memory> {
    BTreeMap::init(memory::get_stable_btree_memory(0))
}

fn init_stable_authorities() -> BTreeMap<Principal, (), Memory> {
    BTreeMap::init(memory::get_stable_btree_memory(2))
}
