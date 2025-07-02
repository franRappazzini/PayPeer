use candid::CandidType;
use serde::Deserialize;

#[derive(CandidType, Deserialize, Clone, PartialEq)]
pub enum OfferVisibility {
    Public,
    Private,
}

#[derive(CandidType, Deserialize, Clone, PartialEq)]
pub enum OfferStatus {
    Open,
    Started,
    TokenAEscrow,
    TokenBEscrow,
    // TokenARelease, // This is not needed, as the offer is completed when token A is released
    TokenBRelease,
    Completed,
    Paused,
    Cancelled,
    // VaultReleaseError((AllowedToken, TransferError)),
    // VaultRequestError((AllowedToken, TransferFromError)),
}
