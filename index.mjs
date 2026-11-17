// index.mjs — pintu masuk ESM untuk @xbibzlibrary/telebibz.
// Implementasi tetap CommonJS (index.js); berkas ini hanya mengekspor ulang
// supaya `import { TeleBibz } from '@xbibzlibrary/telebibz'` bekerja tanpa
// bergantung pada deteksi named-export otomatis Node.
import cjs from './index.js';

export default cjs;

export const {
  TeleBibz,
  Context,
  Composer,
  BotError,
  session,
  wizard,
  btn,
  url,
  webApp,
  copy,
  kb,
  InlineKeyboard,
  Keyboard,
  Menu,
  MenuContainer,
  File,
  InputFile,
  InputMediaBuilder,
  InputPaidMediaBuilder,
  rich,
  RichMessageBuilder,
  inputRichMessage,
  TELEGRAM_API_METHODS,
  makeApi,
  createTransport,
  createDownloader,
  ApiError,
  autoRetry,
  throttler,
  limiter,
  broadcast,
  matchInlineQuery,
  iq,
  humanize,
  log,
  say,
} = cjs;
