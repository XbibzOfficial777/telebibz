<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import { ArrowRight, BookOpen, Code2 } from '@lucide/vue'
import { Button } from './ui/button'

const { localeIndex } = useData()
const copy = computed(() => ({
  root: { start: 'Buka panduan', repository: 'Lihat repository' },
  en: { start: 'Read the guide', repository: 'View repository' },
  zh: { start: '阅读指南', repository: '查看仓库' },
}[localeIndex.value] || { start: 'Read the guide', repository: 'View repository' }))
const prefix = computed(() => localeIndex.value === 'root' ? '' : `/${localeIndex.value}`)
</script>

<template>
  <div class="telebibz-home-actions">
    <Button as="a" :href="`${prefix}/guide/getting-started`" size="lg" class="home-primary-action">
      <BookOpen :size="17" />
      {{ copy.start }}
      <ArrowRight :size="16" />
    </Button>
    <Button as="a" href="https://github.com/XbibzOfficial777/telebibz" variant="outline" size="lg" class="home-secondary-action" target="_blank" rel="noreferrer">
      <Code2 :size="17" />
      {{ copy.repository }}
    </Button>
  </div>
</template>
