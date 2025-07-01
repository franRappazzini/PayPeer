use std::collections::{HashMap, HashSet};

use candid::Principal;

use crate::states::User;

impl User {
    pub fn new(referred_by: Option<Principal>) -> Self {
        Self {
            principal: ic_cdk::caller(),
            name: None,
            email: None,
            first_connection: ic_cdk::api::time(),
            positive_reviews: 0,
            negative_reviews: 0,
            completed_tx: 0,
            total_volume_transacted: 0,
            total_release_time: 0,
            referrals: HashSet::new(),
            referred_by,
            community: None,
            reviews_made: HashMap::new(),
            reviews_received: HashMap::new(),
            premium: false,
        }
    }

    pub fn edit(&mut self, name: Option<String>, email: Option<String>) -> Self {
        if name.is_some() {
            self.name = name;
        }
        if email.is_some() {
            self.email = email;
        }

        self.clone()
    }
}
