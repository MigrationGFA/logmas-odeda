/**
 * Email validation and domain typo suggestions for the public apply flow.
 *
 * This matters more than it looks: after payment the platform auto-provisions a
 * citizen account and emails the login credentials to whatever address the
 * applicant typed. A mistyped domain (`gnail.com`) is a perfectly valid address
 * as far as the backend is concerned, so the credentials reach an inbox nobody
 * is watching and the applicant has paid for nothing. Confirming the address
 * only catches *asymmetric* typos, so we also flag near misses here.
 *
 * Deliberately conservative: we only suggest a domain that is a near miss for a
 * well-known provider, never for an unfamiliar corporate domain.
 */

const COMMON_DOMAINS: string[] = [
  "gmail.com",
  "yahoo.com",
  "outlook.com",
  "hotmail.com",
  "icloud.com",
  "live.com",
  "aol.com",
  "proton.me",
  "protonmail.com",
  "mail.com",
  "gmx.com",
  "zoho.com",
  "yandex.com",
  "yahoo.co.uk",
  "gmail.co.uk",
];

/** Levenshtein edit distance, single-row dynamic programming. */
export function editDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  let previous: number[] = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i += 1) {
    const current: number[] = [i];
    for (let j = 1; j <= b.length; j += 1) {
      const substitution = previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1);
      current[j] = Math.min(current[j - 1] + 1, previous[j] + 1, substitution);
    }
    previous = current;
  }
  return previous[b.length];
}

const LOCAL_SHAPE = /^[^\s@]+$/;
const DOMAIN_SHAPE =
  /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/i;

/**
 * Client-side mirror of the backend's `z.string().email()` rule. The old check
 * was `email.includes("@")`, which happily accepted `a@b` and wasted a round
 * trip on a 400 VALIDATION_ERROR.
 */
export function isValidEmailShape(email: string): boolean {
  const value = email.trim();
  if (!value) return false;

  const at = value.lastIndexOf("@");
  if (at <= 0 || at === value.length - 1) return false;

  return (
    LOCAL_SHAPE.test(value.slice(0, at)) && DOMAIN_SHAPE.test(value.slice(at + 1))
  );
}

/**
 * Suggests a corrected full address (e.g. `a@gmial.com` -> `a@gmail.com`), or
 * null when there is nothing worth suggesting.
 */
export function suggestEmailDomain(email: string): string | null {
  const value = email.trim().toLowerCase();
  const at = value.lastIndexOf("@");
  if (at <= 0) return null;

  const local = value.slice(0, at);
  const domain = value.slice(at + 1);
  if (!local || !domain) return null;

  // Already a known provider, or a real subdomain of one (mail.gmail.com):
  // nothing to suggest. A truncated ".co" is still a candidate, though.
  if (
    COMMON_DOMAINS.includes(domain) ||
    COMMON_DOMAINS.some((known) => domain.endsWith(`.${known}`))
  ) {
    return null;
  }
  // Only nag once the address is otherwise complete, so we do not fight the
  // applicant while they are still typing ".com".
  if (!isValidEmailShape(value)) return null;

  // Allow a slightly wider net on longer domains (`gmaiil.com`, `hotmial.com`).
  const limit = domain.length >= 8 ? 3 : 2;
  const best = COMMON_DOMAINS.map((candidate) => ({
    candidate,
    distance: editDistance(domain, candidate),
  }))
    .filter((entry) => entry.distance > 0 && entry.distance <= limit)
    .sort(
      (a, b) =>
        a.distance - b.distance || a.candidate.length - b.candidate.length,
    )[0];

  return best ? `${local}@${best.candidate}` : null;
}
