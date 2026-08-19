export const TERMINAL_BRAND_TEXT = "Library Bot Telegram By @xbibzofficial";

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
  clearLine: "\u001b[2K",
  hideCursor: "\u001b[?25l",
  showCursor: "\u001b[?25h",
  blue: "\u001b[34m",
  magenta: "\u001b[35m",
  cyan: "\u001b[36m",
  green: "\u001b[32m",
  yellow: "\u001b[33m",
  dim: "\u001b[2m",
} as const;

function pad(value: string, width: number): string {
  return `${value}${" ".repeat(Math.max(0, width - [...value].length))}`;
}

function useColor(options: TerminalBrandingOptions, stream: NodeJS.WriteStream): boolean {
  return options.color ?? Boolean(stream.isTTY && !process.env.NO_COLOR);
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
    color("Approval gate: developer approval is required before the bot runs.", ANSI.dim),
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
