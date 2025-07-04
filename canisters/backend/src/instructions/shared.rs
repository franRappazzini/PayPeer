use std::{fmt::Debug, str::FromStr};

use candid::Nat;

/// Calculates the percentage of a given amount using basis points.
///
/// # Arguments
///
/// * `amount` - The base value to calculate the percentage from.
/// * `basis_points` - The percentage in basis points (where 10,000 basis points = 100%).
///
/// # Returns
///
/// The result of applying the percentage (in basis points) to the amount.
///
/// # Examples
///
/// ```
/// let result = percent_of(2000, 500); // 500 basis points = 5%
/// assert_eq!(result, 100);
/// ```
pub fn percent_of(amount: u64, basis_points: u64) -> u64 {
    // basis_points: 10000 = 100%, 50 = 0.5%, 1000 = 10%
    amount * basis_points / 10_000
}

pub fn nat_to<T>(nat: &Nat) -> T
where
    T: FromStr,
    <T as FromStr>::Err: Debug,
{
    nat.to_string()
        .replace("_", "")
        .parse()
        .expect("Error converting Nat to T")
}
