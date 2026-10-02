---
title: grammY 用户迁移说明
description: 将熟悉的 grammY 概念映射到 TeleBibz API。
---

# grammY 用户迁移说明

TeleBibz 借鉴了 grammY 生态中常见的 Composer 与 Context API 模式，但它**不是兼容包**。迁移代码前请检查 TeleBibz API 和类型声明；部分方法名有意采用了不同的缩写。

| 熟悉的概念 | TeleBibz 对应方式 |
| --- | --- |
| 命令处理器 | `bot.cmd('start', handler)` 或 `bot.start(handler)` |
| 文本处理器 | `bot.hears(match, handler)` |
| 更新过滤器 | `bot.on(filter, handler)` |
| 回调查询数据 | `bot.action(trigger, handler)` |
| Context 回复 | `ctx.reply(text, extra)` |
| Bot API 客户端 | `bot.api.*`、`ctx.api.*`、`callApi(method, payload)` |
| 中间件 | `bot.use((ctx, next) => ...)` |
| Composer 分支/过滤/丢弃/路由/延迟/fork | TeleBibz Composer 中相似概念的方法 |
| Inline 模式 | `bot.inlineQuery(trigger, handler)` 与 `iq` Builder |
| 会话 | 会话中间件已安装到机器人管线中；通过 `ctx.session` 访问 |
| 菜单 | 内置 `Menu` 或 `MenuContainer` |
| 对话表单 | `bot.wizard(id, definition)` |
| 自动重试/限流/限制器 | 软件包提供的 `autoRetry()`、`throttler()` 和 `limiter()` |

## 重要差异

- TeleBibz 实例使用 `cmd()`，而非 `command()`。
- `hears` 中的字符串按完整文本匹配且不区分大小写；需要模式匹配时请使用正则表达式。
- TeleBibz 软件包内置菜单、Wizard、limiter、群发、下载辅助方法、Rich Messages 等工具。
- 默认会话使用内存 `Map`；除非更换存储，否则进程重启会清除状态。
- 部分 TeleBibz API 方法提供位置参数快捷方式；其他代理方法接收一个 payload 对象。详见 [Bot API 参考](/zh/reference/api)。
- 类型、传输选项与 Telegram 支持情况取决于 TeleBibz 版本，不应假设兼容 grammY 插件。

先迁移一个简单处理器并运行类型检查和机器人测试，再逐步迁移中间件、会话和插件。迁移期间不要复制生产令牌，也不要让两个轮询器使用同一令牌。
