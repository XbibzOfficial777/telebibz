<script setup lang="ts">
import { ArrowRight, BookOpen, Bot, Code2, FileText, Keyboard, ShieldCheck, Webhook } from '@lucide/vue'
import { computed } from 'vue'
import { Card } from './ui/card'

const props = withDefaults(defineProps<{
  href: string
  title: string
  description: string
  icon?: 'book' | 'bot' | 'code' | 'file' | 'keyboard' | 'shield' | 'webhook'
}>(), { icon: 'book' })

const icons = { book: BookOpen, bot: Bot, code: Code2, file: FileText, keyboard: Keyboard, shield: ShieldCheck, webhook: Webhook }
const iconComponent = computed(() => icons[props.icon] || BookOpen)
</script>

<template>
  <a :href="href" class="doc-card group">
    <Card class="doc-card-shell">
      <span class="doc-card-icon"><component :is="iconComponent" :size="19" :stroke-width="1.8" /></span>
      <span class="doc-card-copy">
        <strong>{{ title }}</strong>
        <span>{{ description }}</span>
      </span>
      <ArrowRight class="doc-card-arrow" :size="16" />
    </Card>
  </a>
</template>
