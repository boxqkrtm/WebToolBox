import encodeQR from 'qr'

export type DitheredQrEcc = 'low' | 'medium' | 'quartile' | 'high'

export type DitheredQrSettings = {
  version: number
  ecc: DitheredQrEcc
  scale: number
  mask?: number
  gamma: number
  contrast: number
  brightness: number
  minBrightness: number
  maxBrightness: number
  forBlackBackground: boolean
  rotation: number
  reflection: boolean
  lockPositioning: boolean
  lockTiming: boolean
  lockAlignment: boolean
  diffuseData: boolean
  diffuseFree: boolean
  includeImage: boolean
}

export const DEFAULT_DITHERED_QR: DitheredQrSettings = {
  version: 6,
  ecc: 'high',
  scale: 3,
  gamma: 2.2,
  contrast: 1,
  brightness: 0,
  minBrightness: 0.05,
  maxBrightness: 0.95,
  forBlackBackground: false,
  rotation: 0,
  reflection: false,
  lockPositioning: true,
  lockTiming: true,
  lockAlignment: true,
  diffuseData: true,
  diffuseFree: true,
  includeImage: true,
}

const ALIGNMENT_CENTERS: ReadonlyArray<readonly number[] | null> = [
  null,
  [],
  [6, 18],
  [6, 22],
  [6, 26],
  [6, 30],
  [6, 34],
  [6, 22, 38],
  [6, 24, 42],
  [6, 26, 46],
  [6, 28, 50],
  [6, 30, 54],
  [6, 32, 58],
  [6, 34, 62],
  [6, 26, 46, 66],
  [6, 26, 48, 70],
  [6, 26, 50, 74],
  [6, 30, 54, 78],
  [6, 30, 56, 82],
  [6, 30, 58, 86],
  [6, 34, 62, 90],
  [6, 28, 50, 72, 94],
  [6, 26, 50, 74, 98],
  [6, 30, 54, 78, 102],
  [6, 28, 54, 80, 106],
  [6, 32, 58, 84, 110],
  [6, 30, 58, 86, 114],
  [6, 34, 62, 90, 118],
  [6, 26, 50, 74, 98, 122],
  [6, 30, 54, 78, 102, 126],
  [6, 26, 52, 78, 104, 130],
  [6, 30, 56, 82, 108, 134],
  [6, 34, 60, 86, 112, 138],
  [6, 30, 58, 86, 114, 142],
  [6, 34, 62, 90, 118, 146],
  [6, 30, 54, 78, 102, 126, 150],
  [6, 24, 50, 76, 102, 128, 154],
  [6, 28, 54, 80, 106, 132, 158],
  [6, 32, 58, 84, 110, 136, 162],
  [6, 26, 54, 82, 110, 138, 166],
  [6, 30, 58, 86, 114, 142, 170],
]

export function resolveDitheredQrSettings(
  settings?: Partial<DitheredQrSettings>,
): DitheredQrSettings {
  return { ...DEFAULT_DITHERED_QR, ...settings }
}

export function isDataPixel(x: number, y: number, scale: number) {
  const mid = Math.trunc(scale / 2)
  const xs = ((x % scale) + scale) % scale
  const ys = ((y % scale) + scale) % scale
  if (xs === mid && ys === mid) return true
  if (scale & 1) return false
  if (xs === mid && ys === mid - 1) return true
  if (xs === mid - 1 && ys === mid) return true
  if (xs === mid - 1 && ys === mid - 1) return true
  return false
}

export function isLockedPixel(
  pixelSize: number,
  x: number,
  y: number,
  settings: DitheredQrSettings,
) {
  const scale = settings.scale
  let moduleSize = pixelSize / scale
  let moduleX = Math.trunc(x / scale)
  let moduleY = Math.trunc(y / scale)

  if (moduleX < 0 || moduleY < 0 || moduleX >= moduleSize || moduleY >= moduleSize) {
    return true
  }

  if (settings.reflection) moduleX = moduleSize - moduleX - 1

  const turns = ((settings.rotation % 4) + 4) % 4
  for (let i = 0; i < turns; i += 1) {
    const nextX = moduleY
    const nextY = moduleSize - moduleX - 1
    moduleX = nextX
    moduleY = nextY
  }

  if (moduleX < 7 && moduleY < 7) return settings.lockPositioning
  if (moduleX < 7 && moduleY > moduleSize - 8) return settings.lockPositioning
  if (moduleX > moduleSize - 8 && moduleY < 7) return settings.lockPositioning
  if (moduleX === 6 || moduleY === 6) return settings.lockTiming

  const centers = alignmentCenters(moduleSize)
  if (!centers.length) return false

  const xBlock = alignmentBlockIndex(moduleX, centers)
  const yBlock = alignmentBlockIndex(moduleY, centers)
  if (xBlock == null || yBlock == null) return false
  if (xBlock === 0 && yBlock === 0) return false
  if (xBlock === 0 && yBlock === centers.length - 1) return false
  if (xBlock === centers.length - 1 && yBlock === 0) return false
  return settings.lockAlignment
}

export function encodeDitheredQr(text: string, settings: DitheredQrSettings) {
  const options = {
    border: 0,
    ecc: settings.ecc,
    version: settings.version,
    mask: settings.mask,
    scale: settings.scale,
  }

  let qr: boolean[][]
  try {
    qr = encodeQR(text, 'raw', options)
  } catch (error) {
    if (error instanceof Error && error.message === 'Capacity overflow' && options.version < 40) {
      qr = encodeQR(text, 'raw', { ...options, version: undefined })
    } else {
      throw error
    }
  }

  const inverted = !settings.forBlackBackground
  if (inverted) {
    qr = qr.map((row) => row.map((cell) => !cell))
  }

  const size = qr.length
  const turns = ((settings.rotation % 4) + 4) % 4
  for (let i = 0; i < turns; i += 1) {
    const rotated: boolean[][] = Array.from({ length: size }, () => Array<boolean>(size).fill(false))
    for (let x = 0; x < size; x += 1) {
      for (let y = size - 1; y >= 0; y -= 1) {
        rotated[x][size - y - 1] = qr[y][x]
      }
    }
    qr = rotated
  }

  if (settings.reflection) {
    for (let y = 0; y < size; y += 1) qr[y] = qr[y].slice().reverse()
  }

  return qr
}

