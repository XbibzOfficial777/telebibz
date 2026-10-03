import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vitepress'

const themeDir = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(themeDir, '../..')
const pkg = JSON.parse(fs.readFileSync(path.join(repoRoot, 'package.json'), 'utf8')) as { version: string }
const fromGitHubActions = process.env.GITHUB_ACTIONS === 'true'
const rawAsset = 'https://raw.githubusercontent.com/XbibzOfficial777/telebibz/main/assets'
const siteLogo = fromGitHubActions
  ? {
      light: `${rawAsset}/telebibz-logo.png`,
      dark: `${rawAsset}/telebibz-logo-dark.png`,
      alt: 'TeleBibz — Telegram Bot API library',
    }
  : {
      light: '/telebibz-logo.png',
      dark: '/telebibz-logo-dark.png',
      alt: 'TeleBibz — Telegram Bot API library',
    }
const favicon = fromGitHubActions
  ? `${rawAsset}/telebibz-symbol.png`
  : '/telebibz-symbol.png'

const repository = 'https://github.com/XbibzOfficial777/telebibz'
const versionMenu = (label: string) => ({
  text: label,
  items: [
    { text: 'npm', link: 'https://www.npmjs.com/package/@xbibzlibrary/telebibz' },
    { text: 'GitHub', link: repository },
    { text: 'Changelog', link: `${repository}/blob/main/CHANGELOG.md` },
  ],
})
const versionMenuZh = {
  text: `版本 ${pkg.version}`,
  items: [
    { text: 'npm 软件包', link: 'https://www.npmjs.com/package/@xbibzlibrary/telebibz' },
    { text: 'GitHub 仓库', link: repository },
    { text: '更新日志', link: `${repository}/blob/main/CHANGELOG.md` },
  ],
}

const sidebarId = [
  { text: 'Mulai di sini', items: [
    { text: 'Pengenalan', link: '/' },
    { text: 'Mulai cepat', link: '/guide/getting-started' },
    { text: 'Konfigurasi', link: '/guide/configuration' },
  ] },
  { text: 'Panduan', items: [
    { text: 'Arsitektur & siklus update', link: '/guide/architecture' },
    { text: 'Handler & filter', link: '/guide/handlers' },
    { text: 'Middleware & composer', link: '/guide/middleware' },
    { text: 'Context & keyboard', link: '/guide/context-keyboards' },
    { text: 'Menu interaktif', link: '/guide/menus' },
    { text: 'Wizard', link: '/guide/wizard' },
    { text: 'File & session', link: '/guide/files-sessions' },
    { text: 'Rich Messages', link: '/guide/rich-messages' },
    { text: 'Inline mode & broadcast', link: '/guide/inline-broadcast' },
    { text: 'Rate limit & error', link: '/guide/reliability' },
    { text: 'Pemecahan masalah', link: '/guide/troubleshooting' },
    { text: 'Polling & webhook', link: '/guide/deployment' },
    { text: 'Pola operasi produksi', link: '/guide/production-patterns' },
    { text: 'Transport & testing', link: '/guide/transports-testing' },
    { text: 'Catatan pengguna grammY', link: '/guide/migration-grammy' },
  ] },
  { text: 'Referensi', items: [
    { text: 'Telegram API', link: '/reference/api' },
    { text: 'Context', link: '/reference/context' },
    { text: 'Daftar metode Bot API', link: '/reference/methods' },
    { text: 'TypeScript', link: '/reference/typescript' },
    { text: 'Opsi bot', link: '/reference/options' },
  ] },
  { text: 'Lainnya', items: [
    { text: 'Contoh siap jalan', link: '/examples' },
    { text: 'FAQ & pemecahan masalah', link: '/faq' },
  ] },
]

const sidebarEn = [
  { text: 'Start here', items: [
    { text: 'Overview', link: '/en/' },
    { text: 'Getting started', link: '/en/guide/getting-started' },
    { text: 'Configuration', link: '/en/guide/configuration' },
  ] },
  { text: 'Guides', items: [
    { text: 'Update lifecycle', link: '/en/guide/architecture' },
    { text: 'Handlers and filters', link: '/en/guide/handlers' },
    { text: 'Middleware and Composer', link: '/en/guide/middleware' },
    { text: 'Context and keyboards', link: '/en/guide/context-keyboards' },
    { text: 'Interactive menus', link: '/en/guide/menus' },
    { text: 'Wizard forms', link: '/en/guide/wizard' },
    { text: 'Files and sessions', link: '/en/guide/files-sessions' },
    { text: 'Rich Messages', link: '/en/guide/rich-messages' },
    { text: 'Inline mode and broadcast', link: '/en/guide/inline-broadcast' },
    { text: 'Rate limits and errors', link: '/en/guide/reliability' },
    { text: 'Troubleshooting', link: '/en/guide/troubleshooting' },
    { text: 'Polling and webhooks', link: '/en/guide/deployment' },
    { text: 'Production operations', link: '/en/guide/production-patterns' },
    { text: 'Transport and testing', link: '/en/guide/transports-testing' },
    { text: 'Notes for grammY users', link: '/en/guide/migration-grammy' },
  ] },
  { text: 'Reference', items: [
    { text: 'Bot API', link: '/en/reference/api' },
    { text: 'Context', link: '/en/reference/context' },
    { text: 'Method list', link: '/en/reference/methods' },
    { text: 'TypeScript', link: '/en/reference/typescript' },
    { text: 'Bot options', link: '/en/reference/options' },
  ] },
  { text: 'More', items: [
    { text: 'Examples', link: '/en/examples' },
    { text: 'FAQ', link: '/en/faq' },
    { text: 'Full English README', link: `${repository}/blob/main/README.md` },
  ] },
]

