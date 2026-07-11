import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

const TIME_STEP = 0.01
const DEFAULT_MINIMUM_GAP = 0.05

export type TimeRangeEndpoint = "start" | "end"

export interface TimeRangeLabels {
  range: string
  start: string
  end: string
  selection: string
}

export interface TimeRangeControlProps {
  duration: number
  value: readonly [number, number]
  onChange: (
    value: [number, number],
    movedEndpoint: TimeRangeEndpoint
  ) => void
  labels: TimeRangeLabels
  minimumGap?: number
  disabled?: boolean
  className?: string
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum)
}

function roundToTimeStep(value: number) {
  if (Math.abs(value) > Number.MAX_SAFE_INTEGER * TIME_STEP) return value
  return Math.round(value / TIME_STEP) * TIME_STEP
}

function normalizeTime(value: number, fallback: number, duration: number) {
  const finiteValue = Number.isFinite(value) ? value : fallback
  return clamp(roundToTimeStep(clamp(finiteValue, 0, duration)), 0, duration)
}

function normalizeRange(
  value: readonly [number, number],
  duration: number,
  minimumGap: number
): [number, number] {
  if (duration === 0) return [0, 0]

  const first = normalizeTime(value[0], 0, duration)
  const second = normalizeTime(value[1], duration, duration)
  let start = Math.min(first, second)
  let end = Math.max(first, second)

  if (end - start < minimumGap) {
    if (start + minimumGap <= duration) {
      end = start + minimumGap
    } else {
      end = duration
      start = duration - minimumGap
    }
  }

  return [clamp(start, 0, duration), clamp(end, 0, duration)]
}

/** Formats seconds as MM:SS.cc, adding an hours field when needed. */
export function formatStudioTime(seconds: number) {
  const safeSeconds = Number.isFinite(seconds) && seconds > 0 ? seconds : 0
  let wholeSeconds = Math.floor(safeSeconds)
  let centiseconds = Math.round((safeSeconds - wholeSeconds) * 100)

  if (centiseconds === 100) {
    wholeSeconds += 1
    centiseconds = 0
  }

  const hours = Math.floor(wholeSeconds / 3600)
  const minutes = Math.floor((wholeSeconds % 3600) / 60)
  const remainingSeconds = wholeSeconds % 60
  const fraction = centiseconds.toString().padStart(2, "0")
  const minuteText = minutes.toString().padStart(2, "0")
  const secondText = remainingSeconds.toString().padStart(2, "0")

  return hours > 0
    ? `${hours.toString().padStart(2, "0")}:${minuteText}:${secondText}.${fraction}`
    : `${minuteText}:${secondText}.${fraction}`
}

