'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Component() {
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
        <Card className="w-full max-w-md mx-auto mt-10">
            <CardHeader>
                <CardTitle>Kakaomap Coord Opener</CardTitle>
                <CardDescription>
                    위도와 경도를 입력하여 카카오맵에서 해당 위치를 확인하세요.
                    입력하지 않으면 기본 좌표(37.402056, 127.108212)가 사용됩니다.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="latitude">위도</Label>
                        <Input
                            id="latitude"
                            placeholder={defaultLatitude}
                            value={latitude}
                            onChange={(e) => setLatitude(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="longitude">경도</Label>
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
                <Button className="w-full" onClick={handleOpenMap}>카카오맵에서 열기</Button>
            </CardFooter>
        </Card>
    )
}