const sidebarZh = [
  { text: '开始使用', items: [
    { text: '概览', link: '/zh/' },
    { text: '快速开始', link: '/zh/guide/getting-started' },
    { text: '配置', link: '/zh/guide/configuration' },
  ] },
  { text: '指南', items: [
    { text: '更新处理流程', link: '/zh/guide/architecture' },
    { text: '处理器与过滤器', link: '/zh/guide/handlers' },
    { text: '中间件与 Composer', link: '/zh/guide/middleware' },
    { text: 'Context 与键盘', link: '/zh/guide/context-keyboards' },
    { text: '交互菜单', link: '/zh/guide/menus' },
    { text: 'Wizard 表单', link: '/zh/guide/wizard' },
    { text: '文件与会话', link: '/zh/guide/files-sessions' },
    { text: 'Rich Messages', link: '/zh/guide/rich-messages' },
    { text: 'Inline 与群发', link: '/zh/guide/inline-broadcast' },
    { text: '速率限制与错误', link: '/zh/guide/reliability' },
    { text: '故障排查', link: '/zh/guide/troubleshooting' },
    { text: '轮询与 Webhook', link: '/zh/guide/deployment' },
    { text: '生产运维模式', link: '/zh/guide/production-patterns' },
    { text: 'Transport 与测试', link: '/zh/guide/transports-testing' },
    { text: 'grammY 用户迁移说明', link: '/zh/guide/migration-grammy' },
  ] },
  { text: '参考', items: [
    { text: 'Bot API', link: '/zh/reference/api' },
    { text: 'Context', link: '/zh/reference/context' },
    { text: '方法列表', link: '/zh/reference/methods' },
    { text: 'TypeScript', link: '/zh/reference/typescript' },
    { text: 'Bot 配置项', link: '/zh/reference/options' },
  ] },
  { text: '更多', items: [
    { text: '示例', link: '/zh/examples' },
    { text: '常见问题', link: '/zh/faq' },
    { text: 'English README', link: `${repository}/blob/main/README.md` },
  ] },
]

const commonSearch = {
  provider: 'local' as const,
  options: {
    locales: {
      root: {
        translations: {
          button: { buttonText: 'Cari dokumentasi', buttonAriaLabel: 'Cari dokumentasi' },
          modal: { noResultsText: 'Tidak ada hasil', resetButtonTitle: 'Hapus pencarian', footer: { selectText: 'pilih', navigateText: 'navigasi', closeText: 'tutup' } },
        },
      },
      en: {
        translations: {
          button: { buttonText: 'Search', buttonAriaLabel: 'Search documentation' },
          modal: { noResultsText: 'No results', resetButtonTitle: 'Clear search', footer: { selectText: 'select', navigateText: 'navigate', closeText: 'close' } },
        },
      },
      zh: {
        translations: {
          button: { buttonText: '搜索', buttonAriaLabel: '搜索文档' },
          modal: { noResultsText: '没有结果', resetButtonTitle: '清除搜索', footer: { selectText: '选择', navigateText: '导航', closeText: '关闭' } },
        },
      },
    },
  },
}

const sharedTheme = {
  logo: siteLogo,
  outline: { level: [2, 3], label: 'Di halaman ini' },
  editLink: { pattern: `${repository}/edit/main/docs/:path`, text: 'Sarankan perbaikan di GitHub' },
  socialLinks: [{ icon: 'github', link: repository }],
  search: commonSearch,
  i18nRouting: false,
}

