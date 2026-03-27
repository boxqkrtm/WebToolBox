'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import UtilsLayout from '@/components/layout/UtilsLayout'
import { useI18n } from '@/lib/i18n/i18nContext'

export default function Component() {
    const { t } = useI18n()
    const defaultLatitude = '37.402056'
    const defaultLongitude = '127.108212'

    const [latitude, setLatitude] = useState('')
    const [longitude, setLongitude] = useState('')

    const handleOpenMap = () => {
        const lat = latitude || defaultLatitude
        const lng = longitude || defaultLongitude
        const url = `https://map.kakao.com/link/map/KakaoMapCoordOpener,${lat},${lng}`
        window.open(url, '_blank')
    }

    return (
        <UtilsLayout>
            <Card className="mx-auto w-full max-w-md">
                <CardHeader className="space-y-2">
                    <CardTitle>{t('common.tools.kakaomapCoordOpener.title')}</CardTitle>
                    <CardDescription>
                        {t('common.tools.kakaomapCoordOpener.page.description')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="latitude">{t('common.tools.kakaomapCoordOpener.page.latitudeLabel')}</Label>
                            <Input
                                id="latitude"
                                placeholder={defaultLatitude}
                                value={latitude}
                                onChange={(e) => setLatitude(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="longitude">{t('common.tools.kakaomapCoordOpener.page.longitudeLabel')}</Label>
                            <Input
                                id="longitude"
                                placeholder={defaultLongitude}
                                value={longitude}
                                onChange={(e) => setLongitude(e.target.value)}
                            />
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" onClick={handleOpenMap}>
                        {t('common.tools.kakaomapCoordOpener.page.openButton')}
                    </Button>
                </CardFooter>
            </Card>
        </UtilsLayout>
    )
}
