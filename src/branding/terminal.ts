export const TERMINAL_BRAND_TEXT = "Library Bot Telegram By @xbibzofficial";

/** "Tele Bibz" rendered with the figlet Speed font. */
export const TELE_BIBZ_ASCII = [
  "________    ______          ___________________       _______",
  "___  __/_______  /____      ___  __ )__(_)__  /_______",
  "__  /  _  _ \\_  /_  _ \\     __  __  |_  /__  __ \\__  /",
  "_  /   /  __/  / /  __/     _  /_/ /_  / _  /_/ /_  /_",
  "/_/    \\___//_/  \\___/      /_____/ /_/  /_.___/_____/",
];

export interface TerminalBrandingOptions {
  color?: boolean;
}

export interface TerminalAnimationOptions extends TerminalBrandingOptions {
  intervalMs?: number;
  stream?: NodeJS.WriteStream;
}

export interface TerminalAnimation {
  stop(message?: string): void;
}

const ANSI = {
  reset: "\u001b[0m",
  bold: "\u001b[1m",
  clearLine: "\u001b[2K",
  cursorUp: "\u001b[1A",
  hideCursor: "\u001b[?25l",
  showCursor: "\u001b[?25h",
  blue: "\u001b[34m",
  magenta: "\u001b[35m",
  cyan: "\u001b[36m",
  green: "\u001b[32m",
  yellow: "\u001b[33m",
  red: "\u001b[31m",
  white: "\u001b[97m",
  dim: "\u001b[2m",
} as const;

function pad(value: string, width: number): string {
  return `${value}${" ".repeat(Math.max(0, width - [...value].length))}`;
}

function useColor(options: TerminalBrandingOptions, stream: NodeJS.WriteStream): boolean {
  return options.color ?? Boolean(stream.isTTY && !process.env.NO_COLOR);
}

function sleep(delayMs: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, delayMs));
}

function easeInOutCubic(progress: number): number {
  return progress < 0.5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2;
}

function hslToRgb(hue: number, saturation: number, lightness: number): [number, number, number] {
  const normalizedHue = ((hue % 360) + 360) % 360;
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const hueSegment = normalizedHue / 60;
  const secondary = chroma * (1 - Math.abs((hueSegment % 2) - 1));
  let red = 0;
  let green = 0;
  let blue = 0;
  if (hueSegment < 1) { red = chroma; green = secondary; }
  else if (hueSegment < 2) { red = secondary; green = chroma; }
  else if (hueSegment < 3) { green = chroma; blue = secondary; }
  else if (hueSegment < 4) { green = secondary; blue = chroma; }
  else if (hueSegment < 5) { red = secondary; blue = chroma; }
  else { red = chroma; blue = secondary; }
  const shift = lightness - chroma / 2;
  return [Math.round((red + shift) * 255), Math.round((green + shift) * 255), Math.round((blue + shift) * 255)];
}

function rgbForegroundColor(red: number, green: number, blue: number): string {
  return `\u001b[38;2;${red};${green};${blue}m`;
}

export interface RainbowPaintOptions {
  color?: boolean;
  /** Hue phase shift in degrees; animate by increasing this over time. */
  offset?: number;
  /** Total hue spread across the widest line. */
  spread?: number;
  saturation?: number;
  lightness?: number;
}

/**
 * Paints multi-line text with a rainbow gradient across columns (the classic
 * "Rainbow" color filter). Spaces stay unstyled so the art keeps its shape.
 */
export function paintRainbow(text: string, options: RainbowPaintOptions = {}): string {
  if (!options.color) return text;
  const lines = text.split("\n");
  const width = Math.max(...lines.map((line) => [...line].length), 1);
  const offset = options.offset ?? 0;
  const spread = options.spread ?? 340;
  const saturation = options.saturation ?? 1;
  const lightness = options.lightness ?? 0.58;
  return lines
    .map((line) => {
      const characters = [...line];
      let painted = "";
      for (let index = 0; index < characters.length; index += 1) {
        const character = characters[index]!;
        if (character === " ") { painted += character; continue; }
        const hue = offset + (index / width) * spread;
        const [red, green, blue] = hslToRgb(hue, saturation, lightness);
        painted += `${rgbForegroundColor(red, green, blue)}${character}${ANSI.reset}`;
      }
      return painted;
    })
    .join("\n");
}

export interface StartupSequenceOptions {
  stream?: NodeJS.WriteStream;
  color?: boolean;
  label?: string;
  typeDelayMs?: number;
  dotDelayMs?: number;
  dots?: number;
  barWidth?: number;
  barDurationMs?: number;
  barFrameMs?: number;
}

