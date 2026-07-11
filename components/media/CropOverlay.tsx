import {
  useEffect,
  useRef,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react"

export interface CropRect {
  x: number
  y: number
  width: number
  height: number
}

export interface CropOverlayLabels {
  group: string
  move: string
  topLeft: string
  top: string
  topRight: string
  right: string
  bottomRight: string
  bottom: string
  bottomLeft: string
  left: string
}

interface CropOverlayProps {
  value: CropRect
  onChange: (value: CropRect) => void
  labels: CropOverlayLabels
  disabled?: boolean
  children?: ReactNode
}

type ResizeHandle =
  | "topLeft"
  | "top"
  | "topRight"
  | "right"
  | "bottomRight"
  | "bottom"
  | "bottomLeft"
  | "left"

type DragMode = "move" | ResizeHandle

interface Gesture {
  pointerId: number
  mode: DragMode
  startClientX: number
  startClientY: number
  containerWidth: number
  containerHeight: number
  value: CropRect
}

interface HandleDefinition {
  mode: ResizeHandle
  cursor: string
}

const MIN_SIZE = 5
const KEYBOARD_STEP = 1
const KEYBOARD_LARGE_STEP = 5

const HANDLES: HandleDefinition[] = [
  { mode: "topLeft", cursor: "cursor-nwse-resize" },
  { mode: "top", cursor: "cursor-ns-resize" },
  { mode: "topRight", cursor: "cursor-nesw-resize" },
  { mode: "right", cursor: "cursor-ew-resize" },
  { mode: "bottomRight", cursor: "cursor-nwse-resize" },
  { mode: "bottom", cursor: "cursor-ns-resize" },
  { mode: "bottomLeft", cursor: "cursor-nesw-resize" },
  { mode: "left", cursor: "cursor-ew-resize" },
]

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum)
}


function normalizeCrop(value: CropRect): CropRect {
  const width = clamp(
    Number.isFinite(value.width) ? value.width : MIN_SIZE,
    MIN_SIZE,
    100
  )
  const height = clamp(
    Number.isFinite(value.height) ? value.height : MIN_SIZE,
    MIN_SIZE,
    100
  )

  return {
    x: clamp(Number.isFinite(value.x) ? value.x : 0, 0, 100 - width),
    y: clamp(Number.isFinite(value.y) ? value.y : 0, 0, 100 - height),
    width,
    height,
  }
}

function changeCrop(
  value: CropRect,
  mode: DragMode,
  deltaX: number,
  deltaY: number
): CropRect {
  if (mode === "move") {
    return {
      ...value,
      x: clamp(value.x + deltaX, 0, 100 - value.width),
      y: clamp(value.y + deltaY, 0, 100 - value.height),
    }
  }

  let left = value.x
  let top = value.y
  let right = value.x + value.width
  let bottom = value.y + value.height

  const changesLeft =
    mode === "left" || mode === "topLeft" || mode === "bottomLeft"
  const changesRight =
    mode === "right" || mode === "topRight" || mode === "bottomRight"
  const changesTop =
    mode === "top" || mode === "topLeft" || mode === "topRight"
  const changesBottom =
    mode === "bottom" || mode === "bottomLeft" || mode === "bottomRight"

  if (changesLeft) {
    left = clamp(left + deltaX, 0, right - MIN_SIZE)
  }
  if (changesRight) {
    right = clamp(right + deltaX, left + MIN_SIZE, 100)
  }
  if (changesTop) {
    top = clamp(top + deltaY, 0, bottom - MIN_SIZE)
  }
  if (changesBottom) {
    bottom = clamp(bottom + deltaY, top + MIN_SIZE, 100)
  }

  return {
    x: left,
    y: top,
    width: right - left,
    height: bottom - top,
  }
}

function getHandleStyle(value: CropRect, mode: ResizeHandle): CSSProperties {
  let left = value.x + value.width / 2
  let top = value.y + value.height / 2

  if (mode === "left" || mode === "topLeft" || mode === "bottomLeft") {
    left = value.x
  } else if (
    mode === "right" ||
    mode === "topRight" ||
    mode === "bottomRight"
  ) {
    left = value.x + value.width
  }

  if (mode === "top" || mode === "topLeft" || mode === "topRight") {
    top = value.y
  } else if (
    mode === "bottom" ||
    mode === "bottomLeft" ||
    mode === "bottomRight"
  ) {
    top = value.y + value.height
  }

  return {
    left: `${left}%`,
    top: `${top}%`,
  }
}

