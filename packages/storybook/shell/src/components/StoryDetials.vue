<script lang="ts" setup>
const { name, description } = defineProps<{
  name: string;
  description: string;
}>();
</script>
<template>
  <div class="story-details">
    <div class="story-details__header">
      <h3 class="story-details__title">{{ name }}</h3>
    </div>

    <p class="story-details__description">
      {{ description }}
    </p>
  </div>
</template>

<style lang="scss" module>
.story-details {
  display: grid;
  grid-template-rows: repeat(2, max-content);
  row-gap: 1rem; /* gap-y-4 */
}

.story-details__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.story-details__title {
  font-size: 3rem;
  font-weight: 700;
  margin: 0;
  padding: 0;
}

.story-details__description {
  font-size: 1rem;
  color: light-dark(rgba(0, 0, 0, 0.6), #ffffff);
  line-height: 160%;
}
</style>