function renderGlassBar(progress: number, shinePosition: number, width: number, colored: boolean): string {
  const filled = Math.round(progress * width);
  let bar = "";
  for (let index = 0; index < width; index += 1) {
    const isFilled = index < filled;
    const shineDistance = Math.abs(index - shinePosition);
    const isShine = shineDistance <= 1;
    const character = isFilled ? "█" : "░";
    if (!colored) { bar += character; continue; }
    if (isShine) {
      bar += `${ANSI.bold}${ANSI.white}${character === "█" ? "█" : "▒"}${ANSI.reset}`;
      continue;
    }
    if (isFilled) {
      const hue = 190 + (index / width) * 150;
      const [red, green, blue] = hslToRgb(hue, 0.85, 0.6);
      bar += `${rgbForegroundColor(red, green, blue)}${character}${ANSI.reset}`;
    } else {
      bar += `${ANSI.dim}${character}${ANSI.reset}`;
    }
  }
  return bar;
}

/**
 * Plays the startup sequence on a TTY: a typing effect for the label
 * (default "Installing Dependencies"), a trailing run of dots, and a
 * glass progress bar with a sweeping highlight that fills to 100%.
 * No-ops when the stream is not an interactive TTY.
 */
export async function runStartupSequence(options: StartupSequenceOptions = {}): Promise<void> {
  const stream = options.stream ?? process.stdout;
  if (!stream.isTTY) return;
  const colored = useColor(options, stream);
  const label = options.label ?? "Installing Dependencies";
  const typeDelayMs = options.typeDelayMs ?? 24;
  const dotDelayMs = options.dotDelayMs ?? 140;
  const dots = options.dots ?? 6;
  const barWidth = Math.max(10, options.barWidth ?? 44);
  const barDurationMs = Math.max(0, options.barDurationMs ?? 1_400);
  const barFrameMs = Math.max(16, options.barFrameMs ?? 40);

  if (colored) stream.write(`${ANSI.bold}${ANSI.cyan}`);
  for (const character of label) {
    stream.write(character);
    if (typeDelayMs > 0) await sleep(typeDelayMs);
  }
  for (let index = 0; index < dots; index += 1) {
    if (dotDelayMs > 0) await sleep(dotDelayMs);
    stream.write(".");
  }
  if (colored) stream.write(ANSI.reset);
  stream.write("\n");

  const startedAt = Date.now();
  let frameIndex = 0;
  while (true) {
    const elapsed = Date.now() - startedAt;
    const progress = barDurationMs === 0 ? 1 : Math.min(1, easeInOutCubic(elapsed / barDurationMs));
    const sweep = (frameIndex * barFrameMs) % 1_600;
    const triangle = sweep < 800 ? sweep / 800 : 2 - sweep / 800;
    const shinePosition = triangle * (barWidth - 1);
    const percentage = Math.round(progress * 100);
    stream.write(`\r${ANSI.clearLine}${renderGlassBar(progress, shinePosition, barWidth, colored)} ${ANSI.dim}${String(percentage).padStart(3, " ")}%${ANSI.reset}`);
    if (progress >= 1) break;
    frameIndex += 1;
    await sleep(barFrameMs);
  }
  stream.write(` ${ANSI.green}${ANSI.bold}✓${ANSI.reset}\n`);
}

export type BannerStopTone = "success" | "error" | "info";

export interface BannerHandle {
  /** Freezes the animation, prints the final frame plus an optional status message. */
  stop(message?: string, tone?: BannerStopTone): void;
}

export interface TeleBibzBannerOptions extends TerminalBrandingOptions {
  stream?: NodeJS.WriteStream | undefined;
  frameMs?: number | undefined;
  subtitle?: string | undefined;
}

function bannerFrame(subtitle: string | undefined, offset: number, colored: boolean): string[] {
  const artWidth = Math.max(...TELE_BIBZ_ASCII.map((line) => [...line].length));
  const leading = Math.max(0, Math.floor((artWidth - [...TERMINAL_BRAND_TEXT].length) / 2));
  const tagline = " ".repeat(leading) + TERMINAL_BRAND_TEXT;
  const lines = paintRainbow(TELE_BIBZ_ASCII.join("\n"), { color: colored, offset }).split("\n");
  lines.push(colored ? `${ANSI.dim}${tagline}${ANSI.reset}` : tagline);
  if (subtitle) lines.push(colored ? `${ANSI.cyan}${ANSI.bold}${subtitle}${ANSI.reset}` : subtitle);
  return lines;
}

function tonePrefix(tone: BannerStopTone, colored: boolean): string {
  if (!colored) return "";
  if (tone === "success") return ANSI.green;
  if (tone === "error") return ANSI.red;
  return ANSI.cyan;
}

/**
 * Prints the static "Tele Bibz" banner (rainbow-painted once, no animation).
 * Suitable for short-lived CLI commands and non-interactive streams.
 */
export function printTeleBibzBanner(options: TeleBibzBannerOptions & { message?: string | undefined; tone?: BannerStopTone | undefined } = {}): void {
  const stream = options.stream ?? process.stdout;
  const colored = useColor(options, stream);
  const lines = bannerFrame(options.subtitle, 0, colored);
  if (options.message) {
    const prefix = options.tone === "error" ? "✗ " : options.tone === "success" ? "✓ " : "";
    lines.push(colored ? `${tonePrefix(options.tone ?? "info", colored)}${prefix}${options.message}${ANSI.reset}` : `${prefix}${options.message}`);
  }
  stream.write(`${lines.join("\n")}\n`);
}

