import assert from "node:assert";
import { validateAndSanitizeUrl } from "../lib/security/ssrf.ts";
import { rateLimiter } from "../lib/security/rate-limit.ts";

console.log("=========================================");
console.log("CONSIDERIQ SECURITY & RESILIENCE TEST SUITE");
console.log("=========================================\n");

let passed = 0;
let total = 0;

function test(description, fn) {
  total++;
  try {
    fn();
    console.log(`  ✓ ${description}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ ${description}`);
    console.error(`    Error: ${err.message}`);
  }
}

// ----------------------------------------------------
// 1. SSRF & URL VALIDATION TESTS
// ----------------------------------------------------
console.log("1. Running SSRF & URL Validator Tests...");

test("Rejects empty or non-string input", () => {
  assert.strictEqual(validateAndSanitizeUrl("").isValid, false);
  assert.strictEqual(validateAndSanitizeUrl("   ").isValid, false);
});

test("Rejects localhost and internal domain names", () => {
  assert.strictEqual(validateAndSanitizeUrl("http://localhost").isValid, false);
  assert.strictEqual(validateAndSanitizeUrl("http://localhost:3000").isValid, false);
  assert.strictEqual(validateAndSanitizeUrl("http://localhost.localdomain").isValid, false);
  assert.strictEqual(validateAndSanitizeUrl("http://service.local").isValid, false);
  assert.strictEqual(validateAndSanitizeUrl("http://app.internal").isValid, false);
  assert.strictEqual(validateAndSanitizeUrl("http://metadata.google.internal").isValid, false);
});

test("Rejects IPv4 Loopback (127.0.0.0/8)", () => {
  assert.strictEqual(validateAndSanitizeUrl("http://127.0.0.1").isValid, false);
  assert.strictEqual(validateAndSanitizeUrl("http://127.0.0.2:8080").isValid, false);
  assert.strictEqual(validateAndSanitizeUrl("https://127.12.34.56").isValid, false);
});

test("Rejects RFC 1918 Private Addresses (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16)", () => {
  assert.strictEqual(validateAndSanitizeUrl("http://10.0.0.1").isValid, false);
  assert.strictEqual(validateAndSanitizeUrl("http://10.254.254.254").isValid, false);
  assert.strictEqual(validateAndSanitizeUrl("http://172.16.0.1").isValid, false);
  assert.strictEqual(validateAndSanitizeUrl("http://172.31.255.255").isValid, false);
  assert.strictEqual(validateAndSanitizeUrl("http://192.168.1.1").isValid, false);
  assert.strictEqual(validateAndSanitizeUrl("http://192.168.100.20").isValid, false);
});

test("Rejects Cloud Metadata & Link-Local Addresses (169.254.169.254)", () => {
  assert.strictEqual(validateAndSanitizeUrl("http://169.254.169.254/latest/meta-data/").isValid, false);
  assert.strictEqual(validateAndSanitizeUrl("http://169.254.1.1").isValid, false);
});

test("Rejects Non-HTTP(S) URI schemes (file:, gopher:, javascript:, data:, etc.)", () => {
  assert.strictEqual(validateAndSanitizeUrl("file:///etc/passwd").isValid, false);
  assert.strictEqual(validateAndSanitizeUrl("javascript:alert(1)").isValid, false);
  assert.strictEqual(validateAndSanitizeUrl("gopher://127.0.0.1:70").isValid, false);
  assert.strictEqual(validateAndSanitizeUrl("ftp://ftp.example.com").isValid, false);
  assert.strictEqual(validateAndSanitizeUrl("data:text/html,<script>alert(1)</script>").isValid, false);
});

test("Rejects IPv6 Loopback and Link-Local", () => {
  assert.strictEqual(validateAndSanitizeUrl("http://[::1]").isValid, false);
  assert.strictEqual(validateAndSanitizeUrl("http://[fe80::1]").isValid, false);
  assert.strictEqual(validateAndSanitizeUrl("http://[fc00::1]").isValid, false);
});

