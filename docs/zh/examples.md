---
title: 示例
description: 来自仓库的 TeleBibz 机器人可运行示例。
---

# 示例

TeleBibz 仓库的 [`examples/`](https://github.com/XbibzOfficial777/telebibz/tree/main/examples) 目录包含 JavaScript 示例。请先克隆仓库、安装依赖并设置 `BOT_TOKEN`。

| 文件 | 内容 |
| --- | --- |
| [`01-quickstart.js`](https://github.com/XbibzOfficial777/telebibz/blob/main/examples/01-quickstart.js) | 第一个机器人、命令和文本处理器。 |
| [`02-menu-tombol.js`](https://github.com/XbibzOfficial777/telebibz/blob/main/examples/02-menu-tombol.js) | 内联键盘与回调。 |
| [`03-wizard.js`](https://github.com/XbibzOfficial777/telebibz/blob/main/examples/03-wizard.js) | Wizard 验证、选项与编辑模式。 |
| [`04-broadcast.js`](https://github.com/XbibzOfficial777/telebibz/blob/main/examples/04-broadcast.js) | 向聊天 ID 群发并检查管理员权限。 |
| [`05-kirim-file.js`](https://github.com/XbibzOfficial777/telebibz/blob/main/examples/05-kirim-file.js) | 发送文件与照片。 |
| [`06-menu.js`](https://github.com/XbibzOfficial777/telebibz/blob/main/examples/06-menu.js) | 带子菜单的菜单。 |
| [`07-inline-query.js`](https://github.com/XbibzOfficial777/telebibz/blob/main/examples/07-inline-query.js) | Inline 模式。 |
| [`08-rich-message.js`](https://github.com/XbibzOfficial777/telebibz/blob/main/examples/08-rich-message.js) | Rich Messages、回调与草稿。 |

仓库示例在仓库内部运行，因此使用 `require('..')`。若移至独立机器人项目，请改为 `require('@xbibzlibrary/telebibz')`。
## 带节流与优雅关闭的服务机器人

此示例组合了管理员校验、单用户更新限流、API 节流、`retry_after` 重试和轮询关闭。请通过 secret environment 设置 `ADMIN_ID`，不要把机器人 token 写入源码。

```js
const { TeleBibz, autoRetry, throttler, limiter, btn, kb } = require('@xbibzlibrary/telebibz');

const token = process.env.BOT_TOKEN;
if (!token) throw new Error('未设置 BOT_TOKEN。');
const adminId = process.env.ADMIN_ID;

const bot = new TeleBibz(token, {
  maxConcurrentUpdates: 32,
  onError: (err, ctx) => {
    console.error({
      name: err?.name,
      code: err?.error_code,
      updateId: ctx?.update?.update_id,
    }, '更新处理失败');
  },
});

bot.api.config.use(throttler({ perSecond: 25 }));
bot.api.config.use(autoRetry({ maxRetry: 5, baseDelayMs: 500 }));
bot.use(limiter({ windowMs: 2_000, limit: 3 }));

bot.cmd('start', (ctx) => ctx.reply(
  '请选择操作：', kb([[btn('检查状态', 'status')]]),
));
bot.action('status', async (ctx) => {
  await ctx.answerCallbackQuery();
  return ctx.reply('机器人正在接收更新。');
});
bot.cmd('admin', (ctx) => {
  if (!adminId || String(ctx.from?.id) !== adminId) return;
  return ctx.reply('管理员校验通过。');
});

let stopping = false;
async function shutdown() {
  if (stopping) return;
  stopping = true;
  bot.stop();
  await bot.runPromise;
}
process.once('SIGINT', () => { void shutdown(); });
process.once('SIGTERM', () => { void shutdown(); });

bot.launch({ noSignalHandlers: true }).catch((err) => {
  console.error({ name: err?.name }, '机器人启动失败');
  process.exitCode = 1;
});
```

::: warning 进程内限制
示例中的 `limiter()` 和 `throttler()` 仅作用于当前进程。运行多个 worker 时，请使用共享限流器/队列。`ADMIN_ID` 只演示 command 权限校验；真实 handler 还应检查 chat、权限和操作影响。不要记录 token 或完整 update。
:::
