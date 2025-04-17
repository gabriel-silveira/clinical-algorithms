<template>
  <div
    class="text-caption text-center"
  >
    <q-spinner
      :color="props.color"
      :size="props.size"
    />

    <div
      v-if="props.label"
      class="q-mt-md"
      :class="props.color ? `text-${props.color}` : ''"
    >
      {{ props.label }}
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  color: {
    type: String,
    default: 'primary',
  },
  size: {
    type: String,
    default: '3em',
  },
});
</script>
