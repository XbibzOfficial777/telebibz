'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { TELEGRAM_API_METHODS } = require('../lib/telegram-methods');

const declarationsPath = path.join(__dirname, '..', 'types', 'telegram-bot-api', 'methods.d.ts');

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
    description: 'Metode Bot API TeleBibz beserta payload, parameter, tipe, dan deskripsinya.',
    h1: 'Daftar metode Bot API',
    lead: `Registry TeleBibz mencakup **${TELEGRAM_API_METHODS.length} nama metode**. Daftar dibuat dari registry dan deklarasi Bot API di repository.`,
    warning: '> Nama metode tidak menjamin endpoint dapat digunakan tanpa syarat. Izin, chat, update, dan batasan Telegram tetap berlaku.',
    callTitle: 'Pemanggilan',
    callNote: 'Buka setiap metode untuk melihat status payload, field, tipe, required/optional, deskripsi, serta tipe hasil. Deklarasi parameter dihasilkan dari `types/telegram-bot-api/methods.d.ts`; deskripsi method/field mengikuti komentar Bot API berbahasa Inggris agar makna teknisnya tetap tepat. Tautan Telegram menjadi rujukan untuk aturan endpoint terbaru.',
    relatedTitle: 'Referensi terkait',
    related: ['- [Referensi Telegram API](/reference/api)', '- [Tipe TypeScript](/reference/typescript)', '- [Opsi bot](/reference/options)'],
    labels: {
      arguments: 'Argumen', result: 'Hasil', endpoint: 'Dokumentasi Telegram',
      payloadRequired: 'wajib', payloadOptional: 'opsional', noPayload: 'tidak ada',
      noFields: 'Metode ini tidak memiliki parameter payload.',
      fieldsTitle: 'Parameter payload', field: 'Field', requirement: 'Status', type: 'Tipe', description: 'Deskripsi',
      required: 'Wajib', optional: 'Opsional',
    },
  },
  {
    locale: 'en',
    target: path.join(__dirname, '..', 'docs', 'en', 'reference', 'methods.md'),
    title: 'Bot API methods',
    description: 'TeleBibz Bot API methods with payload fields, types, required status, and descriptions.',
    h1: 'Bot API methods',
    lead: `The TeleBibz registry includes **${TELEGRAM_API_METHODS.length} method names**. This index is generated from the repository registry and Bot API declarations.`,
    warning: '> A method name does not guarantee that every request is available. Telegram permissions, chat context, updates, and endpoint limits still apply.',
    callTitle: 'Calling methods',
    callNote: 'Expand a method to inspect payload status, fields, types, required/optional status, descriptions, and result type. Parameter tables are generated from `types/telegram-bot-api/methods.d.ts`; method and field descriptions are retained from the English Bot API comments to preserve their technical meaning. Use the Telegram link for the latest endpoint rules.',
    relatedTitle: 'Related references',
    related: ['- [Bot API reference](/en/reference/api)', '- [TypeScript](/en/reference/typescript)', '- [Bot options](/en/reference/options)'],
    labels: {
      arguments: 'Arguments', result: 'Result', endpoint: 'Telegram documentation',
      payloadRequired: 'required', payloadOptional: 'optional', noPayload: 'none',
      noFields: 'This method has no payload parameters.',
      fieldsTitle: 'Payload parameters', field: 'Field', requirement: 'Status', type: 'Type', description: 'Description',
      required: 'Required', optional: 'Optional',
    },
  },
  {
    locale: 'zh',
    target: path.join(__dirname, '..', 'docs', 'zh', 'reference', 'methods.md'),
    title: 'Bot API 方法列表',
    description: 'TeleBibz Bot API 方法及其 payload 字段、类型、必填状态和说明。',
    h1: 'Bot API 方法列表',
    lead: `TeleBibz 注册表包含 **${TELEGRAM_API_METHODS.length} 个方法名称**。本索引由仓库注册表和 Bot API 声明生成。`,
    warning: '> 方法名称不代表请求一定可用。实际调用仍受 Telegram 权限、聊天上下文、更新类型和接口限制约束。',
    callTitle: '调用方法',
    callNote: '展开方法可查看 payload 状态、字段、类型、必填/可选状态、说明和返回类型。参数表由 `types/telegram-bot-api/methods.d.ts` 生成；method 与 field 说明保留 Bot API 英文注释，以避免改变技术含义。最新接口规则请以 Telegram 链接为准。',
    relatedTitle: '相关参考',
    related: ['- [Bot API 参考](/zh/reference/api)', '- [TypeScript](/zh/reference/typescript)', '- [Bot 配置项](/zh/reference/options)'],
    labels: {
      arguments: '参数', result: '返回值', endpoint: 'Telegram 文档',
      payloadRequired: '必需', payloadOptional: '可选', noPayload: '无',
      noFields: '此方法没有 payload 参数。',
      fieldsTitle: 'Payload 参数', field: '字段', requirement: '状态', type: '类型', description: '说明',
      required: '必填', optional: '可选',
    },
  },
];

