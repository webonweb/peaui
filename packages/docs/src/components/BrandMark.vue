<script setup lang="ts">
import logoDarkUrl from '@/assets/branding/peaui-logo-dark.png';
import logoUrl from '@/assets/branding/peaui-logo.png';
import markUrl from '@/assets/branding/peaui-mark.png';

withDefaults(
  defineProps<{
    variant?: 'full' | 'mark';
  }>(),
  {
    variant: 'mark',
  },
);
</script>

<template>
  <span class="brand-mark" :class="`brand-mark--${variant}`" aria-hidden="true">
    <img v-if="variant === 'mark'" class="brand-mark__image" :src="markUrl" alt="" />
    <template v-else>
      <img class="brand-mark__image brand-mark__image--light" :src="logoUrl" alt="" />
      <img class="brand-mark__image brand-mark__image--dark" :src="logoDarkUrl" alt="" />
    </template>
  </span>
</template>
