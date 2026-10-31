import { NextApiRequest, NextApiResponse } from 'next';
import { lookup } from 'dns/promises';
import net from 'net';
import { NTRIP_ALLOWED_PORTS, type NtripErrorCode } from '@/lib/ntrip/shared';

interface NtripResponse {
    success: boolean;
    code?: NtripErrorCode;
    message: string;
    mountPoints?: string[];
}

const CONNECT_TIMEOUT_MS = 5000;
const TOTAL_TIMEOUT_MS = 8000;
const MAX_RESPONSE_BYTES = 64 * 1024;
const HOSTNAME_PATTERN = /^(?=.{1,253}$)([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)*[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.?$/i;

// Private, loopback, link-local (cloud metadata), CGNAT, multicast and reserved ranges.
const blockedAddresses = new net.BlockList();
for (const [network, prefix] of [
    ['0.0.0.0', 8], ['10.0.0.0', 8], ['100.64.0.0', 10], ['127.0.0.0', 8],
    ['169.254.0.0', 16], ['172.16.0.0', 12], ['192.0.0.0', 24], ['192.0.2.0', 24],
    ['192.168.0.0', 16], ['198.18.0.0', 15], ['198.51.100.0', 24], ['203.0.113.0', 24],
    ['224.0.0.0', 3],
] as const) {
    blockedAddresses.addSubnet(network, prefix, 'ipv4');
}
for (const [network, prefix] of [
    ['::', 128], ['::1', 128], ['64:ff9b::', 96], ['100::', 64], ['2001:db8::', 32],
    ['fc00::', 7], ['fe80::', 10], ['ff00::', 8],
] as const) {
    blockedAddresses.addSubnet(network, prefix, 'ipv6');
}

function isBlockedAddress(address: string): boolean {
    const mapped = /^::ffff:(\d+\.\d+\.\d+\.\d+)$/i.exec(address);
    if (mapped) return blockedAddresses.check(mapped[1], 'ipv4');
    const family = net.isIP(address);
    if (family === 4) return blockedAddresses.check(address, 'ipv4');
    if (family === 6) return blockedAddresses.check(address, 'ipv6');
    return true;
}

function parseHost(value: unknown): string | null {
    if (typeof value !== 'string') return null;
    const host = value.trim().replace(/^\[(.*)\]$/, '$1');
    if (net.isIP(host) || HOSTNAME_PATTERN.test(host)) return host;
    return null;
}

function parsePort(value: unknown): number | null {
    if (typeof value !== 'number' && typeof value !== 'string') return null;
    if (typeof value === 'string' && !/^\s*\d{1,5}\s*$/.test(value)) return null;
    const port = Number(value);
    return Number.isInteger(port) && port >= 1 && port <= 65535 ? port : null;
}

function fail(res: NextApiResponse<NtripResponse>, status: number, code: NtripErrorCode, message: string) {
    return res.status(status).json({ success: false, code, message });
}

class ScanError extends Error {
    constructor(public code: 'unreachable' | 'timeout') {
        super(code);
    }
}

function fetchSourceTable(address: string, port: number): Promise<string> {
    return new Promise((resolve, reject) => {
        const socket = new net.Socket();
        const chunks: Buffer[] = [];
        let received = 0;
        let settled = false;

        const finish = (error?: ScanError) => {
            if (settled) return;
            settled = true;
            clearTimeout(deadline);
            socket.destroy();
            if (error) reject(error);
            else resolve(Buffer.concat(chunks).toString());
        };

        const deadline = setTimeout(() => finish(new ScanError('timeout')), TOTAL_TIMEOUT_MS);
        socket.setTimeout(CONNECT_TIMEOUT_MS, () => finish(new ScanError('timeout')));

        socket.connect(port, address, () => {
            socket.write('GET / HTTP/1.0\r\nUser-Agent: NTRIP client\r\n\r\n');
        });
        socket.on('data', (chunk: Buffer) => {
            const remaining = MAX_RESPONSE_BYTES - received;
            chunks.push(chunk.subarray(0, remaining));
            received += Math.min(chunk.length, remaining);
            if (received >= MAX_RESPONSE_BYTES) finish();
        });
        socket.on('end', () => finish());
        socket.on('close', () => finish());
        socket.on('error', () => finish(new ScanError('unreachable')));
    });
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<NtripResponse>
) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return fail(res, 405, 'methodNotAllowed', 'Method not allowed');
    }

    const host = parseHost(req.body?.host);
    if (!host) {
        return fail(res, 400, 'invalidHost', 'Invalid host');
    }

    const port = parsePort(req.body?.port);
    if (port === null) {
        return fail(res, 400, 'invalidPort', 'Invalid port');
    }
    if (!NTRIP_ALLOWED_PORTS.includes(port)) {
        return fail(res, 400, 'portNotAllowed', 'Port not allowed');
    }

    let addresses: string[];
    try {
        addresses = (await lookup(host, { all: true, verbatim: true })).map((entry) => entry.address);
    } catch {
        return fail(res, 502, 'unreachable', 'Could not reach the caster');
    }
    // Reject if any resolved address is internal, then connect to the checked IP
    // directly so a second DNS answer cannot redirect the connection.
    if (addresses.length === 0 || addresses.some(isBlockedAddress)) {
        return fail(res, 403, 'blockedAddress', 'Address not allowed');
    }

    try {
        const data = await fetchSourceTable(addresses[0], port);
        return res.status(200).json({
            success: true,
            message: 'OK',
            mountPoints: parseMountPoints(data),
        });
    } catch (error) {
        if (error instanceof ScanError && error.code === 'timeout') {
            return fail(res, 504, 'timeout', 'Connection timed out');
        }
        return fail(res, 502, 'unreachable', 'Could not reach the caster');
    }
}

function parseMountPoints(data: string): string[] {
    const mountPoints: string[] = [];
    const lines = data.split(/\r?\n/);

    for (const line of lines) {
        if (line.startsWith('STR;')) {
            const parts = line.split(';');
            if (parts.length > 1) {
                mountPoints.push(parts[1]);
            }
        }
    }

    return mountPoints;
}
