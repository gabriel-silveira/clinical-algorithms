<template>
  <div>
    <q-input
      v-model="text"
      :label="props.label"
      bottom-slots
      debounce="750"
      @update:model-value="emitSearch"
    >
      <template v-slot:append>
        <q-icon
          v-if="text !== ''"
          name="close"
          class="cursor-pointer"
          @click="emitClear"
        />

        <q-icon name="search" />
      </template>
    </q-input>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

const props = defineProps({
  value: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['search', 'clear']);

const text = ref('');

function emitSearch() {
  emit('search', text.value);
}

function emitClear() {
  text.value = '';

  emit('clear', '');
}

onMounted(() => {
  if (props.value) {
    text.value = props.value;

    emitSearch();
  }
});
</script>
