import Link from 'next/link'

import UtilsLayout from '@/components/layout/UtilsLayout'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useI18n } from '@/lib/i18n/i18nContext'

type ThirdPartyComponent = {
  name: string
  license: string
  website: string
  source: string
  note?: string
}

const THIRD_PARTY_COMPONENTS: ThirdPartyComponent[] = [
  {
    name: 'FFmpeg (ffmpeg.wasm core, @ffmpeg/core)',
    license: 'GPL v2.0 or later (built with libx264)',
    website: 'https://ffmpeg.org',
    source: 'https://github.com/FFmpeg/FFmpeg',
  },
  {
    name: 'ffmpeg.wasm (@ffmpeg/ffmpeg, @ffmpeg/util)',
    license: 'MIT',
    website: 'https://ffmpegwasm.netlify.app',
    source: 'https://github.com/ffmpegwasm/ffmpeg.wasm',
  },
  {
    name: 'Gifsicle',
    license: 'GPL v2.0',
    website: 'https://www.lcdf.org/gifsicle/',
    source: 'https://github.com/kohler/gifsicle',
  },
  {
    name: 'gifsicle-wasm-browser',
    license: 'MIT',
    website: 'https://renzhezhilu.github.io/gifsicle-wasm-browser/',
    source: 'https://github.com/renzhezhilu/gifsicle-wasm-browser',
  },
]

export default function LicensesPage() {
  const { t } = useI18n()

  return (
    <UtilsLayout
      title={t('common.licenses.title')}
      description={t('common.licenses.description')}
    >
      <div className="mx-auto max-w-3xl space-y-5">
        <p className="text-sm text-muted-foreground">
          {t('common.licenses.runtimeNote')}
        </p>

        {THIRD_PARTY_COMPONENTS.map((component) => (
          <Card key={component.name}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{component.name}</CardTitle>
              <CardDescription>
                {t('common.licenses.licenseLabel')}: {component.license}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4 text-sm">
              <a
                href={component.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {t('common.licenses.websiteLabel')}
              </a>
              <a
                href={component.source}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {t('common.licenses.sourceLabel')}
              </a>
            </CardContent>
          </Card>
        ))}

        <p className="text-sm text-muted-foreground">
          <Link
            href="https://github.com/boxqkrtm/WebToolBox/blob/main/LICENSE"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            LICENSE
          </Link>
        </p>
      </div>
    </UtilsLayout>
  )
}
