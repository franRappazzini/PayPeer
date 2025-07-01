use candid::Principal;

use crate::states::{CryptoOffer, GlobalState, OfferVisibility, User};

impl GlobalState {
    pub fn init(&mut self) {
        self.authorities.insert(ic_cdk::caller());
    }

    pub fn get_user(&self, principal: Principal) -> Option<User> {
        self.users.get(&principal)
    }

    pub fn new_user(&mut self, referred_by: Option<Principal>) -> User {
        let caller = ic_cdk::caller();
        match self.users.get(&caller) {
            Some(u) => u,
            None => {
                let user = User::new(referred_by);
                self.users.insert(caller, user).unwrap()
            }
        }
    }

    pub fn edit_user(&mut self, name: Option<String>, email: Option<String>) -> Option<User> {
        let caller = ic_cdk::caller();
        if let Some(mut u) = self.users.get(&caller) {
            u.edit(name, email);
            self.users.insert(caller, u.clone());
            return Some(u);
        }
        None
    }

    pub fn get_crypto_offer(&self, id: u64) -> Option<CryptoOffer> {
        self.crypto_offers.get(&id)
    }

    pub fn get_all_crypto_offers(&self) -> Vec<CryptoOffer> {
        self.crypto_offers
            .values()
            .filter(|offer| offer.is_public())
            .collect()
    }

    pub fn new_crypto_offer(
        &mut self,
        token_a: Principal,
        token_b: Principal,
        price_per_unit: u64,
        offer_limit: (u64, u64),
        visibility: OfferVisibility,
    ) -> CryptoOffer {
        // TODO (fran): check total offers by caller
        self.check_whitelisted_token(token_a);
        self.check_whitelisted_token(token_b);
        self.check_offer_limit(offer_limit);

        let id = self.crypto_offers.len();
        let crypto_offer = CryptoOffer::new(
            id,
            token_a,
            token_b,
            price_per_unit,
            offer_limit,
            visibility,
        );

        self.crypto_offers.insert(id, crypto_offer.clone());

        crypto_offer
    }
}

// helpers
impl GlobalState {
    fn check_whitelisted_token(&self, token: Principal) {
        assert!(
            self.whitelisted_tokens.contains(&token),
            "Token not allowed yet."
        )
    }

    fn check_offer_limit(&self, offer_limit: (u64, u64)) {
        assert!(
            offer_limit.0 <= offer_limit.1,
            "Invalid Offer Limit values."
        )
    }
}