function findMatchingDelimiter(text, start, opener, closer) {
  let depth = 0;
  let state = 'normal';
  let quote = '';

  for (let i = start; i < text.length; i += 1) {
    const current = text[i];
    const next = text[i + 1];

    if (state === 'line-comment') {
      if (current === '\n') state = 'normal';
      continue;
    }
    if (state === 'block-comment') {
      if (current === '*' && next === '/') { state = 'normal'; i += 1; }
      continue;
    }
    if (state === 'string') {
      if (current === '\\') { i += 1; continue; }
      if (current === quote) state = 'normal';
      continue;
    }
    if (current === '/' && next === '/') { state = 'line-comment'; i += 1; continue; }
    if (current === '/' && next === '*') { state = 'block-comment'; i += 1; continue; }
    if (current === '"' || current === "'" || current === '`') {
      state = 'string';
      quote = current;
      continue;
    }
    if (current === opener) depth += 1;
    else if (current === closer) {
      depth -= 1;
      if (depth === 0) return i;
    }
  }

  throw new Error(`Unclosed ${opener} delimiter while reading Bot API declarations.`);
}

function splitTopLevel(text, delimiter = ',') {
  const parts = [];
  const stack = [];
  const closing = { ')': '(', ']': '[', '}': '{', '>': '<' };
  let start = 0;
  let state = 'normal';
  let quote = '';

  for (let i = 0; i < text.length; i += 1) {
    const current = text[i];
    const next = text[i + 1];
    if (state === 'line-comment') { if (current === '\n') state = 'normal'; continue; }
    if (state === 'block-comment') {
      if (current === '*' && next === '/') { state = 'normal'; i += 1; }
      continue;
    }
    if (state === 'string') {
      if (current === '\\') { i += 1; continue; }
      if (current === quote) state = 'normal';
      continue;
    }
    if (current === '/' && next === '/') { state = 'line-comment'; i += 1; continue; }
    if (current === '/' && next === '*') { state = 'block-comment'; i += 1; continue; }
    if (current === '"' || current === "'" || current === '`') { state = 'string'; quote = current; continue; }
    if (current === '(' || current === '[' || current === '{' || current === '<') stack.push(current);
    else if (closing[current] && stack[stack.length - 1] === closing[current]) stack.pop();
    else if (current === delimiter && stack.length === 0) {
      parts.push(text.slice(start, i));
      start = i + 1;
    }
  }
  parts.push(text.slice(start));
  return parts;
}

