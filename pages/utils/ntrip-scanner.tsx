import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from "@/components/ui/label";
import UtilsLayout from '@/components/layout/UtilsLayout';
import { useI18n } from '@/lib/i18n/i18nContext';
import { NTRIP_ALLOWED_PORTS, type NtripErrorCode } from '@/lib/ntrip/shared';

export default function NtripScanner() {
    const { t } = useI18n();
    const [ip, setIp] = useState('rts2.ngii.go.kr');
    const [port, setPort] = useState('2101');
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [mountPoints, setMountPoints] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const allowedPortsText = `${t('common.tools.ntripScanner.page.allowedPorts')} ${NTRIP_ALLOWED_PORTS.join(', ')}`;

    const errorMessage = (code: NtripErrorCode | undefined): string => {
        switch (code) {
            case 'invalidHost':
                return t('common.tools.ntripScanner.page.errors.invalidHost');
            case 'invalidPort':
                return t('common.tools.ntripScanner.page.errors.invalidPort');
            case 'portNotAllowed':
                return allowedPortsText;
            case 'blockedAddress':
                return t('common.tools.ntripScanner.page.errors.blockedAddress');
            case 'timeout':
                return t('common.tools.ntripScanner.page.errors.timeout');
            case 'unreachable':
                return t('common.tools.ntripScanner.page.connectionFailed');
            default:
                return t('common.tools.ntripScanner.page.unknownError');
        }
    };

    const handleScan = async () => {
        setLoading(true);
        setError(null);
        setMountPoints([]);
        try {
            const response = await fetch('/api/ntrip-scan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ host: ip, port }),
            });
            const data = await response.json().catch(() => null);
            if (!response.ok || !data?.success) {
                setError(errorMessage(data?.code));
                return;
            }
            setMountPoints(data.mountPoints || []);
        } catch {
            setError(t('common.tools.ntripScanner.page.unknownError'));
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
                            <p className="mt-1 text-xs text-muted-foreground">{allowedPortsText}</p>
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
                            <div className="text-red-500" role="alert" data-testid="ntrip-error">
                                {error}
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
