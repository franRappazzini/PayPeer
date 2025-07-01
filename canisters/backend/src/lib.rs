mod instructinos;
mod memory;
mod states;

use crate::states::STATE;
use states::*;

#[ic_cdk::init]
fn init() {
    borrow_mut(|s| s.init())
}

// --- private methods ---
fn borrow<T>(f: impl FnOnce(&GlobalState) -> T) -> T {
    STATE.with_borrow(f)
}

fn borrow_mut<T>(f: impl FnOnce(&mut GlobalState) -> T) -> T {
    STATE.with_borrow_mut(f)
}

// Enable Candid export
ic_cdk::export_candid!();
