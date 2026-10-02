---
title: Wizards
description: Build multi-step conversations with validation, buttons, and session state.
---

# Wizards

A wizard stores the current step and answers in `ctx.session`, so you do not need to implement conversation state yourself. By default, `bot.wizard(id, definition)` also registers a command with that ID; for example, the ID `signup` is started by `/signup`.

## Text form with parsing and validation

```js
bot.wizard('signup', {
  steps: [
    { key: 'name', ask: 'What is your name?' },
    {
      key: 'age',
      ask: 'How old are you?',
      parse: Number,
      validate: (n) => (Number.isInteger(n) && n > 0 && n < 120
        ? null
        : 'Enter a valid age: '),
    },
  ],
  done: (answers, ctx) =>
    ctx.reply(`Thanks, ${answers.name}. Your age is ${answers.age}.`),
});
```

Each step needs a `key` and `ask`. `ask` can be a string or an async function `(ctx) => string`. `parse(input, ctx)` transforms the answer before validation; `validate(value, ctx)` returns `null` when valid or a retry message. `done(answers, ctx)` runs after the final step.

To start a wizard from another handler or a button, call `bot.wizardStart(ctx, 'signup')`. The third argument to `bot.wizard(id, definition, bindCommand)` can be `false` to skip automatic command registration.

## Choices with buttons

Choices can use a reply keyboard or inline keyboard. Flat button lists are arranged up to two per row; nested arrays define rows explicitly. An object `{ text, value }` separates the visible label from the stored value.

```js
bot.wizard('survey', {
  mode: 'edit',
  steps: [
    {
      key: 'region',
      ask: 'Which region do you live in?',
      inline: true,
      onlyButtons: true,
      buttons: [[
        { text: 'Java', value: 'java' },
        { text: 'Sumatra', value: 'sumatra' },
      ]],
    },
    { key: 'notes', ask: 'Anything else to add?' },
  ],
  done: (answers, ctx) => ctx.reply(`Saved: ${answers.region}`),
});
```

`inline: true` creates callback buttons; clicking one stores its value without typing. Without it, the wizard displays a reply keyboard. `onlyButtons: true` rejects free text for that step; pass a string to `onlyButtons` to customize the rejection message.

## Display modes and cleanup

- `mode: 'send'` (default) sends each prompt as a new message.
- `mode: 'edit'` edits the previous prompt into the next one.
- `mode: 'delete'` deletes the previous prompt and sends the next one.
- Set `mode` for the wizard or override it per step.
- A step's `opts` are passed to the `ctx.reply` or edit shortcut, for example to set parse mode.
- `oneTime` applies to reply keyboards only.
- `cleanup: true` deletes the last prompt when the wizard completes. It defaults to `true` in delete mode and `false` otherwise.
- `removeKeyboard` removes a reply keyboard on completion; it defaults to enabled when the wizard used one.

Non-text updates received while a wizard is active are not passed to other handlers; the wizard continues waiting for an answer. Default cancellation words are `batal`, `/batal`, and `cancel`; set `cancelWords` to change them. `onCancel(ctx)` can send a custom response. For multi-instance production deployments, use shared session storage; the default Map belongs to one process.

## Controlling a wizard from the application

```js
bot.action('start-survey', (ctx) => bot.wizardStart(ctx, 'survey'));

bot.cmd('cancel-form', async (ctx) => {
  if (bot.wizardActive(ctx)) await bot.wizardCancel(ctx);
});
```

Bot-level controls include `wizardStart(ctx, id)`, `wizardActive(ctx)`, `wizardCancel(ctx)`, `wizardEdit(ctx, text, extra?)`, and `wizardDelete(ctx)`. See [sessions](/en/guide/files-sessions#sessions) for `ctx.session` storage.
