<template>
  <div class="story-preview">
    <div class="story-preview__grid" aria-hidden="true" />
    <div class="story-preview__content">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.story-preview {
  position: relative;
  display: grid;
  min-height: 18rem;
  place-items: center;
  overflow: hidden;
  padding: clamp(1.25rem, 4vw, 3rem);
  border: 1px solid var(--docs-border, #dce3ec);
  border-radius: 0.9rem;
  background: #fff;
  box-shadow: 0 1rem 2.5rem rgba(24, 42, 69, 0.06);
}

.story-preview__grid {
  position: absolute;
  inset: 0;
  opacity: 0.42;
  background-image:
    linear-gradient(rgba(69, 91, 122, 0.075) 1px, transparent 1px),
    linear-gradient(90deg, rgba(69, 91, 122, 0.075) 1px, transparent 1px);
  background-size: 1.5rem 1.5rem;
  pointer-events: none;
}

.story-preview__content {
  position: relative;
  z-index: 1;
  width: 100%;
  min-width: 0;
}

:deep(.story-preview__content > *) {
  max-width: 100%;
}

:global(body.dark-mode .story-preview) {
  background: #070b13;
}
</style>
