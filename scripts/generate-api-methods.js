'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { TELEGRAM_API_METHODS } = require('../lib/telegram-methods');

const groups = [
  {
    key: 'messages',
    test: (m) => /^(send|forward|copy|editMessage|deleteMessage|setMessageReaction|sendChatAction)/.test(m),
    id: 'Pesan, media, dan reaksi', en: 'Messages, media, and reactions', zh: '消息、媒体与互动',
  },
  {
    key: 'chats',
    test: (m) => /(Chat|Member|InviteLink|JoinRequest|ChatPermissions|ChatBoost|SuggestedPost)/.test(m),
    id: 'Chat, anggota, dan administrasi', en: 'Chats, members, and administration', zh: '聊天、成员与管理',
  },
  {
    key: 'forum',
    test: (m) => /(ForumTopic|Sticker|CustomEmoji)/.test(m),
    id: 'Forum, topik, dan sticker', en: 'Forums, topics, and stickers', zh: '论坛、话题与贴纸',
  },
  {
    key: 'inline',
    test: (m) => /(Inline|WebApp|Guest|Prepared)/.test(m),
    id: 'Inline query, Web App, dan guest', en: 'Inline queries, Web Apps, and guest updates', zh: 'Inline 查询、Web App 与访客更新',
  },
  {
    key: 'business',
    test: (m) => /(Business|Ephemeral|UserPersonalChat)/.test(m),
    id: 'Business dan pesan ephemeral', en: 'Business and ephemeral messages', zh: 'Business 与临时消息',
  },
  {
    key: 'payments',
    test: (m) => /(Invoice|Payment|Star|Gift|Subscription|Refund|PaidMedia|Shipping|PreCheckout)/.test(m),
    id: 'Pembayaran, Stars, dan gifts', en: 'Payments, Stars, and gifts', zh: '支付、Stars 与礼物',
  },
  {
    key: 'games',
    test: (m) => /(Game|HighScores)/.test(m),
    id: 'Games', en: 'Games', zh: '游戏',
  },
  {
    key: 'other',
    test: () => true,
    id: 'Bot, file, update, dan informasi akun', en: 'Bot, files, updates, and account information', zh: '机器人、文件、更新与账户信息',
  },
];

const locales = [
  {
    locale: 'id',
    target: path.join(__dirname, '..', 'docs', 'reference', 'methods.md'),
    title: 'Daftar metode Bot API',
    description: 'Daftar metode Bot API yang dikenali TeleBibz.',
    h1: 'Daftar metode Bot API',
    lead: `Registry TeleBibz mencakup **${TELEGRAM_API_METHODS.length} nama metode**. Daftar ini dibuat otomatis dari source saat build.`,
    warning: '> Nama metode tidak menjamin endpoint dapat digunakan tanpa syarat. Izin, chat, update, dan batasan Telegram tetap berlaku.',
    callTitle: 'Pemanggilan',
    callNote: 'Daftar berikut dibuat dari registry dan deklarasi package. Setiap entri menghubungkan tuple argumen, payload, dan hasil yang dapat diperiksa IDE; gunakan link Telegram untuk deskripsi field dan batasan endpoint.',
    relatedTitle: 'Referensi terkait',
    related: ['- [Referensi Telegram API](/reference/api)', '- [Tipe TypeScript](/reference/typescript)', '- [Opsi bot](/reference/options)'],
  },
  {
    locale: 'en',
    target: path.join(__dirname, '..', 'docs', 'en', 'reference', 'methods.md'),
    title: 'Bot API methods',
    description: 'Bot API methods included in the TeleBibz registry.',
    h1: 'Bot API methods',
    lead: `The TeleBibz registry includes **${TELEGRAM_API_METHODS.length} method names**. This page is generated from the source registry during the docs build.`,
    warning: '> A method name does not guarantee that every request is available. Telegram permissions, chat context, updates, and endpoint limits still apply.',
    callTitle: 'Calling methods',
    callNote: 'This index is generated from the method registry and package declarations. Each entry links the type-safe argument tuple, payload, and result; use the Telegram link for field descriptions and endpoint constraints.',
    relatedTitle: 'Related references',
    related: ['- [Bot API reference](/en/reference/api)', '- [TypeScript](/en/reference/typescript)', '- [Bot options](/en/reference/options)'],
  },
  {
    locale: 'zh',
    target: path.join(__dirname, '..', 'docs', 'zh', 'reference', 'methods.md'),
    title: 'Bot API 方法列表',
    description: 'TeleBibz 注册表中的 Bot API 方法。',
    h1: 'Bot API 方法列表',
    lead: `TeleBibz 注册表包含 **${TELEGRAM_API_METHODS.length} 个方法名称**。本页在文档构建时根据源码自动生成。`,
    warning: '> 方法名称不代表请求一定可用。实际调用仍受 Telegram 权限、聊天上下文、更新类型和接口限制约束。',
    callTitle: '调用方法',
    callNote: '以下索引根据方法注册表和 package 声明生成。每个条目都链接到可由 IDE 检查的参数元组、payload 和返回类型；字段说明与接口限制请查看 Telegram 链接。',
    relatedTitle: '相关参考',
    related: ['- [Bot API 参考](/zh/reference/api)', '- [TypeScript](/zh/reference/typescript)', '- [Bot 配置项](/zh/reference/options)'],
  },
];

