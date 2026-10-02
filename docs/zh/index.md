---
layout: home
hero:
  name: TeleBibz
  text: 面向 Node.js 的 Telegram Bot API 库
  tagline: 处理更新、组合中间件，并通过一个库调用 Bot API。
  image:
    src: /telebibz-hero.svg
    alt: TeleBibz 代码与 Telegram 机器人回复示例
features:
  - icon:
      src: /feature-start.svg
      alt: 代码图标
      width: 32
      height: 32
      wrap: true
    title: 快速开始
    details: 安装软件包，设置 BotFather 令牌，然后启动长轮询。
  - icon:
      src: /feature-modules.svg
      alt: 模块图标
      width: 32
      height: 32
      wrap: true
    title: 统一的 API
    details: 使用处理器、Context、键盘、菜单、Wizard、会话和文件上传。
  - icon:
      src: /feature-reliable.svg
      alt: 可靠性图标
      width: 32
      height: 32
      wrap: true
    title: 运行控制
    details: 配置 Webhook、速率限制、重试、错误处理和测试传输。
---

<div class="telebibz-note">
  <strong>从这里开始</strong>
  <p>先阅读<a href="/zh/guide/getting-started">安装指南</a>，再了解<a href="/zh/guide/handlers">处理器</a>和 <a href="/zh/reference/api">Bot API 参考</a>。</p>
</div>

## 学习路径

<div class="telebibz-grid">
  <DocCard icon="book" href="/zh/guide/getting-started" title="01 · 安装" description="安装 TeleBibz 并运行第一个机器人。" />
  <DocCard icon="code" href="/zh/guide/architecture" title="02 · 更新处理流程" description="了解更新如何经过 Context、中间件和 API。" />
  <DocCard icon="keyboard" href="/zh/guide/context-keyboards" title="03 · Context 与键盘" description="处理消息并创建交互按钮。" />
  <DocCard icon="bot" href="/zh/guide/wizard" title="04 · Wizard" description="通过验证与选项创建分步表单。" />
</div>

## 关于 TeleBibz

TeleBibz 是面向 Node.js 的 Telegram Bot API 库，以 [`@xbibzlibrary/telebibz`](https://www.npmjs.com/package/@xbibzlibrary/telebibz) 发布。当前版本需要 **Node.js 18 或更高版本**，并附带 TypeScript 类型声明。

本文档涵盖处理器、中间件、会话、键盘、媒体、Rich Messages 和部署。关于最新接口参数、权限与限制，请参阅 [Telegram Bot API 官方文档](https://core.telegram.org/bots/api)。

<div class="telebibz-note">
  <strong>机器人令牌</strong>
  <p>请将令牌保存在环境变量或密钥管理器中，不要写入源代码、浏览器端或代码仓库。</p>
</div>
