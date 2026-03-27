import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from "@/components/ui/label";
import UtilsLayout from '@/components/layout/UtilsLayout';
import { useI18n } from '@/lib/i18n/i18nContext';

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
    const { t } = useI18n();
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
                    message: t('common.tools.ntripScanner.page.unknownError'),
                    details: { host: ip, port: Number(port), connectionStatus: t('common.tools.ntripScanner.page.connectionFailed') }
                };
            } catch {
                errorData = {
                    message: err instanceof Error ? err.message : t('common.tools.ntripScanner.page.unknownError'),
                    details: { host: ip, port: Number(port), connectionStatus: t('common.tools.ntripScanner.page.connectionFailed') }
                };
            }
            setError(errorData);
        } finally {
            setLoading(false);
        }
    };

    return (
        <UtilsLayout>
            <Card className="mx-auto w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center text-2xl font-bold">
                        {t('common.tools.ntripScanner.page.title')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="ip">{t('common.tools.ntripScanner.page.casterIp')}</Label>
                            <Input
                                id="ip"
                                value={ip}
                                onChange={(e) => setIp(e.target.value)}
                                placeholder={t('common.tools.ntripScanner.page.hostPlaceholder')}
                            />
                        </div>
                        <div>
                            <Label htmlFor="port">{t('common.tools.ntripScanner.page.port')}</Label>
                            <Input
                                id="port"
                                value={port}
                                onChange={(e) => setPort(e.target.value)}
                                placeholder={t('common.tools.ntripScanner.page.portPlaceholder')}
                            />
                        </div>
                        <div>
                            <Label htmlFor="id">{t('common.tools.ntripScanner.page.id')}</Label>
                            <Input
                                id="id"
                                value={id}
                                onChange={(e) => setId(e.target.value)}
                                autoComplete="new-password"
                            />
                        </div>
                        <div>
                            <Label htmlFor="password">{t('common.tools.ntripScanner.page.password')}</Label>
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
                            {loading ? t('common.tools.ntripScanner.page.scanning') : t('common.tools.ntripScanner.page.scanStart')}
                        </Button>
                        {error && (
                            <div className="text-red-500">
                                {error.message}
                            </div>
                        )}
                        {mountPoints.length > 0 && (
                            <div className="space-y-2">
                                <h2 className="text-xl font-bold">{t('common.tools.ntripScanner.page.mountPointList')}</h2>
                                <ul className="space-y-1 text-sm text-muted-foreground">
                                    {mountPoints.map((mountPoint, index) => (
                                        <li key={index}>{mountPoint}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </UtilsLayout>
    );
}
