<script setup lang="ts">
import { ref } from 'vue';

import ButtonAction from '@/components/data-entry/ButtonAction/index.vue';
import TagChip from '@/components/data-display/TagChip/index.vue';
import MessageText from '@/components/feedback/MessageText/index.vue';
import FormCheckbox from '@/components/form/FormCheckbox/index.vue';
import FormInput from '@/components/form/FormInput/index.vue';

import { useI18n } from '../i18n';

type Density = 'comfortable' | 'compact';

const { t } = useI18n();
const workspaceName = ref('');
const notifications = ref(true);
const density = ref<Density>('comfortable');
const saved = ref(false);

function updateDensity(nextDensity: Density): void {
  density.value = nextDensity;
  saved.value = false;
}

function savePreferences(): void {
  saved.value = true;
}
</script>

<template>
  <section class="home-preview" :aria-label="t('home.previewLabel')">
    <header class="home-preview__header">
      <span>{{ t('home.previewEyebrow') }}</span>
      <TagChip as="span" size="xxs" variant="green" :label="t('home.previewBadge')" />
    </header>

    <div class="home-preview__intro">
      <h2>{{ t('home.previewTitle') }}</h2>
      <p>{{ t('home.previewDescription') }}</p>
    </div>

    <form class="home-preview__form" @submit.prevent="savePreferences">
      <FormInput
        id="home-preview-workspace"
        v-model:value="workspaceName"
        name="workspace-name"
        :label="t('home.previewName')"
        :placeholder="t('home.previewNamePlaceholder')"
        can-erase
        @update:value="saved = false"
      />

      <FormCheckbox
        id="home-preview-notifications"
        v-model:value="notifications"
        name="accessibility-updates"
        @update:value="saved = false"
      >
        {{ t('home.previewNotifications') }}
      </FormCheckbox>

      <fieldset class="home-preview__density">
        <legend>{{ t('home.previewPlan') }}</legend>
        <div>
          <TagChip
            as="button"
            size="xs"
            variant="outline"
            :active="density === 'comfortable'"
            :label="t('home.previewPlanComfortable')"
            @click="updateDensity('comfortable')"
          />
          <TagChip
            as="button"
            size="xs"
            variant="outline"
            :active="density === 'compact'"
            :label="t('home.previewPlanCompact')"
            @click="updateDensity('compact')"
          />
        </div>
      </fieldset>

      <ButtonAction type="submit" size="m" variant="primary">
        {{ t('home.previewSave') }}
      </ButtonAction>

      <MessageText
        v-if="saved"
        id="home-preview-feedback"
        role="status"
        variant="success"
        size="xs"
      >
        {{ t('home.previewSavedMessage') }}
      </MessageText>
    </form>
  </section>
</template>