function commentImmediatelyBefore(text, end) {
  const start = text.lastIndexOf('/**', end);
  const close = text.lastIndexOf('*/', end);
  if (start < 0 || close < start || text.slice(close + 2, end).trim()) return '';
  return text.slice(start + 3, close)
    .replace(/^\s*\* ?/gm, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseFields(objectBody) {
  const fieldPattern = /^ {8}((?:[A-Za-z_$][\w$]*|"[^"\n]+"|'[^'\n]+'))(\?)?\s*:\s*/gm;
  const matches = [...objectBody.matchAll(fieldPattern)];
  return matches.map((match, index) => {
    const typeStart = match.index + match[0].length;
    const typeEnd = matches[index + 1]?.index ?? objectBody.length;
    const type = objectBody.slice(typeStart, typeEnd)
      .replace(/\/\*\*[\s\S]*?\*\//g, '')
      .replace(/;\s*$/, '')
      .replace(/\s+/g, ' ')
      .trim();
    return {
      name: match[1].replace(/^['"]|['"]$/g, ''),
      optional: Boolean(match[2]),
      type: type || 'unknown',
      description: commentImmediatelyBefore(objectBody, match.index),
    };
  });
}

function parseMethodDeclarations() {
  const source = fs.readFileSync(declarationsPath, 'utf8');
  const aliasStart = source.indexOf('export type ApiMethods<F> =');
  if (aliasStart < 0) throw new Error(`Could not find ApiMethods<F> in ${declarationsPath}`);
  const aliasBrace = source.indexOf('{', aliasStart);
  const aliasEnd = findMatchingDelimiter(source, aliasBrace, '{', '}');
  const body = source.slice(aliasBrace + 1, aliasEnd);
  const methodPattern = /^ {4}([A-Za-z_$][\w$]*)\(/gm;
  const starts = [...body.matchAll(methodPattern)];
  const declarations = new Map();

  for (let index = 0; index < starts.length; index += 1) {
    const start = starts[index].index;
    const end = starts[index + 1]?.index ?? body.length;
    const text = body.slice(start, end);
    const openParen = text.indexOf('(');
    const closeParen = findMatchingDelimiter(text, openParen, '(', ')');
    const params = splitTopLevel(text.slice(openParen + 1, closeParen)).map((part) => part.trim()).filter(Boolean);
    const fields = [];
    let payloadOptional = false;

    for (const param of params) {
      const colon = param.indexOf(':');
      if (colon < 0) continue;
      const parameterName = param.slice(0, colon).trim();
      const type = param.slice(colon + 1).trim();
      payloadOptional ||= /\?$/.test(parameterName);
      if (type.startsWith('{')) {
        const objectEnd = findMatchingDelimiter(type, 0, '{', '}');
        fields.push(...parseFields(type.slice(1, objectEnd)));
      } else {
        fields.push({
          name: parameterName.replace(/\?$/, ''),
          optional: /\?$/.test(parameterName),
          type,
          description: commentImmediatelyBefore(text, openParen + 1),
        });
      }
    }

    const result = text.slice(closeParen + 1).match(/^\s*:\s*([^;]+);/s)?.[1]?.trim() || 'void';
    declarations.set(starts[index][1], {
      name: starts[index][1],
      description: commentImmediatelyBefore(body, start),
      payloadOptional,
      hasPayload: params.length > 0,
      fields,
      result,
    });
  }

  const missing = TELEGRAM_API_METHODS.filter((method) => !declarations.has(method));
  const unregistered = [...declarations.keys()].filter((method) => !TELEGRAM_API_METHODS.includes(method));
  if (missing.length) throw new Error(`Missing declaration for ${missing.length} Bot API method(s): ${missing.join(', ')}`);
  if (unregistered.length) throw new Error(`Found ${unregistered.length} declaration(s) missing from the method registry: ${unregistered.join(', ')}`);
  const undocumented = [...declarations.values()].flatMap((method) => method.fields
    .filter((field) => !field.description || field.type === 'unknown')
    .map((field) => `${method.name}.${field.name}`));
  if (undocumented.length) throw new Error(`Missing field type/description for ${undocumented.length} parameter(s): ${undocumented.slice(0, 20).join(', ')}`);
  return declarations;
}

function methodSections(locale) {
  const assigned = new Set();
  return groups.map((group) => {
    const methods = TELEGRAM_API_METHODS.filter((method) => !assigned.has(method) && group.test(method));
    methods.forEach((method) => assigned.add(method));
    return { title: group[locale], methods };
  }).filter((group) => group.methods.length);
}

function escapeHtmlText(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeHtmlCell(value) {
  return escapeHtmlText(value || '—')
    .replace(/\|/g, '&#124;')
    .replace(/`/g, '&#96;')
    .replace(/\s+/g, ' ')
    .trim();
}

function renderCodeCell(value) {
  return `<code>${escapeHtmlCell(value)}</code>`;
}

const declarations = parseMethodDeclarations();
const methodCount = TELEGRAM_API_METHODS.length;
const fieldCount = TELEGRAM_API_METHODS.reduce((sum, method) => sum + declarations.get(method).fields.length, 0);

for (const locale of locales) {
  const { labels } = locale;
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
    `> ${locale.locale === 'id'
      ? `Indeks ini memuat **${methodCount} metode** dan **${fieldCount} parameter payload**. Setiap baris mengikuti deklarasi package; aturan akses dan batasan terbaru tetap ditentukan Telegram.`
      : locale.locale === 'en'
        ? `This index covers **${methodCount} methods** and **${fieldCount} payload parameters**. Rows follow package declarations; Telegram remains authoritative for current access rules and limits.`
        : `本索引包含 **${methodCount} 个方法**和 **${fieldCount} 个 payload 参数**。字段以 package 声明为准；最新权限规则和限制仍以 Telegram 为准。`}`,
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
    lines.push(`## ${title}`, '', methods.map((method) => `- [${method}](#${method.toLowerCase()})`).join('\n'), '');
    for (const methodName of methods) {
      const method = declarations.get(methodName);
      const fieldWord = locale.locale === 'zh' ? '个字段' : locale.locale === 'id' ? 'parameter' : 'fields';
      const countLabel = method.fields.length === 0 ? labels.noFields : `${method.fields.length} ${fieldWord}`;
      lines.push(
        `<span id="${method.name.toLowerCase()}" aria-hidden="true"></span>`,
        `::: details ${method.name} · ${countLabel}`,
        '',
        `**${labels.endpoint}:** [${method.name}](https://core.telegram.org/bots/api#${method.name.toLowerCase()})`,
        '',
        escapeHtmlText(method.description || (locale.locale === 'zh' ? 'Telegram 未在 package 声明中提供方法说明。' : locale.locale === 'id' ? 'Deskripsi metode tidak tersedia di deklarasi package.' : 'No method description is available in the package declarations.')),
        '',
        `- ${labels.arguments}: \`TelegramMethodArguments<'${method.name}'>\``,
        `- Payload: ${!method.hasPayload ? labels.noPayload : method.payloadOptional ? labels.payloadOptional : labels.payloadRequired}`,
        `- ${labels.result}: \`Promise<TelegramMethodResult<'${method.name}'>>\``,
        '',
      );

      if (method.fields.length) {
        lines.push(`**${labels.fieldsTitle}:**`, '',
          `| ${labels.field} | ${labels.requirement} | ${labels.type} | ${labels.description} |`,
          '| --- | --- | --- | --- |');
        for (const field of method.fields) {
          lines.push(`| ${renderCodeCell(field.name)} | ${field.optional ? labels.optional : labels.required} | ${renderCodeCell(field.type)} | ${escapeHtmlCell(field.description)} |`);
        }
        lines.push('');
      } else {
        lines.push(labels.noFields, '');
      }
      lines.push(':::','');
    }
  }

  lines.push(`## ${locale.relatedTitle}`, '', ...locale.related, '');
  fs.mkdirSync(path.dirname(locale.target), { recursive: true });
  fs.writeFileSync(locale.target, lines.join('\n'));
  console.log(`Generated ${locale.target} (${methodCount} methods, ${fieldCount} payload parameters, ${locale.locale}).`);
}
