---
title: Wizard 分步表单
description: 通过验证、按钮和会话状态创建多步骤对话。
---

# Wizard 分步表单

Wizard 会将当前步骤和答案保存在 `ctx.session` 中，因此无需自行实现对话状态。默认情况下，`bot.wizard(id, definition)` 也会注册同名命令；例如 ID 为 `signup` 时，可通过 `/signup` 启动。

## 支持解析与验证的文本表单

```js
bot.wizard('signup', {
  steps: [
    { key: 'name', ask: '你叫什么名字？' },
    {
      key: 'age',
      ask: '你多大了？',
      parse: Number,
      validate: (n) => (Number.isInteger(n) && n > 0 && n < 120
        ? null
        : '请输入有效年龄：'),
    },
  ],
  done: (answers, ctx) =>
    ctx.reply(`谢谢你，${answers.name}。你的年龄是 ${answers.age}。`),
});
```

每个步骤都需要 `key` 和 `ask`。`ask` 可为字符串或异步函数 `(ctx) => string`。`parse(input, ctx)` 会在验证前转换答案；`validate(value, ctx)` 在有效时返回 `null`，否则返回重试提示。所有步骤完成后会调用 `done(answers, ctx)`。

若要从其他处理器或按钮启动 Wizard，请调用 `bot.wizardStart(ctx, 'signup')`。`bot.wizard(id, definition, bindCommand)` 的第三个参数设为 `false` 时，不会自动注册命令。

## 使用按钮提供选项

选项可使用回复键盘或内联键盘。扁平按钮列表最多每行排列两个按钮；嵌套数组可显式定义行。对象 `{ text, value }` 可将显示标签与保存的值分开。

```js
bot.wizard('survey', {
  mode: 'edit',
  steps: [
    {
      key: 'region',
      ask: '你居住在哪个地区？',
      inline: true,
      onlyButtons: true,
      buttons: [[
        { text: '爪哇', value: 'java' },
        { text: '苏门答腊', value: 'sumatra' },
      ]],
    },
    { key: 'notes', ask: '还有其他补充吗？' },
  ],
  done: (answers, ctx) => ctx.reply(`已保存：${answers.region}`),
});
```

`inline: true` 会创建回调按钮；点击后无需输入即可保存对应值。未设置时显示回复键盘。`onlyButtons: true` 会拒绝该步骤的自由文本；也可将自定义拒绝提示字符串传给 `onlyButtons`。

## 显示模式与清理

- `mode: 'send'`（默认）：每个问题都发送为新消息。
- `mode: 'edit'`：将上一个问题编辑为下一个问题。
- `mode: 'delete'`：删除上一个问题，再发送下一个问题。
- 可在 Wizard 级别设置 `mode`，也可为单个步骤覆盖。
- 步骤中的 `opts` 会传给 `ctx.reply` 或编辑快捷方法，例如设置 parse mode。
- `oneTime` 仅适用于回复键盘。
- `cleanup: true` 会在完成后删除最后一个问题。delete 模式默认开启，其他模式默认关闭。
- `removeKeyboard` 会在完成时移除回复键盘；若 Wizard 使用过回复键盘，默认会移除。

Wizard 运行期间收到的非文本更新不会传给其他处理器；Wizard 会继续等待答案。默认取消词为 `batal`、`/batal` 和 `cancel`，可通过 `cancelWords` 修改。`onCancel(ctx)` 可发送自定义消息。多实例生产部署应使用共享会话存储；默认 Map 只属于单个进程。

## 从应用中控制 Wizard

```js
bot.action('start-survey', (ctx) => bot.wizardStart(ctx, 'survey'));

bot.cmd('cancel-form', async (ctx) => {
  if (bot.wizardActive(ctx)) await bot.wizardCancel(ctx);
});
```

机器人级控制方法包括 `wizardStart(ctx, id)`、`wizardActive(ctx)`、`wizardCancel(ctx)`、`wizardEdit(ctx, text, extra?)` 和 `wizardDelete(ctx)`。`ctx.session` 存储详见[会话指南](/zh/guide/files-sessions#会话)。
