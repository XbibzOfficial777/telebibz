// lib/menus.js — Menu inline ala @grammyjs/menu (mandiri, tanpa dep tambahan).
'use strict';

const { Composer } = require('./composer');

const re = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * const menu = new Menu('cfg');
 * menu.text('🔔 Notif', async (ctx) => ctx.answerCallbackQuery('ditekan!'))
 *     .row()
 *     .url('Web', 'https://x')
 *     .submenu('Lanjut ▶', 'cfg-lanjut');
 *
 * bot.use(menu);                          // handler tombol terdaftar otomatis
 * bot.cmd('cfg', async (ctx) =>
 *   ctx.reply('Menu:', { reply_markup: await menu.render(ctx) }));
 */
class Menu extends Composer {
  constructor(id) {
    super();
    this.id = id;
    this._ops = [];
    this.callbackQuery(new RegExp(`^${re(id)}\\|`), async (ctx) => {
      const i = Number(ctx.callback_query.data.slice(id.length + 1));
      const op = this._ops[i];
      if (!op) return ctx.answerCallbackQuery({ text: '⌛ Tombol usang — kirim ulang menunya', show_alert: true }).catch(() => {});
      if (op.type === 'text' && op.handler) return op.handler(ctx);
      if (op.type === 'submenu') {
        const target = this._menus && this._menus.get(op.target);
        if (target) {
          try { await ctx.editMessageReplyMarkup({ reply_markup: await target.render(ctx) }); }
          catch { /* pesan mungkin termodifikasi */ }
          return ctx.answerCallbackQuery().catch(() => {});
        }
      }
      return ctx.answerCallbackQuery().catch(() => {});
    });
  }

  _add(o) { this._ops.push(o); return this; }

  /** Tombol teks + handler saat ditekan. */
  text(label, handler) { return this._add({ type: 'text', label, handler }); }
  /** Tombol tautan. */
  url(label, link, opts = {}) { return this._add({ type: 'url', label, link, opts }); }
  /** Tombol WebApp. */
  webApp(label, link) { return this._add({ type: 'webApp', label, link }); }
  /** Tombol pindah ke menu lain dengan id target (Menu diregister lewat container). */
  submenu(label, targetId) { return this._add({ type: 'submenu', label, target: targetId }); }
  /** Baris baru. */
  row() { return this._add({ type: 'row' }); }
  /** Shortcut: kembali ke menu parent. */
  back(label = '◀️ Kembali', parentId) { return this.submenu(label, parentId); }

  /** Render keyboard (inline_keyboard). */
  async render(ctx) {
    const rows = [[]];
    const push = (b) => rows[rows.length - 1].push(b);
    for (let i = 0; i < this._ops.length; i++) {
      const o = this._ops[i];
      if (o.type === 'row') { rows.push([]); continue; }
      if (o.type === 'url') { push({ text: o.label, url: o.link, ...(o.opts.style ? { style: o.opts.style } : {}), ...(o.opts.iconId ? { icon_custom_emoji_id: o.opts.iconId } : {}) }); continue; }
      if (o.type === 'webApp') { push({ text: o.label, web_app: { url: o.link } }); continue; }
      push({ text: o.label, callback_data: `${this.id}|${i}` });
    }
    return { inline_keyboard: rows.filter((r) => r.length) };
  }
}

/**
 * Wadah beberapa menu terkait (dengan submenu silang):
 *   const mc = new MenuContainer();
 *   const utama = mc.create('utama'), lanjut = mc.create('lanjut');
 *   utama.submenu('Lanjut ▶', 'lanjut'); lanjut.back('◀️', 'utama');
 *   bot.use(mc);
 */
class MenuContainer extends Composer {
  constructor() { super(); this._menus = new Map(); }
  create(id) {
    const m = new Menu(id);
    m._menus = this._menus;
    this._menus.set(id, m);
    this.use(m);
    return m;
  }
  get(id) { return this._menus.get(id); }
}

module.exports = { Menu, MenuContainer };