/**
 * Prints the animated rainbow "Tele Bibz" banner. The rainbow flows until
 * `stop()` is called (typically once the bot is connected), then the banner
 * freezes and an optional status line is printed.
 */
export function startTeleBibzBanner(options: TeleBibzBannerOptions = {}): BannerHandle {
  const stream = options.stream ?? process.stdout;
  const colored = useColor(options, stream);
  const frameMs = Math.max(16, options.frameMs ?? 70);
  const subtitle = options.subtitle;
  if (!stream.isTTY) {
    printTeleBibzBanner({ ...options, subtitle });
    return { stop: () => undefined };
  }

  let stopped = false;
  let linesPrinted = 0;
  const writeFrame = (offset: number): void => {
    const lines = bannerFrame(subtitle, offset, colored);
    linesPrinted = lines.length;
    stream.write(lines.join("\n") + "\n");
  };
  const clearFrame = (): void => {
    for (let index = 0; index < linesPrinted; index += 1) stream.write(`${ANSI.cursorUp}${ANSI.clearLine}`);
    stream.write("\r");
  };

  stream.write(ANSI.hideCursor);
  writeFrame(0);

  void (async () => {
    let offset = 0;
    while (!stopped) {
      await sleep(frameMs);
      if (stopped) break;
      offset = (offset + 14) % 360;
      clearFrame();
      writeFrame(offset);
    }
  })();

  return {
    stop(message?: string, tone: BannerStopTone = "success"): void {
      if (stopped) return;
      stopped = true;
      clearFrame();
      writeFrame(0);
      if (message) {
        const prefix = tone === "error" ? "✗ " : tone === "success" ? "✓ " : "";
        const line = colored ? `${tonePrefix(tone, colored)}${ANSI.bold}${prefix}${message}${ANSI.reset}` : `${prefix}${message}`;
        stream.write(`${line}\n`);
      }
      stream.write(ANSI.showCursor);
    },
  };
}

/** Prints a single dim status line (used for "Listening for updates..." style messages). */
export function printStatusLine(text: string, options: TerminalBrandingOptions & { stream?: NodeJS.WriteStream } = {}): void {
  const stream = options.stream ?? process.stdout;
  const colored = useColor(options, stream);
  stream.write(colored ? `${ANSI.dim}${text}${ANSI.reset}\n` : `${text}\n`);
}

export function buildTerminalBranding(options: TerminalBrandingOptions = {}): string {
  const stream = process.stdout;
  const colored = useColor(options, stream);
  const color = (value: string, code: string): string => colored ? `${code}${value}${ANSI.reset}` : value;
  const title = "TELEBIBZ CLI";
  const width = Math.max([...title].length, [...TERMINAL_BRAND_TEXT].length);
  const horizontal = "═".repeat(width + 2);
  const line = (value: string): string => `║ ${pad(value, width)} ║`;
  return [
    color(`╔${horizontal}╗`, ANSI.cyan),
    color(line(title), ANSI.blue),
    color(line(TERMINAL_BRAND_TEXT), ANSI.magenta),
    color(`╚${horizontal}╝`, ANSI.cyan),
    color("Runtime logs: colorful structured output.", ANSI.dim),
  ].join("\n");
}

export function printTerminalBranding(options: TerminalBrandingOptions = {}): void {
  process.stdout.write(`${buildTerminalBranding(options)}\n`);
}

export function startTerminalAnimation(message = "Starting telebibz", options: TerminalAnimationOptions = {}): TerminalAnimation {
  const stream = options.stream ?? process.stdout;
  const colored = useColor(options, stream);
  const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
  const intervalMs = Math.max(60, options.intervalMs ?? 90);
  let index = 0;
  let stopped = false;
  const paint = (): void => {
    if (stopped || !stream.isTTY) return;
    const frame = frames[index++ % frames.length] ?? "⠋";
    const text = `${frame} ${message}`;
    stream.write(`\r${ANSI.clearLine}${colored ? ANSI.cyan : ""}${text}${colored ? ANSI.reset : ""}`);
  };
  if (!stream.isTTY) return { stop: () => undefined };
  stream.write(ANSI.hideCursor);
  paint();
  const timer = setInterval(paint, intervalMs);
  timer.unref?.();
  return {
    stop(finalMessage = "Done"): void {
      if (stopped) return;
      stopped = true;
      clearInterval(timer);
      const prefix = finalMessage.toLowerCase().includes("error") ? ANSI.yellow : ANSI.green;
      stream.write(`\r${ANSI.clearLine}${colored ? prefix : ""}${finalMessage}${colored ? ANSI.reset : ""}\n${ANSI.showCursor}`);
    },
  };
}
