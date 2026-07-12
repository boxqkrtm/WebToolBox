export const GIFSICLE_SCRIPT_URL =
  "https://cdn.jsdelivr.net/npm/gifsicle-wasm-browser@1.5.16/dist/gifsicle.min.js";

export const MIN_GIFSICLE_LOSSY = 0;
export const MAX_GIFSICLE_LOSSY = 200;

type GifsicleModule = {
  run(options: {
    input: Array<{ file: File | string; name: string }>;
    command: string[];
  }): Promise<File[]>;
};

let gifsiclePromise: Promise<GifsicleModule> | null = null;

/** Import the browser build at runtime so the GPL binary stays out of the bundle. */
const importFromUrl = new Function(
  "url",
  "return import(/* webpackIgnore: true */ url)"
) as (url: string) => Promise<{ default: GifsicleModule }>;

export function clampGifsicleLossy(value: number): number {
  if (!Number.isFinite(value)) return MIN_GIFSICLE_LOSSY;
  return Math.min(MAX_GIFSICLE_LOSSY, Math.max(MIN_GIFSICLE_LOSSY, Math.round(value)));
}

export function buildGifsicleCommand(lossy: number, input: string, output: string): string {
  return `-O3 --lossy=${clampGifsicleLossy(lossy)} ${input} -o ${output}`;
}

export async function loadGifsicle(): Promise<GifsicleModule> {
  if (!gifsiclePromise) {
    gifsiclePromise = importFromUrl(GIFSICLE_SCRIPT_URL)
      .then((module) => {
        const gifsicle = module?.default;
        if (!gifsicle || typeof gifsicle.run !== "function") {
          throw new Error("gifsicle module did not expose a run() function");
        }
        return gifsicle;
      })
      .catch((error) => {
        gifsiclePromise = null;
        throw error;
      });
  }
  return gifsiclePromise;
}

/**
 * Re-compress a GIF through gifsicle. Returns the optimized file, which may be
 * larger than the input for pathological cases; callers should keep the smaller one.
 */
export async function optimizeGifWithGifsicle(gif: Blob, lossy: number): Promise<Blob> {
  const gifsicle = await loadGifsicle();
  const input = new File([gif], "input.gif", { type: "image/gif" });
  const outputs = await gifsicle.run({
    input: [{ file: input, name: "input.gif" }],
    command: [buildGifsicleCommand(lossy, "input.gif", "/out/output.gif")],
  });

  const output = outputs?.find((file) => file && file.size > 0);
  if (!output) {
    throw new Error("gifsicle returned no output");
  }
  return output;
}