export function CropOverlay({
  value,
  onChange,
  labels,
  disabled = false,
  children,
}: CropOverlayProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const gestureRef = useRef<Gesture | null>(null)
  useEffect(() => {
    if (disabled) {
      gestureRef.current = null
    }
  }, [disabled])
  const crop = normalizeCrop(value)
  const selectionStyle: CSSProperties = {
    left: `${crop.x}%`,
    top: `${crop.y}%`,
    width: `${crop.width}%`,
    height: `${crop.height}%`,
  }

  const startGesture = (
    event: ReactPointerEvent<HTMLButtonElement>,
    mode: DragMode
  ) => {
    if (disabled || !event.isPrimary || event.button !== 0) {
      return
    }

    const bounds = rootRef.current?.getBoundingClientRect()
    if (!bounds || bounds.width <= 0 || bounds.height <= 0) {
      return
    }

    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    gestureRef.current = {
      pointerId: event.pointerId,
      mode,
      startClientX: event.clientX,
      startClientY: event.clientY,
      containerWidth: bounds.width,
      containerHeight: bounds.height,
      value: crop,
    }
  }

  const continueGesture = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const gesture = gestureRef.current
    if (disabled || !gesture || gesture.pointerId !== event.pointerId) {
      return
    }

    event.preventDefault()
    const deltaX =
      ((event.clientX - gesture.startClientX) / gesture.containerWidth) * 100
    const deltaY =
      ((event.clientY - gesture.startClientY) / gesture.containerHeight) * 100
    onChange(changeCrop(gesture.value, gesture.mode, deltaX, deltaY))
  }

  const endGesture = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (gestureRef.current?.pointerId !== event.pointerId) {
      return
    }

    gestureRef.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  const changeWithKeyboard = (
    event: KeyboardEvent<HTMLButtonElement>,
    mode: DragMode
  ) => {
    if (disabled) {
      return
    }

    const step = event.shiftKey ? KEYBOARD_LARGE_STEP : KEYBOARD_STEP
    let deltaX = 0
    let deltaY = 0

    switch (event.key) {
      case "ArrowLeft":
        deltaX = -step
        break
      case "ArrowRight":
        deltaX = step
        break
      case "ArrowUp":
        deltaY = -step
        break
      case "ArrowDown":
        deltaY = step
        break
      default:
        return
    }

    event.preventDefault()
    onChange(changeCrop(crop, mode, deltaX, deltaY))
  }

  return (
    <div
      ref={rootRef}
      role="group"
      aria-label={labels.group}
      aria-disabled={disabled || undefined}
      data-testid="crop-overlay"
      className="relative h-full w-full overflow-hidden"
    >
      <div className="absolute inset-0">{children}</div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 w-full bg-black/60"
        style={{ height: `${crop.y}%` }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 w-full bg-black/60"
        style={{ height: `${100 - crop.y - crop.height}%` }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bg-black/60"
        style={{
          left: 0,
          top: `${crop.y}%`,
          width: `${crop.x}%`,
          height: `${crop.height}%`,
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 bg-black/60"
        style={{
          top: `${crop.y}%`,
          width: `${100 - crop.x - crop.width}%`,
          height: `${crop.height}%`,
        }}
      />

      <button
        type="button"
        aria-label={labels.move}
        title={labels.move}
        disabled={disabled}
        data-testid="crop-selection"
        className="absolute z-10 m-0 touch-none appearance-none overflow-hidden border-2 border-primary bg-transparent p-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed"
        style={selectionStyle}
        onPointerDown={(event) => startGesture(event, "move")}
        onPointerMove={continueGesture}
        onPointerUp={endGesture}
        onPointerCancel={endGesture}
        onLostPointerCapture={() => {
          gestureRef.current = null
        }}
        onKeyDown={(event) => changeWithKeyboard(event, "move")}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 top-0 border-l border-white/70"
          style={{ left: "33.333333%" }}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 top-0 border-l border-white/70"
          style={{ left: "66.666667%" }}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-0 right-0 border-t border-white/70"
          style={{ top: "33.333333%" }}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-0 right-0 border-t border-white/70"
          style={{ top: "66.666667%" }}
        />
      </button>

      {HANDLES.map(({ mode, cursor }) => (
        <button
          key={mode}
          type="button"
          aria-label={labels[mode]}
          title={labels[mode]}
          disabled={disabled}
          className={`group absolute z-20 flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 touch-none items-center justify-center rounded-sm bg-transparent p-0 ${cursor} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring disabled:cursor-not-allowed`}
          style={getHandleStyle(crop, mode)}
          onPointerDown={(event) => startGesture(event, mode)}
          onPointerMove={continueGesture}
          onPointerUp={endGesture}
          onPointerCancel={endGesture}
          onLostPointerCapture={() => {
            gestureRef.current = null
          }}
          onKeyDown={(event) => changeWithKeyboard(event, mode)}
        >
          <span
            aria-hidden="true"
            className="h-3 w-3 rounded-sm border-2 border-primary bg-background shadow-sm transition-transform group-focus-visible:scale-125"
          />
        </button>
      ))}
    </div>
  )
}

export default CropOverlay
