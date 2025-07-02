use candid::{Nat, Principal};
use ic_cdk::api::call::CallResult;
use icrc_ledger_types::{
    icrc1::account::Account,
    icrc2::{
        allowance::{Allowance, AllowanceArgs},
        transfer_from::{TransferFromArgs, TransferFromError},
    },
};

pub struct ICRC1(pub Principal);

impl ICRC1 {
    pub async fn icrc1_balance_of(&self, owner: Principal) -> Nat {
        let args = Account {
            owner,
            subaccount: None,
        };
        let balance: CallResult<(Nat,)> = ic_cdk::call(self.0, "icrc1_balance_of", (args,)).await;
        let balance = balance.unwrap_or((Nat::from(0u8),)).0;
        balance
    }

    pub async fn icrc1_fee(&self) -> Nat {
        let fee: CallResult<(Nat,)> = ic_cdk::call(self.0, "icrc1_fee", ()).await;
        let fee = fee.unwrap_or((Nat::from(10_000u16),)).0; // TODO (fran): ver numero harcodeado
        fee
    }

    pub async fn icrc1_decimals(&self) -> Nat {
        let decimals: CallResult<(Nat,)> = ic_cdk::call(self.0, "icrc1_decimals", ()).await;
        let decimals = decimals.unwrap_or((Nat::from(8u8),)).0; // TODO (fran): ver numero harcodeado
        decimals
    }

    pub async fn icrc2_allowance(&self, owner: Principal, spender: Principal) -> Nat {
        let args = AllowanceArgs {
            account: Account {
                owner,
                subaccount: None,
            },
            spender: Account {
                owner: spender,
                subaccount: None,
            },
        };
        let allowance_res: CallResult<(Allowance,)> =
            ic_cdk::call(self.0, "icrc2_allowance", (args,)).await;
        let allowance = allowance_res
            .unwrap_or((Allowance {
                allowance: Nat::from(0u8),
                expires_at: None,
            },))
            .0;
        allowance.allowance
    }

    pub async fn icrc2_transfer_from(&self, from: Principal, to: Principal, amount: Nat) -> Nat {
        let args = TransferFromArgs {
            spender_subaccount: None,
            from: Account {
                owner: from,
                subaccount: None,
            },
            to: Account {
                owner: to,
                subaccount: None,
            },
            amount,
            fee: None,
            memo: None,
            created_at_time: None,
        };

        let res: Result<(Result<Nat, TransferFromError>,), _> =
            ic_cdk::call(self.0, "icrc2_transfer_from", (args,)).await;

        res.unwrap().0.expect("Failed to transfer tokens")
    }
}
