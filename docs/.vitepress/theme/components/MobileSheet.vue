<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useData, useRoute } from 'vitepress'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from 'reka-ui'
import { ArrowUpRight, Menu, X } from '@lucide/vue'
import { Button } from './ui/button'

const open = ref(false)
const { theme, site, localeIndex } = useData()
const route = useRoute()
const sections = computed(() => Array.isArray(theme.value.sidebar) ? theme.value.sidebar : [])
const languages = computed(() => Object.entries(site.value.locales).map(([key, locale]) => ({
  key,
  label: locale.label,
  href: locale.link || (key === 'root' ? '/' : `/${key}/`),
  current: key === localeIndex.value,
})))
const copy = computed(() => ({
  root: { trigger: 'Buka navigasi', title: 'Navigasi', description: 'Pilih panduan atau referensi.', close: 'Tutup navigasi', nav: 'Navigasi dokumentasi', language: 'Bahasa', current: 'Saat ini', repository: 'Buka repository di GitHub' },
  en: { trigger: 'Open navigation', title: 'Navigation', description: 'Choose a guide or reference page.', close: 'Close navigation', nav: 'Documentation navigation', language: 'Language', current: 'Current', repository: 'Open the GitHub repository' },
  zh: { trigger: '打开导航', title: '站点导航', description: '选择指南或参考文档。', close: '关闭导航', nav: '文档导航', language: '语言', current: '当前', repository: '打开 GitHub 仓库' },
}[localeIndex.value] || {
  trigger: 'Open navigation', title: 'Navigation', description: 'Choose a guide or reference page.', close: 'Close navigation', nav: 'Documentation navigation', language: 'Language', current: 'Current', repository: 'Open the GitHub repository',
}))

watch(() => route.path, () => { open.value = false })
</script>

<template>
  <DialogRoot v-model:open="open">
    <DialogTrigger as-child>
      <Button variant="outline" size="icon" class="mobile-sheet-trigger" :aria-label="copy.trigger">
        <Menu :size="18" :stroke-width="1.8" />
      </Button>
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay class="mobile-sheet-overlay" />
      <DialogContent class="mobile-sheet-content">
        <div class="mobile-sheet-header">
          <div>
            <DialogTitle class="mobile-sheet-title">{{ copy.title }}</DialogTitle>
            <DialogDescription class="mobile-sheet-description">{{ copy.description }}</DialogDescription>
          </div>
          <DialogClose as-child>
            <Button variant="ghost" size="icon" class="mobile-sheet-close" :aria-label="copy.close">
              <X :size="18" />
            </Button>
          </DialogClose>
        </div>
        <nav class="mobile-sheet-nav" :aria-label="copy.nav">
          <section v-for="section in sections" :key="section.text" class="mobile-sheet-section">
            <p class="mobile-sheet-label">{{ section.text }}</p>
            <a
              v-for="item in section.items || []"
              :key="item.link || item.text"
              :href="item.link || '#'"
              class="mobile-sheet-link"
              :aria-current="route.path === item.link ? 'page' : undefined"
              @click="open = false"
            >
              <span>{{ item.text }}</span>
              <ArrowUpRight :size="15" />
            </a>
          </section>
          <section class="mobile-sheet-section">
            <p class="mobile-sheet-label">{{ copy.language }}</p>
            <a
              v-for="language in languages"
              :key="language.key"
              :href="language.href"
              class="mobile-sheet-link"
              :aria-current="language.current ? 'page' : undefined"
              @click="open = false"
            >
              <span>{{ language.label }}</span>
              <span v-if="language.current" class="mobile-sheet-current">{{ copy.current }}</span>
            </a>
          </section>
        </nav>
        <a class="mobile-sheet-footer" href="https://github.com/XbibzOfficial777/telebibz" target="_blank" rel="noreferrer">
          {{ copy.repository }} <ArrowUpRight :size="15" />
        </a>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