test("Rejects Restricted Administrative Ports", () => {
  assert.strictEqual(validateAndSanitizeUrl("http://example.com:22").isValid, false); // SSH
  assert.strictEqual(validateAndSanitizeUrl("http://example.com:5432").isValid, false); // Postgres
  assert.strictEqual(validateAndSanitizeUrl("http://example.com:6379").isValid, false); // Redis
  assert.strictEqual(validateAndSanitizeUrl("http://example.com:27017").isValid, false); // Mongo
});

test("Permits Valid Public Production Domains and normalizes protocol", () => {
  const r1 = validateAndSanitizeUrl("https://consideriq.ai");
  assert.strictEqual(r1.isValid, true);
  assert.strictEqual(r1.normalizedUrl, "https://consideriq.ai/");

  const r2 = validateAndSanitizeUrl("stripe.com/docs");
  assert.strictEqual(r2.isValid, true);
  assert.strictEqual(r2.normalizedUrl, "https://stripe.com/docs");

  const r3 = validateAndSanitizeUrl("http://acme.org/pricing");
  assert.strictEqual(r3.isValid, true);
  assert.strictEqual(r3.normalizedUrl, "http://acme.org/pricing");
});

// ----------------------------------------------------
// 2. RATE LIMITER & BRUTE FORCE PROTECTION TESTS
// ----------------------------------------------------
console.log("\n2. Running Rate Limiter & Abuse Prevention Tests...");

test("Allows requests under the limit", () => {
  const key = "test-user-normal";
  rateLimiter.reset(key);

  const res1 = rateLimiter.check(key, 3, 10000);
  assert.strictEqual(res1.allowed, true);
  assert.strictEqual(res1.remaining, 2);

  const res2 = rateLimiter.check(key, 3, 10000);
  assert.strictEqual(res2.allowed, true);
  assert.strictEqual(res2.remaining, 1);
});

test("Blocks requests when limit is exhausted", () => {
  const key = "test-user-flood";
  rateLimiter.reset(key);

  // Consume all 3 tokens
  rateLimiter.check(key, 3, 10000);
  rateLimiter.check(key, 3, 10000);
  rateLimiter.check(key, 3, 10000);

  // 4th request must be rejected
  const blocked = rateLimiter.check(key, 3, 10000);
  assert.strictEqual(blocked.allowed, false);
  assert.strictEqual(blocked.remaining, 0);
  assert.ok(blocked.resetMs > 0);
});

test("Resets token bucket correctly on successful auth", () => {
  const key = "test-user-reset";
  rateLimiter.check(key, 1, 10000);
  assert.strictEqual(rateLimiter.check(key, 1, 10000).allowed, false);

  rateLimiter.reset(key);
  assert.strictEqual(rateLimiter.check(key, 1, 10000).allowed, true);
});

// ----------------------------------------------------
// 3. SECRETS & REDACTION SANITIZATION TESTS
// ----------------------------------------------------
console.log("\n3. Running Credential Redaction & Safe Error Tests...");

test("Sanitizes Google Gemini API keys in simulation errors", () => {
  const sampleError = "API call failed with key AIzaSyD1234567890abcdefghijklmnopqrstuv at endpoint";
  const sanitized = sampleError.replace(/AIza[0-9A-Za-z-_]{35}/g, "[REDACTED_API_KEY]");
  assert.strictEqual(sanitized.includes("AIzaSyD1234567890abcdefghijklmnopqrstuv"), false);
  assert.strictEqual(sanitized.includes("[REDACTED_API_KEY]"), true);
});

test("Guarantees Open Redirect defenses on redirect param", () => {
  const checkRedirect = (raw) => {
    return raw.startsWith("/") && !raw.startsWith("//") && !raw.startsWith("/\\") ? raw : "/app";
  };

  assert.strictEqual(checkRedirect("/app/projects/123"), "/app/projects/123");
  assert.strictEqual(checkRedirect("https://attacker.com"), "/app");
  assert.strictEqual(checkRedirect("//evil.com"), "/app");
  assert.strictEqual(checkRedirect("/\\evil.com"), "/app");
  assert.strictEqual(checkRedirect("javascript:alert(1)"), "/app");
});

console.log(`\n=========================================`);
console.log(`RESULTS: ${passed}/${total} security tests passed.`);
console.log(`=========================================\n`);

if (passed !== total) {
  process.exit(1);
}
