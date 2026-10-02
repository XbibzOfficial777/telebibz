---
title: Interactive menus
description: Build inline menus, callbacks, links, and submenus with MenuContainer.
---

# Interactive menus

`Menu` and `MenuContainer` create interactive inline keyboards from connected menus. `MenuContainer` registers menu callbacks as middleware with `bot.use(container)`.

## Main menu and submenus

```js
const { TeleBibz, MenuContainer } = require('@xbibzlibrary/telebibz');

const bot = new TeleBibz(process.env.BOT_TOKEN);
const menus = new MenuContainer();
const main = menus.create('main');
const settings = menus.create('settings');

main
  .submenu('Settings', 'settings')
  .row()
  .url('Documentation', 'https://github.com/XbibzOfficial777/telebibz');

settings
  .text('Toggle notifications', (ctx) => ctx.answerCallbackQuery('Settings updated'))
  .back('Back to the main menu', 'main');

bot.use(menus.middleware());
bot.cmd('menu', async (ctx) => {
  await ctx.reply('Choose a menu:', { reply_markup: await main.render(ctx) });
});

bot.launch().catch(console.error);
```

`submenu(label, targetId)` replaces the current message's inline keyboard with the target menu and answers the callback. `back(label, parentId)` is an alias for navigating to a parent menu. The target ID must match a menu in the container.

## Menu methods

| Method | Purpose |
| --- | --- |
| `.text(label, handler)` | Callback button; the handler can answer the callback, edit the message, or send a message. |
| `.url(label, link, options?)` | External link button. |
| `.webApp(label, link)` | Opens a Telegram Web App. |
| `.submenu(label, targetId)` | Navigates to another menu in the container. |
| `.back(label, parentId)` | Shortcut for navigating back. |
| `.row()` | Starts a new button row. |
| `.render(ctx)` | Renders an `inline_keyboard` object for `reply_markup`. |
| `menus.create(id)` / `menus.get(id)` | Creates or retrieves a menu by ID. |

Register the container once with `bot.use(menus)`. A standalone `Menu` can be registered with `bot.use(menu)`; use `MenuContainer` to manage submenu navigation across menus.

## Callbacks and stale buttons

Menu callback data contains a menu ID and button index. A callback that no longer matches the menu definition is answered as stale and its handler is not called. Keep menu IDs short and unique. Do not use callbacks as the only authorization check; validate the user's permissions in the handler.

For a static keyboard without menu navigation, use `btn`, `url`, and `kb`, or `InlineKeyboard` from [Context and keyboards](/en/guide/context-keyboards).
