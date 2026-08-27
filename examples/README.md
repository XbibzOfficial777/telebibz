# Telebibz examples

These examples are intentionally small, runnable starting points for developers evaluating Telebibz. They use environment variables for secrets and do not contain real Telegram credentials.

## Run the examples

From the repository root:

```bash
npm install
export TELEGRAM_BOT_TOKEN="<your-bot-token>"
npx tsx examples/minimal.ts
```

The official npm package can be used from a separate project by replacing the local import path with `@xbibzlibrary/telebibz` and installing the package from npm.

## Available starters

| Example | Demonstrates | Start command |
|---|---|---|
| `minimal.ts` | Commands, text routing, and a minimal long-polling bot. | `npx tsx examples/minimal.ts` |
| `wizard-registration.ts` | A two-step name/age conversation with automatic continuation across messages. | `npx tsx examples/wizard-registration.ts` |
| `webhook.ts` | A Node.js HTTP server, webhook secret validation, and Telegram update handling. | `TELEGRAM_WEBHOOK_SECRET=<secret> npx tsx examples/webhook.ts` |

The wizard example starts the flow with `/register`, asks for a name, then asks for an age. Send `/cancel` to cancel an active flow. The webhook example requires both `TELEGRAM_BOT_TOKEN` and `TELEGRAM_WEBHOOK_SECRET`; expose the server through HTTPS in a deployment environment and configure the matching Telegram webhook secret.

## Production checklist

Use a secret manager or deployment environment for `TELEGRAM_BOT_TOKEN` and `TELEGRAM_WEBHOOK_SECRET`. Do not commit `.env` files or literal credentials. Run `npm run test:examples` before submitting changes. For production deployments, prefer a managed HTTPS endpoint, structured JSON logs, health checks, graceful shutdown, and a persistent storage adapter when conversations or sessions must survive restarts.

## More documentation

- [English API reference](../docs/API.md)
- [Bahasa Indonesia API reference](../docs/API.id.md)
- [简体中文 API reference](../docs/API.zh-CN.md)
- [GitHub Packages guide](../docs/GITHUB_PACKAGES.md)
- [Contributing guide](../CONTRIBUTING.md)
