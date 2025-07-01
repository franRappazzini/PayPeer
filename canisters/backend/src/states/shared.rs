use candid::CandidType;
use serde::Deserialize;

#[derive(CandidType, Deserialize, Clone, PartialEq)]
pub enum OfferVisibility {
    Public,
    Private,
}

#[derive(CandidType, Deserialize, Clone)]
pub enum OfferStatus {
    Open,
    Started,
    FirstEscrow,
    SecondEscrow,
    FirstVaultRelease,
    SecondVaultRelease,
    Completed,
    Paused,
    Cancelled,
    // VaultReleaseError((AllowedToken, TransferError)),
    // VaultRequestError((AllowedToken, TransferFromError)),
}
