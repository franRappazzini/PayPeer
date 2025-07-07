import { Principal } from "@dfinity/principal";

/**
 * Converts the given Principal object to its string representation.
 *
 * @param {Principal} p - The Principal object to convert to a string.
 * @returns {string} The string representation of the Principal value.
 */
export const p2str = (p) => p.toString();

/**
 * Converts the given string representation of a Principal to a Principal object.
 *
 * @param {string} str - The string representation of a Principal.
 * @returns {Principal} The Principal object corresponding to the given string.
 */
export const str2p = (str) => Principal.fromText(str);

export const shortP = (p) => p.slice(0, 5) + "..." + p.slice(-3);

export const parseUser = (user) => ({
  principal: p2str(user.principal),
  name: user.name[0] || "",
  email: user.email[0] || "",
  // avatar: user.avatar[0] || "", // Base64 encoded image
  first_connection: new Date(Number(user.first_connection) / 1_000_000).toLocaleDateString(
    "es-ES",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  ),
  positive_reviews: Number(user.positive_reviews),
  negative_reviews: Number(user.negative_reviews),
  completed_tx: Number(user.completed_tx),
  total_volume_transacted: Number(user.total_volume_transacted),
  total_release_time: Number(user.total_release_time),
  referrals: user.referrals.map(p2str),
  referred_by: user.referred_by.length ? p2str(user.referred_by) : null,
  community: user.community[0] || null,
  reviews_made: user.reviews_made.map((review) => ({
    from: p2str(review.from),
    to: p2str(review.to),
    positive: review.positive,
    created_at: new Date(Number(review.created_at) / 1_000_000).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  })),
  reviews_received: user.reviews_received.map((review) => ({
    from: p2str(review.from),
    to: p2str(review.to),
    positive: review.positive,
    created_at: new Date(Number(review.created_at) / 1_000_000).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  })),
  premium: user.premium,
});
