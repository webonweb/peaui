<script setup lang="ts">
import type { ApiEntry, NamedApiEntry } from '../types';
import { useI18n } from '../i18n';

const { t } = useI18n();

defineProps<{
  entries: readonly ApiEntry[] | readonly NamedApiEntry[];
  kind: 'input' | 'event' | 'slot';
}>();

function isApiEntry(entry: ApiEntry | NamedApiEntry): entry is ApiEntry {
  return 'required' in entry;
}
</script>

<template>
  <div class="api-table-wrap">
    <table class="api-table">
      <thead>
        <tr>
          <th>{{ t('common.name') }}</th>
          <th v-if="entries.some((entry) => entry.type)">{{ t('common.type') }}</th>
          <th v-if="kind === 'input'">{{ t('common.default') }}</th>
          <th>{{ t('common.description') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="entry in entries" :key="entry.name">
          <td>
            <code>{{ entry.name }}</code>
            <span v-if="isApiEntry(entry) && entry.required" class="required-mark">{{
              t('common.required')
            }}</span>
          </td>
          <td v-if="entries.some((entry) => entry.type)">
            <code v-if="entry.type" class="type-code">{{ entry.type }}</code>
            <span v-else>—</span>
          </td>
          <td v-if="kind === 'input'">
            <code v-if="isApiEntry(entry) && entry.default !== undefined">{{ entry.default }}</code>
            <span v-else>—</span>
          </td>
          <td>{{ entry.description }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