const themeEn = {
  ...sharedTheme,
  siteTitle: 'TeleBibz',
  langMenuLabel: 'Language',
  nav: [
    { text: 'Guides', link: '/en/guide/getting-started' },
    { text: 'Bot API', link: '/en/reference/api' },
    { text: 'Examples', link: '/en/examples' },
    versionMenu(`v${pkg.version}`),
  ],
  sidebar: sidebarEn,
  outline: { level: [2, 3], label: 'On this page' },
  editLink: { pattern: `${repository}/edit/main/docs/:path`, text: 'Suggest an edit on GitHub' },
  footer: { message: 'TeleBibz documentation', copyright: 'TeleBibz · MIT License' },
  docFooter: { prev: 'Previous page', next: 'Next page' },
  darkModeSwitchLabel: 'Appearance',
  lightModeSwitchTitle: 'Switch to light theme',
  darkModeSwitchTitle: 'Switch to dark theme',
  sidebarMenuLabel: 'Documentation menu',
  returnToTopLabel: 'Return to top',
  skipToContentLabel: 'Skip to content',
  lastUpdatedText: 'Last updated',
  notFound: { title: 'PAGE NOT FOUND', quote: 'This page may have moved or no longer exists.', linkLabel: 'Return to home', linkText: 'Home' },
}

const themeZh = {
  ...sharedTheme,
  siteTitle: 'TeleBibz 文档',
  langMenuLabel: '选择语言',
  nav: [
    { text: '指南', link: '/zh/guide/getting-started' },
    { text: 'Bot API', link: '/zh/reference/api' },
    { text: '示例', link: '/zh/examples' },
    versionMenuZh,
  ],
  sidebar: sidebarZh,
  outline: { level: [2, 3], label: '本页目录' },
  editLink: { pattern: `${repository}/edit/main/docs/:path`, text: '在 GitHub 上建议修改' },
  footer: { message: 'TeleBibz 文档', copyright: 'TeleBibz · MIT License' },
  docFooter: { prev: '上一页', next: '下一页' },
  darkModeSwitchLabel: '外观',
  lightModeSwitchTitle: '切换到浅色主题',
  darkModeSwitchTitle: '切换到深色主题',
  sidebarMenuLabel: '文档菜单',
  returnToTopLabel: '返回顶部',
  skipToContentLabel: '跳转到正文',
  lastUpdatedText: '最后更新',
  notFound: { title: '页面未找到', quote: '页面可能已移动或不再存在。', linkLabel: '返回首页', linkText: '首页' },
}

const themeId = {
  ...sharedTheme,
  siteTitle: 'TeleBibz',
  langMenuLabel: 'Bahasa',
  nav: [
    { text: 'Panduan', link: '/guide/getting-started' },
    { text: 'Referensi API', link: '/reference/api' },
    { text: 'Contoh', link: '/examples' },
    versionMenu(`v${pkg.version}`),
  ],
  sidebar: sidebarId,
  footer: { message: 'Dokumentasi TeleBibz', copyright: 'TeleBibz · MIT License' },
  docFooter: { prev: 'Halaman sebelumnya', next: 'Halaman berikutnya' },
  darkModeSwitchLabel: 'Tampilan',
  lightModeSwitchTitle: 'Gunakan tema terang',
  darkModeSwitchTitle: 'Gunakan tema gelap',
  sidebarMenuLabel: 'Menu dokumentasi',
  returnToTopLabel: 'Kembali ke atas',
  skipToContentLabel: 'Lewati ke konten',
  lastUpdatedText: 'Terakhir diperbarui',
  notFound: { title: 'HALAMAN TIDAK DITEMUKAN', quote: 'Halaman ini mungkin telah dipindahkan atau tidak tersedia.', linkLabel: 'Kembali ke beranda', linkText: 'Beranda' },
}

export default defineConfig({
  lang: 'id-ID',
  title: 'TeleBibz',
  description: 'Dokumentasi TeleBibz — library Telegram Bot API untuk Node.js.',
  base: process.env.PAGES_BASE_PATH || '/',
  cleanUrls: true,
  lastUpdated: true,
  locales: {
    root: { label: 'Bahasa Indonesia', lang: 'id-ID', title: 'TeleBibz', description: 'Dokumentasi TeleBibz dalam Bahasa Indonesia.', themeConfig: themeId },
    en: { label: 'English', lang: 'en-US', title: 'TeleBibz', description: 'TeleBibz Telegram Bot API documentation for Node.js.', themeConfig: themeEn },
    zh: { label: '简体中文', lang: 'zh-CN', title: 'TeleBibz', description: 'TeleBibz Node.js Telegram Bot API 文档。', themeConfig: themeZh },
  },
  vite: {
    plugins: [tailwindcss()],
    resolve: { alias: { '@': path.resolve(themeDir, 'theme') } },
    server: { allowedHosts: true },
  },
  head: [
    ['meta', { name: 'theme-color', content: '#1d292f' }],
    ['meta', { property: 'og:title', content: 'TeleBibz — Telegram Bot API' }],
    ['meta', { property: 'og:description', content: 'Documentation for the TeleBibz Node.js library.' }],
    ['link', { rel: 'icon', type: 'image/png', href: favicon }],
  ],
  markdown: {
    lineNumbers: true,
    theme: { light: 'github-light', dark: 'github-dark' },
  },
  themeConfig: themeId,
})
