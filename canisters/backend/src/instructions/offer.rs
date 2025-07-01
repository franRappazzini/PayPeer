use candid::Principal;

use crate::states::{CryptoOffer, OfferStatus, OfferVisibility};

impl CryptoOffer {
    pub fn new(
        id: u64,
        token_a: Principal,
        token_b: Principal,
        price_per_unit: u64,
        offer_limit: (u64, u64),
        visibility: OfferVisibility,
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
            creation_date: ic_cdk::api::time(),
            first_escrow_at: None,
            second_escrow_at: None,
            creator_release_time: None,
            contrapart_release_time: None,
            creator_tx_index: None,
            contrapart_tx_index: None,
            release_creator_tx_index: None,
            release_contrapart_tx_index: None,
        }
    }

    pub fn is_public(&self) -> bool {
        self.visibility == OfferVisibility::Public
    }
}
