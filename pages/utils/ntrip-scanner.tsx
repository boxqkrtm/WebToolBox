import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from "@/components/ui/label";

interface ErrorDetails {
    message: string;
    details?: {
        host: string;
        port: number;
        connectionStatus: string;
        error?: string;
    };
}

export default function NtripScanner() {
    const [ip, setIp] = useState('rts2.ngii.go.kr');
    const [port, setPort] = useState('2101');
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [mountPoints, setMountPoints] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<ErrorDetails | null>(null);

    const handleScan = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/ntrip-scan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ host: ip, port }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(JSON.stringify(data));
            }
            setMountPoints(data.mountPoints || []);
        } catch (err) {
            let errorData: ErrorDetails;
            try {
                errorData = err instanceof Error ? JSON.parse(err.message) : {
                    message: '알 수 없는 오류가 발생했습니다',
                    details: { host: ip, port: Number(port), connectionStatus: '실패' }
                };
            } catch {
                errorData = {
                    message: err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다',
                    details: { host: ip, port: Number(port), connectionStatus: '실패' }
                };
            }
            setError(errorData);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center p-6 bg-gray-50 min-h-screen">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center text-2xl font-bold text-gray-800">
                        NTRIP Mount Point Scanner
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="ip">Caster IP</Label>
                            <Input
                                id="ip"
                                value={ip}
                                onChange={(e) => setIp(e.target.value)}
                                placeholder="예: rts2.ngii.go.kr"
                            />
                        </div>
                        <div>
                            <Label htmlFor="port">Port</Label>
                            <Input
                                id="port"
                                value={port}
                                onChange={(e) => setPort(e.target.value)}
                                placeholder="예: 2101"
                            />
                        </div>
                        <div>
                            <Label htmlFor="id">ID</Label>
                            <Input
                                id="id"
                                value={id}
                                onChange={(e) => setId(e.target.value)}
                                autoComplete="new-password"
                            />
                        </div>
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="new-password"
                            />
                        </div>
                        <Button
                            className="w-full"
                            onClick={handleScan}
                            disabled={loading}
                        >
                            {loading ? '스캔 중...' : '스캔 시작'}
                        </Button>
                        {error && (
                            <div className="text-red-500">
                                {error.message}
                            </div>
                        )}
                        {mountPoints.length > 0 && (
                            <div>
                                <h2 className="text-xl font-bold">마운트포인트 리스트</h2>
                                <ul>
                                    {mountPoints.map((mountPoint, index) => (
                                        <li key={index}>{mountPoint}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}