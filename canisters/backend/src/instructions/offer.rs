use candid::{Nat, Principal};

use crate::states::{CryptoOffer, OfferStatus, OfferVisibility};

impl CryptoOffer {
    pub fn new(
        id: u64,
        token_a: Principal,
        token_b: Principal,
        price_per_unit: u64,
        offer_limit: (u64, u64),
        visibility: OfferVisibility,
        conditions: Option<String>,
    ) -> Self {
        assert!(
            offer_limit.0 <= offer_limit.1,
            "Invalid Offer Limit values."
        );

        Self {
            id,
            creator: ic_cdk::caller(),
            contrapart: None,
            token_a,
            token_b,
            price_per_unit,
            offer_limit,
            token_b_amount: None,
            visibility,
            status: OfferStatus::Open,
            conditions,
            creation_date: ic_cdk::api::time(),
            taken_at: None,
            token_a_escrow_at: None,
            token_b_escrow_at: None,
            token_a_escrow_tx_index: None,
            token_b_escrow_tx_index: None,
            token_a_release_tx_index: None,
            token_b_release_tx_index: None,
        }
    }

    pub fn pause(&mut self) {
        assert!(
            self.status == OfferStatus::Open,
            "Offer can only be paused if it is Open."
        );
        self.status = OfferStatus::Paused;
    }

    pub fn resume(&mut self) {
        assert!(
            self.status == OfferStatus::Paused,
            "Offer can only be resumed if it is Paused."
        );
        self.status = OfferStatus::Open;
    }

    pub fn cancel(&mut self) {
        assert!(
            self.status == OfferStatus::Open || self.status == OfferStatus::Paused,
            "Offer can only be cancelled if it is Open or Paused."
        );
        self.status = OfferStatus::Cancelled;
    }

    pub fn take(&mut self, token_b_amount: Nat) {
        let caller = ic_cdk::caller();

        assert!(
            caller != self.creator,
            "Creator cannot take their own offer."
        );
        assert!(
            self.status == OfferStatus::Open,
            "Offer can only be taken if it is Open."
        );
        assert!(
            token_b_amount >= self.offer_limit.0 && token_b_amount <= self.offer_limit.1,
            "Token amount must be within the offer limit range."
        );

        self.contrapart = Some(caller);
        self.token_b_amount = Some(token_b_amount);
        self.taken_at = Some(ic_cdk::api::time());
        self.status = OfferStatus::Started;
    }

    pub fn escrow_token_a(&mut self, token_a_escrow_tx_index: Nat) -> CryptoOffer {
        self.token_a_escrow_tx_index = Some(token_a_escrow_tx_index);
        self.token_a_escrow_at = Some(ic_cdk::api::time());
        self.status = OfferStatus::TokenAEscrow;

        self.clone()
    }

    pub fn escrow_token_b(&mut self, token_b_escrow_tx_index: Nat) -> CryptoOffer {
        self.token_b_escrow_tx_index = Some(token_b_escrow_tx_index);
        self.token_b_escrow_at = Some(ic_cdk::api::time());
        self.status = OfferStatus::TokenBEscrow;

        self.clone()
    }

    pub fn release_token_a(&mut self, token_a_release_tx_index: Nat) -> CryptoOffer {
        self.token_a_release_tx_index = Some(token_a_release_tx_index);
        self.status = OfferStatus::Completed;

        self.clone()
    }

    pub fn release_token_b(&mut self, token_b_release_tx_index: Nat) -> CryptoOffer {
        self.token_b_release_tx_index = Some(token_b_release_tx_index);
        self.status = OfferStatus::TokenBRelease;

        self.clone()
    }

    pub fn is_public(&self) -> bool {
        self.visibility == OfferVisibility::Public
    }
}
