---
title: 交互菜单
description: 使用 MenuContainer 创建内联菜单、回调、链接和子菜单。
---

# 交互菜单

`Menu` 和 `MenuContainer` 可将多个关联菜单组成可交互的内联键盘。`MenuContainer` 通过 `bot.use(container)` 将菜单回调注册为中间件。

## 主菜单与子菜单

```js
const { TeleBibz, MenuContainer } = require('@xbibzlibrary/telebibz');

const bot = new TeleBibz(process.env.BOT_TOKEN);
const menus = new MenuContainer();
const main = menus.create('main');
const settings = menus.create('settings');

main
  .submenu('设置', 'settings')
  .row()
  .url('文档', 'https://github.com/XbibzOfficial777/telebibz');

settings
  .text('切换通知', (ctx) => ctx.answerCallbackQuery('设置已更新'))
  .back('返回主菜单', 'main');

bot.use(menus.middleware());
bot.cmd('menu', async (ctx) => {
  await ctx.reply('请选择菜单：', { reply_markup: await main.render(ctx) });
});

bot.launch().catch(console.error);
```

`submenu(label, targetId)` 会将当前消息的内联键盘替换为目标菜单，并回答回调。`back(label, parentId)` 是返回上级菜单的快捷方式。目标 ID 必须与容器中已创建的菜单一致。

## 菜单方法

| 方法 | 用途 |
| --- | --- |
| `.text(label, handler)` | 回调按钮；处理器可回答回调、编辑消息或发送消息。 |
| `.url(label, link, options?)` | 外部链接按钮。 |
| `.webApp(label, link)` | 打开 Telegram Web App。 |
| `.submenu(label, targetId)` | 导航至容器中的其他菜单。 |
| `.back(label, parentId)` | 返回上级菜单的快捷方式。 |
| `.row()` | 开始新的一行按钮。 |
| `.render(ctx)` | 渲染供 `reply_markup` 使用的 `inline_keyboard` 对象。 |
| `menus.create(id)` / `menus.get(id)` | 按 ID 创建或获取菜单。 |

使用 `bot.use(menus)` 注册容器一次。单独的 `Menu` 可通过 `bot.use(menu)` 注册；多个菜单间的子菜单导航建议使用 `MenuContainer`。

## 回调与过期按钮

菜单回调数据包含菜单 ID 和按钮索引。如果回调已不符合当前菜单定义，库会将其作为过期按钮回答，不会运行对应处理器。菜单 ID 应简短且唯一。不要只依赖回调数据进行授权；请在处理器中验证用户权限。

静态键盘可使用 `btn`、`url`、`kb` helper 或 [Context 与键盘](/zh/guide/context-keyboards)中的 `InlineKeyboard`。
