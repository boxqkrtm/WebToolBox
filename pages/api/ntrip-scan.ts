import { NextApiRequest, NextApiResponse } from 'next';
import net from 'net';

interface NtripResponse {
    success: boolean;
    message: string;
    details?: {
        host: string;
        port: number;
        connectionStatus: string;
        error?: string;
    };
    mountPoints?: string[];
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<NtripResponse>
) {
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            message: '허용되지 않는 메소드입니다.',
            details: {
                host: '',
                port: 0,
                connectionStatus: '실패',
                error: '잘못된 HTTP 메소드'
            }
        });
    }

    const { host, port } = req.body;

    if (!host || !port) {
        return res.status(400).json({
            success: false,
            message: '필수 매개변수가 누락되었습니다.',
            details: {
                host: host || '',
                port: port || 0,
                connectionStatus: '실패',
                error: 'host와 port는 필수 값입니다.'
            }
        });
    }

    try {
        const socket = new net.Socket();
        const connectionPromise = new Promise<string[]>((resolve, reject) => {
            let data = '';

            socket.connect(port, host, () => {
                socket.write('GET / HTTP/1.0\r\nUser-Agent: NTRIP client\r\n\r\n');
            });

            socket.on('data', (chunk) => {
                data += chunk.toString();
            });

            socket.on('end', () => {
                const mountPoints = parseMountPoints(data);
                resolve(mountPoints);
            });

            socket.on('error', (error) => {
                reject(error);
            });
        });

        const mountPoints = await connectionPromise;

        return res.status(200).json({
            success: true,
            message: 'NTRIP 서버 연결 성공',
            details: {
                host,
                port,
                connectionStatus: '성공'
            },
            mountPoints
        });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
        return res.status(500).json({
            success: false,
            message: 'NTRIP 서버 연결 실패',
            details: {
                host,
                port,
                connectionStatus: '실패',
                error: errorMessage
            }
        });
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