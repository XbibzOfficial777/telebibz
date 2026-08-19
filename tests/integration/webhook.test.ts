import { describe, expect, it } from "vitest";
import { createMockUpdate, createTestBot } from "../../src/testing.js";
import { createWebhookHandler } from "../../src/webhook/handler.js";

describe("webhook integration", () => {
  it("delivers a validated update to the bot pipeline", async () => {
    const { bot } = createTestBot();
    let received = false;
    bot.use(async (_ctx, next) => { received = true; await next(); });
    const handler = createWebhookHandler(bot);
    const response = await handler(new Request("https://example.test", { method: "POST", body: JSON.stringify(createMockUpdate()), headers: { "content-type": "application/json" } }));
    expect(response.status).toBe(200);
    expect(received).toBe(true);
  });
});
