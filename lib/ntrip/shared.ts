// Shared between the NTRIP scanner page and /api/ntrip-scan.

export type NtripErrorCode =
    | 'methodNotAllowed'
    | 'invalidHost'
    | 'invalidPort'
    | 'portNotAllowed'
    | 'blockedAddress'
    | 'unreachable'
    | 'timeout';

// Common NTRIP caster ports. The scanner only talks to these.
export const NTRIP_ALLOWED_PORTS = [80, 2101, 2102, 2103, 2104, 2105, 2106, 2107, 2108, 2109, 2110, 8000, 8080];
