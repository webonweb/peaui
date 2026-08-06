<script setup lang="ts">
import { TABLE_LIST_CLASS } from '../shared';
</script>

<template>
  <tr :class="`${TABLE_LIST_CLASS}__additional-row`">
    <slot />
  </tr>
</template>