function methodSections(locale) {
  const assigned = new Set();
  return groups.map((group) => {
    const methods = TELEGRAM_API_METHODS.filter((method) => !assigned.has(method) && group.test(method));
    methods.forEach((method) => assigned.add(method));
    return { title: group[locale], methods };
  }).filter((group) => group.methods.length);
}

for (const locale of locales) {
  const lines = [
    '---',
    `title: ${locale.title}`,
    `description: ${locale.description}`,
    '---',
    '',
    `# ${locale.h1}`,
    '',
    locale.lead,
    '',
    locale.warning,
    '',
    `## ${locale.callTitle}`,
    '',
    '```js',
    "await bot.api.callApi('sendMessage', { chat_id: chatId, text: 'Hello' });",
    'await bot.api.getMe();',
    '```',
    '',
    locale.callNote,
    '',
  ];
  for (const { title, methods } of methodSections(locale.locale)) {
    lines.push(`## ${title}`, '', methods.map((method) => `- [${method}](https://core.telegram.org/bots/api#${method.toLowerCase()})`).join('\n'), '');
    lines.push(`### ${locale.locale === 'id' ? 'Payload dan hasil bertipe' : locale.locale === 'en' ? 'Typed payloads and results' : '类型化 payload 与结果'}`, '');
    for (const method of methods) {
      lines.push(
        `::: details ${method}`,
        '',
        `- ${locale.locale === 'id' ? 'Argumen' : locale.locale === 'en' ? 'Arguments' : '参数'}: \`TelegramMethodArguments<'${method}'>\``,
        `- Payload: \`TelegramMethodPayload<'${method}'>\``,
        `- ${locale.locale === 'id' ? 'Hasil' : locale.locale === 'en' ? 'Result' : '返回值'}: \`Promise<TelegramMethodResult<'${method}'>>\``,
        `- ${locale.locale === 'id' ? 'Field dan batasan endpoint' : locale.locale === 'en' ? 'Field definitions and endpoint constraints' : '字段定义与接口限制'}: [${method}](https://core.telegram.org/bots/api#${method.toLowerCase()}).`,
        '',
        ':::',
        '',
      );
    }
  }
  lines.push(`## ${locale.relatedTitle}`, '', ...locale.related, '');
  fs.mkdirSync(path.dirname(locale.target), { recursive: true });
  fs.writeFileSync(locale.target, lines.join('\n'));
  console.log(`Generated ${locale.target} (${TELEGRAM_API_METHODS.length} methods, ${locale.locale}).`);
}
