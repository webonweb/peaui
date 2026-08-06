<script lang="ts" setup>
import InputSlider from '@peaui/ui/data-entry/InputSlider'
import { ref } from 'vue'

const ttt = ref(0)
</script>

<template>
  <InputSlider v-model:value="ttt" data-test-id="dodaje" name="kg" />
</template>