export function TimeRangeControl({
  duration,
  value,
  onChange,
  labels,
  minimumGap = DEFAULT_MINIMUM_GAP,
  disabled = false,
  className,
}: TimeRangeControlProps) {
  const id = React.useId()
  const safeDuration = Number.isFinite(duration) && duration > 0 ? duration : 0
  const requestedGap =
    Number.isFinite(minimumGap) && minimumGap > 0
      ? minimumGap
      : DEFAULT_MINIMUM_GAP
  const effectiveGap = Math.min(requestedGap, safeDuration)
  const [start, end] = normalizeRange(value, safeDuration, effectiveGap)
  const controlsDisabled = disabled || safeDuration === 0
  const sliderMaximum = Math.max(safeDuration, TIME_STEP)
  const startMaximum = Math.max(0, end - effectiveGap)
  const endMinimum = Math.min(safeDuration, start + effectiveGap)

  const updateEndpoint = React.useCallback(
    (candidate: number, endpoint: TimeRangeEndpoint) => {
      if (controlsDisabled || !Number.isFinite(candidate)) return

      const nextValue = normalizeTime(
        candidate,
        endpoint === "start" ? start : end,
        safeDuration
      )
      const nextRange: [number, number] =
        endpoint === "start"
          ? [Math.min(nextValue, startMaximum), end]
          : [start, Math.max(nextValue, endMinimum)]

      if (nextRange[0] === start && nextRange[1] === end) return
      onChange(nextRange, endpoint)
    },
    [
      controlsDisabled,
      end,
      endMinimum,
      onChange,
      safeDuration,
      start,
      startMaximum,
    ]
  )

  const handleSliderChange = React.useCallback(
    (nextValue: number[]) => {
      if (nextValue.length < 2) return

      const startDelta = Math.abs(nextValue[0] - start)
      const endDelta = Math.abs(nextValue[1] - end)
      if (startDelta === 0 && endDelta === 0) return

      const movedEndpoint: TimeRangeEndpoint =
        startDelta >= endDelta ? "start" : "end"
      updateEndpoint(
        movedEndpoint === "start" ? nextValue[0] : nextValue[1],
        movedEndpoint
      )
    },
    [end, start, updateEndpoint]
  )

  return (
    <fieldset
      disabled={controlsDisabled}
      className={["min-w-0 space-y-4 border-0 p-0", className]
        .filter(Boolean)
        .join(" ")}
    >
      <legend className="sr-only">{labels.range}</legend>

      <div role="group" aria-label={labels.range} className="min-w-0 px-2">
        <SliderPrimitive.Root
          min={0}
          max={sliderMaximum}
          step={TIME_STEP}
          minStepsBetweenThumbs={effectiveGap / TIME_STEP}
          value={[start, end]}
          onValueChange={handleSliderChange}
          disabled={controlsDisabled}
          className="relative flex h-10 w-full touch-none select-none items-center"
        >
          <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
            <SliderPrimitive.Range className="absolute h-full bg-primary" />
          </SliderPrimitive.Track>
          <SliderPrimitive.Thumb
            aria-label={labels.start}
            aria-valuemin={0}
            aria-valuemax={startMaximum}
            aria-valuetext={formatStudioTime(start)}
            className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          />
          <SliderPrimitive.Thumb
            aria-label={labels.end}
            aria-valuemin={endMinimum}
            aria-valuemax={safeDuration}
            aria-valuetext={formatStudioTime(end)}
            className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          />
        </SliderPrimitive.Root>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="min-w-0 space-y-1.5">
          <label
            htmlFor={`${id}-start`}
            className="text-sm font-medium leading-none"
          >
            {labels.start}
          </label>
          <input
            id={`${id}-start`}
            type="number"
            inputMode="decimal"
            min={0}
            max={startMaximum}
            step={TIME_STEP}
            value={start}
            onChange={(event) =>
              updateEndpoint(event.currentTarget.valueAsNumber, "start")
            }
            aria-label={labels.start}
            disabled={controlsDisabled}
            className="flex h-10 w-full min-w-0 rounded-md border border-input bg-background px-3 py-2 font-mono text-sm tabular-nums ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div className="min-w-0 space-y-1.5">
          <label
            htmlFor={`${id}-end`}
            className="text-sm font-medium leading-none"
          >
            {labels.end}
          </label>
          <input
            id={`${id}-end`}
            type="number"
            inputMode="decimal"
            min={endMinimum}
            max={safeDuration}
            step={TIME_STEP}
            value={end}
            onChange={(event) =>
              updateEndpoint(event.currentTarget.valueAsNumber, "end")
            }
            aria-label={labels.end}
            disabled={controlsDisabled}
            className="flex h-10 w-full min-w-0 rounded-md border border-input bg-background px-3 py-2 font-mono text-sm tabular-nums ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>

      <dl
        aria-label={labels.range}
        className="grid min-w-0 grid-cols-3 overflow-hidden rounded-md border bg-muted/30"
      >
        <div className="min-w-0 px-2 py-2 text-center sm:px-3">
          <dt className="truncate text-xs text-muted-foreground">
            {labels.start}
          </dt>
          <dd className="mt-1 font-mono text-xs font-medium tabular-nums sm:text-sm">
            {formatStudioTime(start)}
          </dd>
        </div>
        <div className="min-w-0 border-l px-2 py-2 text-center sm:px-3">
          <dt className="truncate text-xs text-muted-foreground">
            {labels.selection}
          </dt>
          <dd className="mt-1 font-mono text-xs font-medium tabular-nums sm:text-sm">
            {formatStudioTime(end - start)}
          </dd>
        </div>
        <div className="min-w-0 border-l px-2 py-2 text-center sm:px-3">
          <dt className="truncate text-xs text-muted-foreground">
            {labels.end}
          </dt>
          <dd className="mt-1 font-mono text-xs font-medium tabular-nums sm:text-sm">
            {formatStudioTime(end)}
          </dd>
        </div>
      </dl>
    </fieldset>
  )
}
