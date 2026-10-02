---
title: 常见问题与排查
description: 解决运行 TeleBibz 机器人时常见的问题。
---

# 常见问题与排查

## 机器人没有响应

1. 检查 Node.js 进程是否仍在运行，且没有错误。
2. 确认 `BOT_TOKEN` 已正确设置，并来自 @BotFather。
3. 在私聊中，先打开机器人并点击 **Start**。
4. 检查更新是否匹配处理器；例如 `/start` 应由 `bot.start(...)` 或 `bot.cmd('start', ...)` 处理。
5. 使用 Webhook 时，检查公开 HTTPS 地址、密钥、路由和 JSON 请求体处理。

## 轮询时出现 409 Conflict

通常是另一个进程正使用同一机器人令牌调用 `getUpdates`。停止旧进程或重复轮询器，并确保仅运行一个轮询实例。TeleBibz 会重试轮询冲突，但不建议运行多个轮询器。

## 出现 429 Too Many Requests

使用 `bot.api.config.use(autoRetry())` 遵守 Telegram 返回的 `retry_after`。添加 `throttler()` 控制 API 请求速率，并遵守 Telegram 对相应接口和聊天的限制。

## 文件上传失败

用 `InputFile` 包装字节、路径或 Stream，并检查所用接口是否接受该文件格式。另请检查读取权限、payload 大小和 Telegram 限制。

## 如何干净地停止轮询？

调用 `bot.stop()`，并在关闭期间等待 `bot.runPromise`。生产环境中请处理进程信号，并确保只有一个进程负责轮询。

## 在哪里报告问题？

请在 [GitHub Issues](https://github.com/XbibzOfficial777/telebibz/issues) 中提供 TeleBibz 与 Node.js 版本、错误信息和最小复现示例。不要包含机器人令牌或其他秘密。
