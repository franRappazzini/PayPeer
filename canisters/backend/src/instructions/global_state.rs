use candid::{Nat, Principal};

use crate::{
    instructions::offer,
    states::{CryptoOffer, GlobalState, OfferVisibility, User},
};

// init & users
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
                self.users.insert(caller, user.clone());
                user
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
}

// crypto offers
impl GlobalState {
    pub fn get_crypto_offer(&self, id: u64) -> Option<CryptoOffer> {
        self.crypto_offers.get(&id)
    }

    pub fn get_all_crypto_offers(&self) -> Vec<CryptoOffer> {
        self.crypto_offers
            .values()
            .filter(|offer| offer.is_public())
            .collect()
    }

    pub fn get_crypto_offers_by_user(&self, principal: Principal) -> Vec<CryptoOffer> {
        self.crypto_offers
            .values()
            .filter(|offer| offer.creator == principal)
            .collect()
    }

    pub fn new_crypto_offer(
        &mut self,
        token_a: Principal,
        token_b: Principal,
        price_per_unit: u64,
        offer_limit: (u64, u64),
        visibility: OfferVisibility,
        conditions: Option<String>,
    ) -> CryptoOffer {
        // TODO (fran): check total offers by caller
        self.check_whitelisted_token(token_a);
        self.check_whitelisted_token(token_b);
        self.check_ne_tokens(token_a, token_b);
        self.check_offer_limit(offer_limit);

        let id = self.crypto_offers.len();
        let crypto_offer = CryptoOffer::new(
            id,
            token_a,
            token_b,
            price_per_unit,
            offer_limit,
            visibility,
            conditions,
        );

        self.crypto_offers.insert(id, crypto_offer.clone());

        crypto_offer
    }

    pub fn pause_crypto_offer(&mut self, id: u64) -> Option<CryptoOffer> {
        if let Some(mut offer) = self.crypto_offers.get(&id) {
            assert!(
                offer.creator == ic_cdk::caller(),
                "Only the creator can pause the offer."
            );
            offer.pause();
            self.crypto_offers.insert(id, offer.clone());
            return Some(offer);
        }
        None
    }

    pub fn resume_crypto_offer(&mut self, id: u64) -> Option<CryptoOffer> {
        if let Some(mut offer) = self.crypto_offers.get(&id) {
            assert!(
                offer.creator == ic_cdk::caller(),
                "Only the creator can resume the offer."
            );
            offer.resume();
            self.crypto_offers.insert(id, offer.clone());
            return Some(offer);
        }
        None
    }

    pub fn cancel_crypto_offer(&mut self, id: u64) -> Option<CryptoOffer> {
        if let Some(mut offer) = self.crypto_offers.get(&id) {
            assert!(
                offer.creator == ic_cdk::caller(),
                "Only the creator can cancel the offer."
            );
            offer.cancel();
            self.crypto_offers.insert(id, offer.clone());
            return Some(offer);
        }
        None
    }

    pub fn edit_crypto_offer(
        &mut self,
        id: u64,
        token_a: Option<Principal>,
        token_b: Option<Principal>,
        price_per_unit: Option<u64>,
        offer_limit: Option<(u64, u64)>,
        visibility: Option<OfferVisibility>,
        conditions: Option<String>,
    ) -> Option<CryptoOffer> {
        if let Some(mut offer) = self.crypto_offers.get(&id) {
            offer.edit(
                token_a,
                token_b,
                price_per_unit,
                offer_limit,
                visibility,
                conditions,
            );

            self.check_whitelisted_token(offer.token_a);
            self.check_whitelisted_token(offer.token_b);
            self.check_ne_tokens(offer.token_a, offer.token_b);
            self.check_offer_limit(offer.offer_limit);

            self.crypto_offers.insert(id, offer.clone());
            return Some(offer);
        }
        None
    }

    pub fn take_crypto_offer(&mut self, id: u64, token_b_amount: u64) -> Option<CryptoOffer> {
        if let Some(mut offer) = self.crypto_offers.get(&id) {
            offer.take(token_b_amount);
            self.crypto_offers.insert(id, offer.clone());
            return Some(offer.clone());
        }
        None
    }

    pub fn escrow_crypto_token_a(
        &mut self,
        id: u64,
        token_a_escrow_tx_index: Nat,
    ) -> Option<CryptoOffer> {
        if let Some(mut offer) = self.crypto_offers.get(&id) {
            offer.escrow_token_a(token_a_escrow_tx_index);
            self.crypto_offers.insert(id, offer.clone());
            return Some(offer);
        }
        None
    }

    pub fn escrow_crypto_token_b(
        &mut self,
        id: u64,
        token_b_escrow_tx_index: Nat,
    ) -> Option<CryptoOffer> {
        if let Some(mut offer) = self.crypto_offers.get(&id) {
            offer.escrow_token_b(token_b_escrow_tx_index);
            self.crypto_offers.insert(id, offer.clone());
            return Some(offer);
        }
        None
    }

    pub fn release_crypto_token_a(
        &mut self,
        id: u64,
        token_a_release_tx_index: Nat,
    ) -> Option<CryptoOffer> {
        if let Some(mut offer) = self.crypto_offers.get(&id) {
            offer.release_token_a(token_a_release_tx_index);
            self.crypto_offers.insert(id, offer.clone());
            return Some(offer);
        }
        None
    }

    pub fn release_crypto_token_b(
        &mut self,
        id: u64,
        token_b_release_tx_index: Nat,
    ) -> Option<CryptoOffer> {
        if let Some(mut offer) = self.crypto_offers.get(&id) {
            offer.release_token_b(token_b_release_tx_index);
            self.crypto_offers.insert(id, offer.clone());
            return Some(offer);
        }
        None
    }
}

// fees available & authorities
impl GlobalState {
    pub fn get_available_fee(&self, token: Principal) -> u64 {
        self.fees_available.get(&token).unwrap_or(0)
    }

    pub fn get_all_available_fees(&self) -> Vec<(Principal, u64)> {
        self.fees_available.iter().collect()
    }

    pub fn add_fee_to_vault(&mut self, token: Principal, fee: u64) {
        let mut amount = self.fees_available.get(&token).unwrap_or(0);
        amount += fee;
        self.fees_available.insert(token, amount);
    }

    pub fn is_authority(&self, principal: Principal) -> bool {
        self.authorities.contains(&principal)
    }

    pub fn new_authority(&mut self, principal: Principal) {
        self.authorities.insert(principal);
    }

    pub fn remove_authority(&mut self, principal: Principal) {
        self.authorities.remove(&principal);
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

    fn check_ne_tokens(&self, token_a: Principal, token_b: Principal) {
        assert_ne!(token_a, token_b, "You must select different tokens.")
    }
}