export function imageDataToBrightness(
  image: Pick<ImageData, 'data' | 'width' | 'height'>,
  settings: DitheredQrSettings,
) {
  const size = image.width
  const output: number[][] = []
  for (let y = 0; y < size; y += 1) {
    const row: number[] = []
    for (let x = 0; x < size; x += 1) {
      let value = image.data[(x + y * size) * 4 + 1] / 255
      value **= settings.gamma
      value -= 0.5
      value *= settings.contrast
      value += settings.brightness + 0.5
      if (value < settings.minBrightness) value = settings.minBrightness
      if (value > settings.maxBrightness) value = settings.maxBrightness
      row.push(value)
    }
    output.push(row)
  }
  return output
}

export function diffuseDataPoints(
  imageData: number[][],
  qr: boolean[][],
  settings: DitheredQrSettings,
) {
  const scale = settings.scale
  const size = imageData.length
  if (scale & 1) {
    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        if (isLockedPixel(size, x, y, settings) || !isDataPixel(x, y, scale)) continue
        const error = imageData[y][x] - Number(qr[y][x])
        addError(imageData, x, y - 1, error * 3 / 16)
        addError(imageData, x, y + 1, error * 3 / 16)
        addError(imageData, x - 1, y, error * 3 / 16)
        addError(imageData, x + 1, y, error * 3 / 16)
        addError(imageData, x - 1, y - 1, error / 16)
        addError(imageData, x - 1, y + 1, error / 16)
        addError(imageData, x + 1, y - 1, error / 16)
        addError(imageData, x + 1, y + 1, error / 16)
      }
    }
    return
  }

  const mid = scale / 2 - 1
  for (let y = mid; y < size; y += scale) {
    for (let x = mid; x < size; x += scale) {
      if (isLockedPixel(size, x, y, settings)) continue
      for (const dx of [-1, 1]) {
        for (const dy of [-1, 1]) {
          const sx = x + 0.5 + dx * 0.5
          const sy = y + 0.5 + dy * 0.5
          const error = imageData[sy][sx] - Number(qr[sy][sx])
          addError(imageData, sx + dx, sy, error * 6 / 16)
          addError(imageData, sx, sy + dy, error * 6 / 16)
          addError(imageData, sx + dx, sy + dy, error * 4 / 16)
        }
      }
    }
  }
}

export function diffuseFreePoints(imageData: number[][], settings: DitheredQrSettings) {
  const size = imageData.length
  const canChange = (x: number, y: number) =>
    x >= 0 && y >= 0 && x < size && y < size &&
    !isLockedPixel(size, x, y, settings) &&
    !isDataPixel(x, y, settings.scale)

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      if (!canChange(x, y)) continue
      const actual = Math.round(imageData[y][x])
      const error = imageData[y][x] - actual
      imageData[y][x] = actual
      const right = canChange(x + 1, y)
      const downLeft = canChange(x - 1, y + 1)
      const down = canChange(x, y + 1)
      const downRight = canChange(x + 1, y + 1)
      const total = Number(right) * 7 + Number(downLeft) * 3 + Number(down) * 5 + Number(downRight)
      if (!total) continue
      if (right) imageData[y][x + 1] += error * 7 / total
      if (downLeft) imageData[y + 1][x - 1] += error * 3 / total
      if (down) imageData[y + 1][x] += error * 5 / total
      if (downRight) imageData[y + 1][x + 1] += error / total
    }
  }
}

export function applyDitheredImage(
  qr: boolean[][],
  imageData: number[][],
  settings: DitheredQrSettings,
) {
  const size = qr.length
  const pixels = imageData.map((row) => row.slice())

  if (settings.diffuseData) diffuseDataPoints(pixels, qr, settings)
  if (settings.diffuseFree) diffuseFreePoints(pixels, settings)

  if (settings.includeImage) {
    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        if (isLockedPixel(size, x, y, settings) || isDataPixel(x, y, settings.scale)) continue
        qr[y][x] = pixels[y][x] > 0.5
      }
    }
  }

  return qr
}

export function generateDitheredQr(
  text: string,
  image: Pick<ImageData, 'data' | 'width' | 'height'>,
  settings?: Partial<DitheredQrSettings>,
) {
  const resolved = resolveDitheredQrSettings(settings)
  const qr = encodeDitheredQr(text, resolved)
  if (image.width !== qr.length || image.height !== qr.length) {
    throw new Error('Image must already be resized to the QR pixel grid')
  }
  const brightness = imageDataToBrightness(image, resolved)
  return applyDitheredImage(qr, brightness, resolved)
}

function addError(imageData: number[][], x: number, y: number, error: number) {
  if (y < 0 || x < 0 || y >= imageData.length || x >= imageData[y].length) return
  imageData[y][x] += error
}

function alignmentCenters(moduleSize: number) {
  const version = (moduleSize - 17) / 4
  return ALIGNMENT_CENTERS[version] ?? []
}

function alignmentBlockIndex(coordinate: number, centers: readonly number[]) {
  for (let index = 0; index < centers.length; index += 1) {
    const center = centers[index]
    if (coordinate < center - 2) return null
    if (coordinate < center + 3) return index
  }
  return null
}
