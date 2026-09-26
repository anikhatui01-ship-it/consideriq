/**
 * Comprehensive SSRF (Server-Side Request Forgery) protection and URL validation.
 * Enforces strict protocol, hostname, private IP, and cloud metadata restrictions.
 */

// Blocked private / internal / link-local IPv4 CIDR patterns
const BLOCKED_IP_REGEXES = [
  /^127\./,                         // Loopback (127.0.0.0/8)
  /^0\./,                           // Current network (0.0.0.0/8)
  /^10\./,                          // RFC 1918 Private (10.0.0.0/8)
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./, // RFC 1918 Private (172.16.0.0/12)
  /^192\.168\./,                    // RFC 1918 Private (192.168.0.0/16)
  /^169\.254\./,                    // Link-local / AWS & Cloud Metadata (169.254.0.0/16)
  /^100\.(6[4-9]|[7-9][0-9]|1[0-1][0-9]|12[0-7])\./, // Carrier-grade NAT (100.64.0.0/10)
  /^192\.0\.2\./,                   // TEST-NET-1 (192.0.2.0/24)
  /^198\.51\.100\./,                // TEST-NET-2 (198.51.100.0/24)
  /^203\.0\.113\./,                 // TEST-NET-3 (203.0.113.0/24)
  /^224\./,                         // Multicast (224.0.0.0/4)
  /^240\./,                         // Reserved (240.0.0.0/4)
  /^255\.255\.255\.255$/,           // Broadcast
];

// Blocked specific internal hostnames and metadata endpoints
const BLOCKED_HOSTNAMES = new Set([
  "localhost",
  "localhost.localdomain",
  "ip6-localhost",
  "ip6-loopback",
  "metadata.google.internal",
  "metadata",
  "instance-data",
]);

export interface UrlValidationResult {
  isValid: boolean;
  normalizedUrl: string | null;
  error?: string;
}

/**
 * Validates and normalizes user-provided website URLs.
 * Rejects non-HTTP(S) schemes, localhost, private IP ranges, cloud metadata, and malformed inputs.
 */
export function validateAndSanitizeUrl(rawUrl: string): UrlValidationResult {
  if (!rawUrl || typeof rawUrl !== "string") {
    return { isValid: false, normalizedUrl: null, error: "Website URL is required." };
  }

  const trimmed = rawUrl.trim();
  if (trimmed.length === 0) {
    return { isValid: false, normalizedUrl: null, error: "Website URL cannot be empty." };
  }

  if (trimmed.length > 500) {
    return { isValid: false, normalizedUrl: null, error: "Website URL must be under 500 characters." };
  }

  // Ensure protocol is present for parsing
  let urlWithProtocol = trimmed;
  if (!/^https?:\/\//i.test(trimmed)) {
    urlWithProtocol = `https://${trimmed}`;
  }

  let parsed: URL;
  try {
    parsed = new URL(urlWithProtocol);
  } catch {
    return { isValid: false, normalizedUrl: null, error: "Malformed URL syntax." };
  }

  // 1. Protocol validation: ONLY http: and https: allowed
  if (!["http:", "https:"].includes(parsed.protocol.toLowerCase())) {
    return {
      isValid: false,
      normalizedUrl: null,
      error: "Only HTTP and HTTPS website URLs are permitted.",
    };
  }

  // 2. Hostname validation
  const hostname = parsed.hostname.toLowerCase().trim();
  if (!hostname || hostname.length < 3) {
    return { isValid: false, normalizedUrl: null, error: "Invalid hostname." };
  }

  // 3. Block localhost and specific internal hostnames
  if (BLOCKED_HOSTNAMES.has(hostname) || hostname.endsWith(".local") || hostname.endsWith(".internal")) {
    return {
      isValid: false,
      normalizedUrl: null,
      error: "Access to local or internal private network destinations is forbidden.",
    };
  }

  // 4. Block IPv6 loopback and link-local addresses
  if (
    hostname === "::1" ||
    hostname === "[::1]" ||
    hostname.startsWith("fe80:") ||
    hostname.startsWith("[fe80:") ||
    hostname.startsWith("fc00:") ||
    hostname.startsWith("[fc00:") ||
    hostname.startsWith("fd00:") ||
    hostname.startsWith("[fd00:")
  ) {
    return {
      isValid: false,
      normalizedUrl: null,
      error: "IPv6 private and loopback addresses are forbidden.",
    };
  }

  // 5. Block IPv4 private, loopback, and metadata ranges
  for (const regex of BLOCKED_IP_REGEXES) {
    if (regex.test(hostname)) {
      return {
        isValid: false,
        normalizedUrl: null,
        error: "Private, loopback, and cloud metadata IP addresses are strictly forbidden.",
      };
    }
  }

  // 6. Check for valid domain structure (must have at least one dot separating labels)
  if (!hostname.includes(".")) {
    return {
      isValid: false,
      normalizedUrl: null,
      error: "Website must include a valid top-level domain (e.g., example.com).",
    };
  }

  // 7. Reject ports to internal/restricted services
  if (parsed.port) {
    const portNum = parseInt(parsed.port, 10);
    // Block common internal ports (e.g. database, redis, internal management, metadata)
    const restrictedPorts = [22, 25, 110, 143, 445, 1433, 2375, 3306, 5432, 6379, 8080, 8443, 9200, 27017];
    if (restrictedPorts.includes(portNum)) {
      return {
        isValid: false,
        normalizedUrl: null,
        error: "Access to private administrative ports is restricted.",
      };
    }
  }

  // Clean and normalized representation
  return {
    isValid: true,
    normalizedUrl: parsed.toString(),
  };
}
